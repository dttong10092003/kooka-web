import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Heart, Star, Clock, Sparkles, TrendingUp, ChevronLeft, ChevronRight, Filter, ChefHat } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchNewestRecipes, fetchPopularRecipes, fetchRecipes, fetchTags, fetchCuisines, fetchCategories } from '../redux/slices/recipeSlice';
import { toggleFavorite, checkMultipleRecipes } from '../redux/slices/favoriteSlice';
import type { Recipe as ReduxRecipe } from '../redux/slices/recipeSlice';
import FilterModal from '../components/FilterModal';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

interface Recipe {
  id: string;
  title: string;
  image: string;
  duration: string;
  difficulty: string;
  rating?: number;
  reviews?: number;
  servings?: number;
  cuisine?: string;
  ingredients?: string[];
}

const AllRecipes = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: 'new' | 'popular' | 'all' }>();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { newestRecipes, popularRecipes, recipes: allRecipes, loading, categories } = useSelector((state: RootState) => state.recipes);
  const { favoriteRecipeIds } = useSelector((state: RootState) => state.favorites);
  const { user } = useSelector((state: RootState) => state.auth);
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Initialize filters with category from navigation state if available
  const initialCategoryId = (location.state as { categoryId?: string })?.categoryId || "";
  const categoryNameFromState = (location.state as { categoryName?: string })?.categoryName || "";
  
  const [filters, setFilters] = useState({
    selectedCategory: initialCategoryId,
    selectedTags: [] as string[],
    selectedCuisine: "",
  });

  const isNewRecipes = type === 'new';
  const isAllRecipes = type === 'all';
  
  const recipes = isAllRecipes ? allRecipes : (isNewRecipes ? newestRecipes : popularRecipes);

  // Fetch filter options
  useEffect(() => {
    dispatch(fetchTags());
    dispatch(fetchCuisines());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Auto-select category when navigating from footer
  useEffect(() => {
    if (categoryNameFromState && categories.length > 0) {
      const matchedCategory = categories.find(
        cat => cat.name.toLowerCase() === categoryNameFromState.toLowerCase()
      );
      if (matchedCategory && matchedCategory._id !== filters.selectedCategory) {
        setFilters(prev => ({
          ...prev,
          selectedCategory: matchedCategory._id
        }));
      }
    }
  }, [categoryNameFromState, categories]);

  useEffect(() => {
    // Fetch recipes based on type - only if not already loaded from App
    if (isAllRecipes) {
      if (allRecipes.length === 0) {
        dispatch(fetchRecipes());
      }
    } else if (isNewRecipes) {
      dispatch(fetchNewestRecipes());
    } else {
      dispatch(fetchPopularRecipes());
    }
  }, [dispatch, isNewRecipes, isAllRecipes, allRecipes.length]);

  // Check favorites for displayed recipes when user is logged in
  useEffect(() => {
    if (user && recipes.length > 0) {
      const recipeIds = recipes.map(r => r._id);
      if (recipeIds.length > 0) {
        dispatch(checkMultipleRecipes({ recipeIds }));
      }
    }
  }, [user?._id, recipes.length, dispatch]);

  const handleFavoriteClick = async (e: React.MouseEvent, recipeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const result = await dispatch(toggleFavorite({ recipeId })).unwrap();
      
      // Show toast based on action
      if (result.message?.includes('added') || result.message?.includes('thêm')) {
        toast.success(
          language === 'vi' 
            ? '❤️ Đã thêm vào yêu thích!' 
            : '❤️ Added to favorites!',
          {
            duration: 2000,
            position: 'top-center',
          }
        );
      } else {
        toast.success(
          language === 'vi' 
            ? '💔 Đã bỏ yêu thích!' 
            : '💔 Removed from favorites!',
          {
            duration: 2000,
            position: 'top-center',
          }
        );
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error(
        language === 'vi' 
          ? 'Có lỗi xảy ra. Vui lòng thử lại!' 
          : 'An error occurred. Please try again!',
        {
          duration: 2000,
          position: 'top-center',
        }
      );
    }
  };

  const convertRecipes = (reduxRecipes: ReduxRecipe[]): Recipe[] => {
    return reduxRecipes.map((recipe) => ({
      id: recipe._id,
      title: recipe.name,
      image: recipe.image,
      duration: `${recipe.time} phút`,
      difficulty: recipe.difficulty,
      rating: recipe.rate,
      reviews: recipe.numberOfRate,
      servings: recipe.size,
      cuisine: recipe.cuisine.name,
      ingredients: recipe.ingredients.map(ing => ing.name)
    }));
  };

  // Apply filters before converting
  const filteredReduxRecipes = recipes.filter(recipe => {
    // Check category match
    const matchesCategory = !filters.selectedCategory || 
      recipe.category._id === filters.selectedCategory;
    
    // Check cuisine match
    const matchesCuisine = !filters.selectedCuisine || 
      recipe.cuisine._id === filters.selectedCuisine;
    
    // Check tags match - món ăn phải có TẤT CẢ tags được chọn
    const matchesTags = filters.selectedTags.length === 0 || 
      filters.selectedTags.every(tagId => 
        recipe.tags.some(tag => tag._id === tagId)
      );
    
    return matchesCategory && matchesCuisine && matchesTags;
  });
  
  const filteredRecipes = convertRecipes(filteredReduxRecipes);
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedRecipes = filteredRecipes.slice(startIndex, endIndex);

  // Reset to page 1 when type or filters change
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [type, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFilterCount = () => {
    return (filters.selectedCategory ? 1 : 0) + filters.selectedTags.length + (filters.selectedCuisine ? 1 : 0);
  };

  // Dynamic configuration based on type
  const config = isAllRecipes ? {
    icon: ChefHat,
    iconColor: 'text-blue-600',
    title: 'Tất Cả Món Ăn',
    description: 'Khám phá toàn bộ kho công thức nấu ăn phong phú của chúng tôi',
    gradientFrom: 'from-blue-50',
    gradientVia: 'via-indigo-50',
    gradientTo: 'to-blue-50',
    buttonColor: 'bg-blue-500 hover:bg-blue-600',
    hoverColor: 'group-hover:text-blue-600',
    emptyIcon: ChefHat
  } : isNewRecipes ? {
    icon: Sparkles,
    iconColor: 'text-orange-500',
    title: 'Món Ăn Mới',
    description: 'Khám phá các công thức nấu ăn mới nhất được cập nhật liên tục',
    gradientFrom: 'from-orange-50',
    gradientVia: 'via-yellow-50',
    gradientTo: 'to-orange-50',
    buttonColor: 'bg-orange-500 hover:bg-orange-600',
    hoverColor: 'group-hover:text-orange-600',
    emptyIcon: Sparkles
  } : {
    icon: TrendingUp,
    iconColor: 'text-pink-600',
    title: 'Món Ăn Phổ Biến',
    description: 'Khám phá các món ăn được yêu thích nhất bởi cộng đồng',
    gradientFrom: 'from-pink-50',
    gradientVia: 'via-purple-50',
    gradientTo: 'to-pink-50',
    buttonColor: 'bg-pink-500 hover:bg-pink-600',
    hoverColor: 'group-hover:text-pink-600',
    emptyIcon: TrendingUp
  };

  const Icon = config.icon;
  const EmptyIcon = config.emptyIcon;

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
    const isFavorited = favoriteRecipeIds.includes(recipe.id);

    return (
      <div
        className="relative group flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => navigate(`/recipe/${recipe.id}`)}
      >
        {/* Image */}
        <div className="relative h-[160px] sm:h-[180px] md:h-[200px]">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Rating badge */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
            <Star size={12} fill="#fbbf24" className="text-amber-400 md:w-3.5 md:h-3.5" />
            <span className="text-xs md:text-sm font-medium">{recipe.rating}</span>
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => handleFavoriteClick(e, recipe.id)}
            className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 z-20 hover:scale-110 active:scale-95"
            aria-label={isFavorited ? "Bỏ yêu thích" : "Yêu thích"}
          >
            <Heart 
              size={16} 
              className={`md:w-[18px] md:h-[18px] transition-all duration-200 ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
              }`} 
            />
          </button>

          {/* Difficulty badge */}
          <div className={`absolute bottom-2 right-2 md:bottom-3 md:right-3 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-medium ${
            recipe.difficulty === 'Dễ'
              ? 'bg-green-100 text-green-800'
              : recipe.difficulty === 'Khó'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}>
            {recipe.difficulty}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-4">
          <h3 className="font-bold text-base md:text-lg mb-2 text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
            {recipe.title}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
            <div className="flex items-center gap-1">
              <Clock size={14} className="md:w-4 md:h-4" />
              <span>{recipe.duration}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span>{recipe.servings} người</span>
          </div>

          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1 md:gap-1.5 mb-2 md:mb-3">
              {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                <span
                  key={index}
                  className="px-1.5 py-0.5 md:px-2 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  {ingredient}
                </span>
              ))}
              {recipe.ingredients.length > 3 && (
                <span className="px-1.5 py-0.5 md:px-2 bg-gray-100 text-gray-700 text-xs rounded-md">
                  +{recipe.ingredients.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Rating and Action button */}
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs md:text-sm text-gray-600">
              {recipe.reviews ? `${recipe.reviews} đánh giá` : '0 đánh giá'}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/recipe/${recipe.id}`);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-colors text-xs md:text-sm whitespace-nowrap"
            >
              Xem Công Thức
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="py-6 md:py-8">
        <div className="px-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <Icon className={config.iconColor} size={28} strokeWidth={2} />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">{config.title}</h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            {config.description}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 md:px-8 lg:px-12 py-6 md:py-12">
        {loading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-[200px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex gap-3">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-100 rounded w-16"></div>
                      <div className="h-6 bg-gray-100 rounded w-16"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Filter Bar - Always visible */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div className="text-gray-600 text-xs sm:text-sm">
                Hiển thị <span className="font-semibold">{filteredRecipes.length > 0 ? startIndex + 1 : 0}-{filteredRecipes.length > 0 ? Math.min(endIndex, filteredRecipes.length) : 0}</span> trong tổng số <span className="font-semibold">{filteredRecipes.length}</span> món ăn
              </div>
              
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className={`px-3 sm:px-4 py-2 border rounded-lg flex items-center gap-2 transition-all relative text-sm ${
                  getFilterCount() > 0
                    ? `${config.buttonColor} text-white border-transparent`
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter size={16} />
                <span className="font-medium">Bộ lọc</span>
                {getFilterCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getFilterCount()}
                  </span>
                )}
              </button>
            </div>

            {filteredRecipes.length === 0 ? (
              <div className="text-center py-20">
                <EmptyIcon className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {getFilterCount() > 0 ? 'Không tìm thấy món ăn phù hợp' : `Chưa có ${config.title.toLowerCase()}`}
                </h3>
                <p className="text-gray-600">
                  {getFilterCount() > 0 ? 'Thử thay đổi bộ lọc để xem thêm món ăn' : 'Hãy quay lại sau để khám phá các công thức mới nhất!'}
                </p>
              </div>
            ) : (
              <>
                {/* Recipe Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {displayedRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
              <div className="bg-white px-4 sm:px-6 py-4 border-t border-gray-200 rounded-b-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Items per page selector */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-700">
                      of {filteredRecipes.length} recipes
                    </span>
                  </div>

                  {/* Page navigation */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                              currentPage === pageNum
                                ? "bg-orange-500 text-white"
                                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Page info */}
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              </div>
            )}
            </>
          )}
          </>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setIsFilterOpen(false);
        }}
        initialFilters={filters}
        colorScheme="orange"
      />
    </div>
  );
};

export default AllRecipes;
