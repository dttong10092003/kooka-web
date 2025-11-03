import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Utensils, ChefHat } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchCategories } from '../redux/slices/recipeSlice';

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading } = useSelector((state: RootState) => state.recipes);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Category icons mapping (you can customize these)
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('chính')) return '🍽️';
    if (name.includes('tráng miệng') || name.includes('ngọt')) return '🍰';
    if (name.includes('khai vị')) return '🥗';
    if (name.includes('súp') || name.includes('canh')) return '🍲';
    if (name.includes('nước')) return '🥤';
    if (name.includes('bánh')) return '🥐';
    if (name.includes('ăn vặt')) return '🍿';
    return '🍴';
  };

  // Category colors
  const getCategoryColor = (index: number) => {
    const colors = [
      'from-orange-400 to-red-500',
      'from-blue-400 to-indigo-500',
      'from-green-400 to-emerald-500',
      'from-purple-400 to-pink-500',
      'from-yellow-400 to-orange-500',
      'from-pink-400 to-rose-500',
      'from-cyan-400 to-blue-500',
      'from-lime-400 to-green-500',
    ];
    return colors[index % colors.length];
  };

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to all recipes page with category filter
    navigate(`/recipes/all`, { state: { categoryId } });
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-16 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl">🍳</div>
          <div className="absolute top-20 right-20 text-5xl">🥘</div>
          <div className="absolute bottom-10 left-1/4 text-7xl">🍲</div>
          <div className="absolute bottom-20 right-1/3 text-6xl">🍜</div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Utensils size={48} />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">Danh Mục Món Ăn</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Khám phá các món ăn theo danh mục yêu thích của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-48">
                  <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <ChefHat className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Chưa có danh mục nào
            </h3>
            <p className="text-gray-600">
              Hãy quay lại sau để khám phá các danh mục món ăn!
            </p>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">{categories.length}</div>
                  <div className="text-sm text-gray-600">Danh Mục</div>
                </div>
                <div className="h-12 w-px bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">∞</div>
                  <div className="text-sm text-gray-600">Công Thức</div>
                </div>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div
                  key={category._id}
                  onClick={() => handleCategoryClick(category._id)}
                  className="group cursor-pointer"
                >
                  <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(index)} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10 p-6 flex flex-col items-center justify-center h-48 text-white">
                      {/* Icon */}
                      <div className="text-6xl mb-3 transform group-hover:scale-110 transition-transform">
                        {getCategoryIcon(category.name)}
                      </div>
                      
                      {/* Category Name */}
                      <h3 className="text-xl font-bold text-center mb-2">
                        {category.name}
                      </h3>
                      
                      {/* Recipe Count Badge */}
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm font-medium">
                          Khám phá ngay
                        </span>
                      </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/30 rounded-2xl transition-all"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-2xl font-bold mb-3">
                Khám Phá Thêm Món Ăn
              </h2>
              <p className="text-white/90 mb-6">
                Xem tất cả các công thức nấu ăn đa dạng của chúng tôi
              </p>
              <button
                onClick={() => navigate('/recipes/all')}
                className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Xem Tất Cả Công Thức
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;
