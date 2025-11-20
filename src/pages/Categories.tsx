import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Tag as TagIcon, Globe } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchCategories, fetchTags, fetchCuisines } from '../redux/slices/recipeSlice';

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { categories, tags, cuisines, loading } = useSelector((state: RootState) => state.recipes);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'tags' | 'cuisines'>('categories');

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTags());
    dispatch(fetchCuisines());
  }, [dispatch]);

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    navigate(`/recipes/all`, { state: { categoryId, categoryName } });
  };

  const handleTagClick = (tagId: string, tagName: string) => {
    navigate(`/recipes/all`, { state: { tagId, tagName } });
  };

  const handleCuisineClick = (cuisineId: string, cuisineName: string) => {
    navigate(`/recipes/all`, { state: { cuisineId, cuisineName } });
  };

  // Lọc tất cả theo search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCuisines = cuisines.filter(cuisine =>
    cuisine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tự động chuyển tab nếu search có kết quả
  useEffect(() => {
    if (searchTerm) {
      if (filteredCategories.length > 0 && activeTab !== 'categories') {
        setActiveTab('categories');
      } else if (filteredCategories.length === 0 && filteredTags.length > 0 && activeTab !== 'tags') {
        setActiveTab('tags');
      } else if (filteredCategories.length === 0 && filteredTags.length === 0 && filteredCuisines.length > 0 && activeTab !== 'cuisines') {
        setActiveTab('cuisines');
      }
    }
  }, [searchTerm, filteredCategories.length, filteredTags.length, filteredCuisines.length]);

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('chính')) return '🍽️';
    if (name.includes('tráng miệng') || name.includes('ngọt')) return '🍰';
    if (name.includes('khai vị')) return '🥗';
    if (name.includes('súp') || name.includes('canh')) return '🍲';
    if (name.includes('nước') || name.includes('đồ uống')) return '🥤';
    if (name.includes('bánh')) return '🥐';
    if (name.includes('ăn vặt')) return '🍿';
    if (name.includes('sáng')) return '🌅';
    if (name.includes('tối') || name.includes('tăm')) return '🌙';
    if (name.includes('trưa')) return '☀️';
    if (name.includes('chay')) return '🥬';
    return '🍴';
  };

  const getCategoryGradient = (index: number) => {
    const gradients = [
      'from-orange-400 to-red-500',
      'from-blue-400 to-cyan-500',
      'from-green-400 to-emerald-500',
      'from-purple-400 to-pink-500',
      'from-yellow-400 to-orange-500',
      'from-pink-400 to-rose-500',
      'from-indigo-400 to-purple-500',
      'from-teal-400 to-green-500',
    ];
    return gradients[index % gradients.length];
  };

  const getTagIcon = (tagName: string) => {
    const name = tagName.toLowerCase();
    if (name.includes('nhanh') || name.includes('dễ')) return '⚡';
    if (name.includes('khỏe') || name.includes('healthy')) return '💪';
    if (name.includes('giảm cân')) return '🎯';
    if (name.includes('tiệc') || name.includes('party')) return '🎉';
    if (name.includes('trẻ em')) return '👶';
    if (name.includes('chay')) return '🌱';
    return '🏷️';
  };

  const getCuisineIcon = (cuisineName: string) => {
    const name = cuisineName.toLowerCase();
    if (name.includes('việt')) return '🇻🇳';
    if (name.includes('nhật')) return '🇯🇵';
    if (name.includes('hàn')) return '🇰🇷';
    if (name.includes('trung')) return '🇨🇳';
    if (name.includes('thái')) return '🇹🇭';
    if (name.includes('ý')) return '🇮🇹';
    if (name.includes('pháp')) return '🇫🇷';
    if (name.includes('mỹ')) return '🇺🇸';
    return '🌏';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white py-24 overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl animate-pulse">🍳</div>
          <div className="absolute top-32 right-20 text-7xl animate-bounce">🥗</div>
          <div className="absolute bottom-10 left-1/4 text-9xl animate-pulse">🍰</div>
          <div className="absolute bottom-20 right-1/3 text-8xl animate-bounce">🍜</div>
        </div>

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-black mb-4 tracking-tight drop-shadow-lg">
              Khám Phá Danh Mục
            </h1>
            <p className="text-2xl text-white/95 mb-8 font-medium drop-shadow">
              Chọn danh mục để tìm món ăn yêu thích của bạn
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-orange-400 group-focus-within:text-orange-500 transition-colors z-10" size={22} />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 rounded-full text-gray-900 text-base font-medium bg-white/95 backdrop-blur-sm border-2 border-white/50 focus:border-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-white/40 shadow-xl placeholder:text-gray-400 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-4 py-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <Clock size={20} />
              <span>Theo Bữa Ăn</span>
              <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/30">
                {searchTerm ? filteredCategories.length : categories.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('tags')}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 whitespace-nowrap ${
                activeTab === 'tags'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <TagIcon size={20} />
              <span>Theo Tags</span>
              <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/30">
                {searchTerm ? filteredTags.length : tags.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('cuisines')}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 whitespace-nowrap ${
                activeTab === 'cuisines'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <Globe size={20} />
              <span>Theo Quốc Gia</span>
              <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/30">
                {searchTerm ? filteredCuisines.length : cuisines.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 rounded-3xl h-80"></div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length === 0 && filteredTags.length === 0 && filteredCuisines.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-600 text-lg">
              Thử tìm kiếm với từ khóa khác nhé!
            </p>
          </div>
        ) : (
          <>
            {/* Meal Time Categories Section */}
            {activeTab === 'categories' && (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCategories.map((category, index) => (
                    <div
                      key={category._id}
                      onClick={() => handleCategoryClick(category._id, category.name)}
                      className="group cursor-pointer"
                    >
                      <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(index)}`}></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full translate-y-20 -translate-x-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/20 transition-colors"></div>
                        <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
                          <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
                            <div className="relative text-8xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                              {getCategoryIcon(category.name)}
                            </div>
                          </div>
                          <div className="bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl mb-4">
                            <h3 className="text-2xl font-bold text-center leading-tight">
                              {category.name}
                            </h3>
                          </div>
                          <div className="bg-white text-gray-900 px-6 py-2.5 rounded-full group-hover:bg-white group-hover:shadow-xl transition-all duration-300">
                            <span className="text-sm font-bold flex items-center space-x-2">
                              <span>Khám phá ngay</span>
                              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
                        <div className="absolute inset-0 rounded-3xl border-4 border-white/0 group-hover:border-white/50 transition-all duration-500"></div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredCategories.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-600 text-xl">Không tìm thấy danh mục nào</p>
                  </div>
                )}
              </div>
            )}

            {/* Tags Section */}
            {activeTab === 'tags' && (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredTags.map((tag, index) => (
                    <div
                      key={tag._id}
                      onClick={() => handleTagClick(tag._id, tag.name)}
                      className="group cursor-pointer"
                    >
                      <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(index)}`}></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full translate-y-20 -translate-x-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/20 transition-colors"></div>
                        <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
                          <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
                            <div className="relative text-8xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                              {getTagIcon(tag.name)}
                            </div>
                          </div>
                          <div className="bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl mb-4">
                            <h3 className="text-2xl font-bold text-center leading-tight">
                              {tag.name}
                            </h3>
                          </div>
                          <div className="bg-white text-gray-900 px-6 py-2.5 rounded-full group-hover:bg-white group-hover:shadow-xl transition-all duration-300">
                            <span className="text-sm font-bold flex items-center space-x-2">
                              <span>Khám phá ngay</span>
                              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
                        <div className="absolute inset-0 rounded-3xl border-4 border-white/0 group-hover:border-white/50 transition-all duration-500"></div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredTags.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-600 text-xl">Không tìm thấy tag nào</p>
                  </div>
                )}
              </div>
            )}

            {/* Cuisines Section */}
            {activeTab === 'cuisines' && (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCuisines.map((cuisine, index) => (
                    <div
                      key={cuisine._id}
                      onClick={() => handleCuisineClick(cuisine._id, cuisine.name)}
                      className="group cursor-pointer"
                    >
                      <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(index)}`}></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full translate-y-20 -translate-x-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/20 transition-colors"></div>
                        <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
                          <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
                            <div className="relative text-8xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                              {getCuisineIcon(cuisine.name)}
                            </div>
                          </div>
                          <div className="bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl mb-4">
                            <h3 className="text-2xl font-bold text-center leading-tight">
                              {cuisine.name}
                            </h3>
                          </div>
                          <div className="bg-white text-gray-900 px-6 py-2.5 rounded-full group-hover:bg-white group-hover:shadow-xl transition-all duration-300">
                            <span className="text-sm font-bold flex items-center space-x-2">
                              <span>Khám phá ngay</span>
                              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
                        <div className="absolute inset-0 rounded-3xl border-4 border-white/0 group-hover:border-white/50 transition-all duration-500"></div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredCuisines.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-600 text-xl">Không tìm thấy quốc gia nào</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;
