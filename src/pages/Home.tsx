import { useState, useEffect, useMemo } from 'react';
import { Heart, Info, Play, ChevronLeft, ChevronRight, Star, Clock, ChefHat, TrendingUp, Sparkles, MessageSquare, Flame, ThumbsUp, TrendingDown, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchNewestRecipes, fetchPopularRecipes } from '../redux/slices/recipeSlice';
import { toggleFavorite, checkMultipleRecipes } from '../redux/slices/favoriteSlice';

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

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { topRatedRecipes, newestRecipes, popularRecipes: popularRecipesData, trendingRecipes, loading } = useSelector((state: RootState) => state.recipes);
  const { topComments, newestComments } = useSelector((state: RootState) => state.comments);
  const { mostFavorited, favoriteRecipeIds } = useSelector((state: RootState) => state.favorites);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState<{ [key: string]: boolean }>({});
  const [canScrollRight, setCanScrollRight] = useState<{ [key: string]: boolean }>({});

  // Lazy load newest và popular recipes khi component mount
  useEffect(() => {
    if (newestRecipes.length === 0) {
      dispatch(fetchNewestRecipes());
    }
    if (popularRecipesData.length === 0) {
      dispatch(fetchPopularRecipes());
    }
  }, [dispatch, newestRecipes.length, popularRecipesData.length]);

  // Check favorites for displayed recipes when user is logged in
  useEffect(() => {
    if (user && (topRatedRecipes.length > 0 || newestRecipes.length > 0 || popularRecipesData.length > 0)) {
      const allRecipeIds = [
        ...topRatedRecipes.map(r => r._id),
        ...newestRecipes.map(r => r._id),
        ...popularRecipesData.map(r => r._id)
      ];
      // Remove duplicates
      const uniqueIds = Array.from(new Set(allRecipeIds));
      if (uniqueIds.length > 0) {
        dispatch(checkMultipleRecipes({ recipeIds: uniqueIds }));
      }
    }
  }, [user?._id, topRatedRecipes.length, newestRecipes.length, popularRecipesData.length, dispatch]);

  // Convert Redux recipes to local Recipe format
  // useMemo để tránh re-convert mỗi lần render
  const featuredRecipes: Recipe[] = useMemo(() => {
    return topRatedRecipes.map((recipe) => ({
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
  }, [topRatedRecipes]);

  // Convert newest recipes from Redux
  const newRecipes: Recipe[] = useMemo(() => {
    return newestRecipes.map((recipe) => ({
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
  }, [newestRecipes]);

  // Convert popular recipes from Redux
  const popularRecipes: Recipe[] = useMemo(() => {
    return popularRecipesData.map((recipe) => ({
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
  }, [popularRecipesData]);

  // Không cần fetch nữa vì đã được prefetch trong App.tsx  // Auto-rotate featured recipes every 10 seconds
  useEffect(() => {
    if (featuredRecipes.length === 0) return;
    
    const interval = setInterval(() => {
      setSelectedRecipeIndex((prevIndex) => (prevIndex + 1) % featuredRecipes.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [featuredRecipes.length]);

  const featuredRecipe = featuredRecipes[selectedRecipeIndex];

  // Check scroll position to show/hide arrows
  const checkScrollPosition = (containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      const canLeft = container.scrollLeft > 0;
      const canRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 10;

      setCanScrollLeft(prev => ({ ...prev, [containerId]: canLeft }));
      setCanScrollRight(prev => ({ ...prev, [containerId]: canRight }));
    }
  };

  // Initialize scroll position check
  useEffect(() => {
    const containers = ['new-recipes', 'popular-recipes'];
    containers.forEach(id => {
      checkScrollPosition(id);
      const container = document.getElementById(id);
      if (container) {
        container.addEventListener('scroll', () => checkScrollPosition(id));
      }
    });

    return () => {
      containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
          container.removeEventListener('scroll', () => checkScrollPosition(id));
        }
      });
    };
  }, []);

  const scrollContainer = (direction: 'left' | 'right', containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(() => checkScrollPosition(containerId), 300);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent, recipeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await dispatch(toggleFavorite({ recipeId })).unwrap();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
    const isFavorited = favoriteRecipeIds.includes(recipe.id);

    return (
      <div
        className="relative group flex-shrink-0 w-[280px] cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
        onClick={() => navigate(`/recipe/${recipe.id}`)}
      >
        {/* Image */}
        <div className="relative h-[180px]">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Rating badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star size={14} fill="#fbbf24" className="text-amber-400" />
            <span className="text-sm font-medium">{recipe.rating}</span>
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => handleFavoriteClick(e, recipe.id)}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 z-20 hover:scale-110 active:scale-95"
            aria-label={isFavorited ? "Bỏ yêu thích" : "Yêu thích"}
          >
            <Heart 
              size={18} 
              className={`transition-all duration-200 ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
              }`} 
            />
          </button>

          {/* Difficulty badge */}
          <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${recipe.difficulty === 'Dễ'
              ? 'bg-green-100 text-green-800'
              : recipe.difficulty === 'Khó'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
            {recipe.difficulty}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            {recipe.title}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{recipe.duration}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span>{recipe.servings} người</span>
          </div>

          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  {ingredient}
                </span>
              ))}
              {recipe.ingredients.length > 4 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">
                  +{recipe.ingredients.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Rating and Action button */}
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm text-gray-600">
              {recipe.reviews ? `${recipe.reviews} đánh giá` : '0 đánh giá'}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/recipe/${recipe.id}`);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              View Recipe
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-100/40 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section - Redesigned */}
      <div className="relative h-[660px] mb-16 overflow-hidden">
        {loading || featuredRecipes.length === 0 ? (
          // Loading state với skeleton UI
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 animate-gradient">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-20 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>
            
            <div className="relative h-full flex items-center px-12">
              <div className="w-full max-w-2xl space-y-6 animate-pulse">
                {/* Badge skeleton */}
                <div className="inline-block h-9 w-48 bg-gradient-to-r from-orange-300/40 to-yellow-300/40 rounded-full"></div>
                
                {/* Title skeleton */}
                <div className="space-y-3">
                  <div className="h-12 bg-gradient-to-r from-gray-300/60 to-gray-200/60 rounded-lg w-3/4"></div>
                  <div className="h-12 bg-gradient-to-r from-gray-300/60 to-gray-200/60 rounded-lg w-2/3"></div>
                </div>
                
                {/* Ingredients skeleton */}
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 w-24 bg-gradient-to-r from-gray-200/60 to-gray-300/60 rounded-md"></div>
                  ))}
                </div>
                
                {/* Description skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200/50 to-gray-300/50 rounded w-full"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200/50 to-gray-300/50 rounded w-5/6"></div>
                </div>
                
                {/* Meta info skeleton */}
                <div className="flex gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 w-20 bg-gradient-to-r from-gray-300/60 to-gray-200/60 rounded"></div>
                  ))}
                </div>
                
                {/* Buttons skeleton */}
                <div className="flex gap-4 pt-2">
                  <div className="h-14 w-48 bg-gradient-to-r from-emerald-400/60 to-emerald-500/60 rounded-full"></div>
                  <div className="h-14 w-14 bg-gradient-to-r from-gray-400/40 to-gray-500/40 rounded-full"></div>
                  <div className="h-14 w-14 bg-gradient-to-r from-gray-400/40 to-gray-500/40 rounded-full"></div>
                </div>
              </div>
              
              {/* Spinner */}
              <div className="absolute top-1/2 right-12 -translate-y-1/2">
                <div className="relative">
                  <ChefHat className="w-16 h-16 text-orange-400 animate-bounce" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Thumbnail gallery skeleton */}
            <div className="absolute bottom-6 right-6 flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-20 h-14 bg-gradient-to-br from-gray-300/50 to-gray-400/50 rounded-md animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
              ))}
            </div>
          </div>
        ) : featuredRecipe ? (
          <>
            {/* Background image with parallax effect */}
            <div className="absolute inset-0">
              <img
                src={featuredRecipe.image}
                alt={featuredRecipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/50"></div>
            </div>

            {/* Content - Full width */}
            <div className="relative h-full flex items-center">
              <div className="w-full px-12 py-16">
                <div className="max-w-2xl">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-5 py-2 rounded-full font-bold text-sm mb-6">
                    <Sparkles size={18} />
                    CÔNG THỨC NỔI BẬT
                  </div>

                  <h1 className="text-white text-5xl font-bold mb-4 leading-tight">
                    {featuredRecipe.title}
                  </h1>

                  {/* Ingredients Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredRecipe.ingredients?.slice(0, 4).map((ingredient, index) => (
                      <span key={index} className="px-3 py-1.5 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white border border-white/20">
                        {ingredient}
                      </span>
                    ))}
                    {(featuredRecipe.ingredients?.length || 0) > 4 && (
                      <span className="px-3 py-1.5 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white border border-white/20">
                        +{(featuredRecipe.ingredients?.length || 0) - 4}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-2xl">
                    {featuredRecipe.title} - Một trong những món ăn được đánh giá cao nhất với hương vị đậm đà và cách làm tuyệt vời.
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-2 text-white">
                      <Star size={20} fill="#fbbf24" className="text-amber-400" />
                      <span className="font-bold">{featuredRecipe.rating?.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <Clock size={20} />
                      <span>{featuredRecipe.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <ChefHat size={20} />
                      <span>{featuredRecipe.difficulty}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-4">
                    <button 
                      onClick={() => navigate(`/recipe/${featuredRecipe.id}`)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white pl-6 pr-8 py-3.5 rounded-full flex items-center gap-3 font-bold text-base transition-all duration-300 shadow-lg"
                    >
                      <Play size={20} fill="white" />
                      Xem Công Thức
                    </button>
                    <button 
                      onClick={(e) => handleFavoriteClick(e, featuredRecipe.id)}
                      className="bg-gray-800/60 backdrop-blur-sm hover:bg-gray-800/80 text-white p-3.5 rounded-full transition-all duration-300 border border-white/20"
                    >
                      <Heart 
                        size={20} 
                        className={favoriteRecipeIds.includes(featuredRecipe.id) ? 'fill-red-500 text-red-500' : ''}
                      />
                    </button>
                    <button 
                      onClick={() => navigate(`/recipe/${featuredRecipe.id}`)}
                      className="bg-gray-800/60 backdrop-blur-sm hover:bg-gray-800/80 text-white p-3.5 rounded-full transition-all duration-300 border border-white/20"
                    >
                      <Info size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail gallery at bottom right */}
            <div className="absolute bottom-6 right-6 flex gap-2 z-10">
              {featuredRecipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRecipeIndex(index);
                  }}
                  onDoubleClick={() => navigate(`/recipe/${recipe.id}`)}
                  className={`w-20 h-14 rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-black/20 backdrop-blur-sm ${selectedRecipeIndex === index
                      ? 'border-2 border-yellow-400 scale-105'
                      : 'border-2 border-white/30'
                    }`}
                  title={recipe.title}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* New Recipes Section */}
      <div className="relative px-12 mb-20">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-orange-500" size={28} />
            <h2 className="text-gray-900 text-3xl font-bold">
              Món Ăn Mới
            </h2>
          </div>
        </div>

        <div className="relative">
          {loading ? (
            // Loading skeleton
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] animate-pulse">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="h-[180px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="flex gap-3">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-100 rounded w-16"></div>
                        <div className="h-6 bg-gray-100 rounded w-16"></div>
                        <div className="h-6 bg-gray-100 rounded w-16"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-10 bg-orange-200 rounded-lg w-28"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Left Arrow */}
              {canScrollLeft['new-recipes'] && (
                <button
                  onClick={() => scrollContainer('left', 'new-recipes')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:scale-110"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Scrollable Container */}
              <div
                id="new-recipes"
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {newRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>

              {/* Right Arrow */}
              {canScrollRight['new-recipes'] && (
                <button
                  onClick={() => scrollContainer('right', 'new-recipes')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:scale-110"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Popular Recipes Section */}
      <div className="relative px-12 mb-20">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-pink-600" size={28} />
            <h2 className="text-gray-900 text-3xl font-bold">
              Món Ăn Phổ Biến
            </h2>
          </div>
        </div>

        <div className="relative">
          {loading ? (
            // Loading skeleton
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="h-[180px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="flex gap-3">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-100 rounded w-16"></div>
                        <div className="h-6 bg-gray-100 rounded w-16"></div>
                        <div className="h-6 bg-gray-100 rounded w-16"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-10 bg-pink-200 rounded-lg w-28"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Left Arrow */}
              {canScrollLeft['popular-recipes'] && (
                <button
                  onClick={() => scrollContainer('left', 'popular-recipes')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:scale-110"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Scrollable Container */}
              <div
                id="popular-recipes"
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {popularRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>

              {/* Right Arrow */}
              {canScrollRight['popular-recipes'] && (
                <button
                  onClick={() => scrollContainer('right', 'popular-recipes')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:scale-110"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* TOP BÌNH LUẬN Section - Full Width Scrollable */}
      <div className="relative px-12 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="text-green-500" size={28} />
          <h3 className="text-gray-900 text-2xl font-bold">TOP BÌNH LUẬN</h3>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft['top-comments'] && (
            <button
              onClick={() => scrollContainer('left', 'top-comments')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:scale-110"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            id="top-comments"
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {topComments.length === 0 ? (
              <div className="w-full text-center py-8 text-gray-500">
                Chưa có bình luận nào
              </div>
            ) : (
              topComments.map((comment) => (
                <div 
                  key={comment._id} 
                  onClick={() => comment.recipe?._id && navigate(`/recipe/${comment.recipe._id}`)}
                  className="flex-shrink-0 w-[300px] bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200"
                >
                  <div className="relative h-[180px]">
                    <img 
                      src={comment.recipe?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=360&fit=crop'} 
                      alt={comment.recipe?.name || 'Recipe'} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="relative">
                          <img 
                            src={comment.userAvatar || 'https://i.pravatar.cc/150?img=1'} 
                            alt={`${comment.firstName} ${comment.lastName}`} 
                            className="w-10 h-10 rounded-full border-2 border-white object-cover" 
                          />
                        </div>
                        <div className="flex-1">
                          <span className="text-white font-semibold block">{`${comment.firstName} ${comment.lastName}`}</span>
                          {comment.recipe && (
                            <span className="text-white/80 text-xs line-clamp-1">{comment.recipe.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700 text-sm line-clamp-2 mb-3">{comment.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      {comment.ratingRecipe && (
                        <span className="flex items-center gap-1">
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                          {comment.ratingRecipe}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={14} />
                        {comment.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        {comment.replyCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Arrow */}
          {canScrollRight['top-comments'] && (
            <button
              onClick={() => scrollContainer('right', 'top-comments')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:scale-110"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Three Columns Section */}
      <div className="relative px-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* SỐI NỔI NHẤT */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Flame className="text-green-500" size={24} />
              <h3 className="text-gray-900 text-xl font-bold">SỐI NỔI NHẤT</h3>
            </div>

            <div className="space-y-3">
              {trendingRecipes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có dữ liệu
                </div>
              ) : (
                <>
                  {trendingRecipes.slice(0, 5).map((recipe, index) => {
                    // Tính toán trending based on rank changes (giả sử)
                    const trending = index < 2 ? 'up' : index === 2 ? 'same' : 'down';
                    
                    return (
                      <div 
                        key={recipe._id} 
                        onClick={() => navigate(`/recipe/${recipe._id}`)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <span className="text-xl font-bold text-gray-500 w-6">{index + 1}.</span>
                        {trending === 'up' ? (
                          <TrendingUp size={18} className="text-green-500" />
                        ) : trending === 'down' ? (
                          <TrendingDown size={18} className="text-red-500" />
                        ) : (
                          <div className="w-[18px] h-[18px] flex items-center justify-center">
                            <div className="w-3 h-0.5 bg-gray-500"></div>
                          </div>
                        )}
                        <img src={recipe.image} alt={recipe.name} className="w-10 h-14 rounded-md object-cover flex-shrink-0" />
                        <span className="text-gray-900 text-sm flex-1 line-clamp-2">{recipe.name}</span>
                      </div>
                    );
                  })}
                  {trendingRecipes.length > 5 && (
                    <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium py-2">
                      Xem thêm
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* YÊU THÍCH NHẤT */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <ThumbsUp className="text-blue-500" size={24} />
              <h3 className="text-gray-900 text-xl font-bold">YÊU THÍCH NHẤT</h3>
            </div>

            <div className="space-y-3">
              {mostFavorited.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có dữ liệu
                </div>
              ) : (
                <>
                  {mostFavorited.slice(0, 5).map((recipe, index) => {
                    // Tính toán trending based on rank changes (giả sử)
                    const trending = index < 2 ? 'up' : index === 2 ? 'same' : 'down';
                    
                    return (
                      <div 
                        key={recipe._id} 
                        onClick={() => navigate(`/recipe/${recipe._id}`)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <span className="text-xl font-bold text-gray-500 w-6">{index + 1}.</span>
                        {trending === 'up' ? (
                          <TrendingUp size={18} className="text-green-500" />
                        ) : trending === 'down' ? (
                          <TrendingDown size={18} className="text-red-500" />
                        ) : (
                          <div className="w-[18px] h-[18px] flex items-center justify-center">
                            <div className="w-3 h-0.5 bg-gray-500"></div>
                          </div>
                        )}
                        <img src={recipe.image} alt={recipe.name} className="w-10 h-14 rounded-md object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-gray-900 text-sm block line-clamp-2">{recipe.name}</span>
                          <span className="text-xs text-gray-500">{recipe.favoriteCount} lượt thích</span>
                        </div>
                      </div>
                    );
                  })}
                  {mostFavorited.length > 5 && (
                    <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium py-2">
                      Xem thêm
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* BÌNH LUẬN MỚI */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-purple-500" size={24} />
              <h3 className="text-gray-900 text-xl font-bold">BÌNH LUẬN MỚI</h3>
            </div>

            <div className="space-y-4">
              {newestComments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có bình luận mới nào
                </div>
              ) : (
                newestComments.slice(0, 5).map((comment) => (
                  <div 
                    key={comment._id} 
                    onClick={() => comment.recipe?._id && navigate(`/recipe/${comment.recipe._id}`)}
                    className="flex gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="relative flex-shrink-0">
                      {comment.userAvatar ? (
                        <img 
                          src={comment.userAvatar} 
                          alt={`${comment.firstName} ${comment.lastName}`} 
                          className="w-10 h-10 rounded-full object-cover" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User size={20} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-sm text-gray-900">
                          {`${comment.firstName} ${comment.lastName}`}
                        </span>
                        {comment.ratingRecipe && (
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            <span className="text-xs text-gray-600">{comment.ratingRecipe}</span>
                          </div>
                        )}
                      </div>
                      {comment.recipe && (
                        <div className="flex items-center gap-1 mb-1">
                          <Play size={10} className="text-orange-500" />
                          <span className="text-xs text-gray-600 line-clamp-1">{comment.recipe.name}</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-700 line-clamp-2">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Footer decoration */}
      <div className="h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>
  );
};

export default Home;