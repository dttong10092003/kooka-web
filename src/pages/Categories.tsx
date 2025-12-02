import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  Tag as TagIcon, 
  Globe,
  Coffee,
  Soup,
  IceCream,
  Utensils,
  Moon,
  Sun,
  Salad,
  Pizza,
  Cookie,
  ChefHat,
  ArrowRight,
  Sparkles,
  Heart,
  Zap,
  Target,
  PartyPopper,
  Baby,
  Leaf
} from 'lucide-react';
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
    if (name.includes('chính')) return Utensils;
    if (name.includes('tráng miệng') || name.includes('ngọt')) return IceCream;
    if (name.includes('khai vị')) return Salad;
    if (name.includes('súp') || name.includes('canh')) return Soup;
    if (name.includes('nước') || name.includes('đồ uống')) return Coffee;
    if (name.includes('bánh')) return Cookie;
    if (name.includes('ăn vặt')) return Pizza;
    if (name.includes('sáng')) return Coffee;
    if (name.includes('tối') || name.includes('tăm')) return Moon;
    if (name.includes('trưa')) return Sun;
    if (name.includes('chay')) return Leaf;
    return ChefHat;
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
    if (name.includes('nhanh') || name.includes('dễ')) return Zap;
    if (name.includes('khỏe') || name.includes('healthy')) return Heart;
    if (name.includes('giảm cân')) return Target;
    if (name.includes('tiệc') || name.includes('party')) return PartyPopper;
    if (name.includes('trẻ em')) return Baby;
    if (name.includes('chay')) return Leaf;
    return Sparkles;
  };

  const getCuisineIcon = () => {
    return Globe;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=2000&auto=format&fit=crop"
            alt="Food background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-8 py-16">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Danh Mục Công Thức
            </h1>
            <p className="text-xl text-white/95 drop-shadow">
              Khám phá công thức nấu ăn theo danh mục yêu thích
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black-100 z-10" size={22} strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục, tag, quốc gia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-4 py-3.5 rounded-lg text-gray-900 bg-white/95 backdrop-blur-sm border-2 border-white/50 focus:border-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-white/40 placeholder:text-gray-500 transition-all shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-0 z-20 bg-white   shadow-sm">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-3 py-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Clock size={18} />
              <span>Bữa Ăn</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'categories' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {searchTerm ? filteredCategories.length : categories.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('tags')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === 'tags'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <TagIcon size={18} />
              <span>Tags</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'tags' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {searchTerm ? filteredTags.length : tags.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('cuisines')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === 'cuisines'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Globe size={18} />
              <span>Quốc Gia</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'cuisines' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {searchTerm ? filteredCuisines.length : cuisines.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-40"></div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length === 0 && filteredTags.length === 0 && filteredCuisines.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <Search className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-600">
              Thử tìm kiếm với từ khóa khác
            </p>
          </div>
        ) : (
          <>
            {/* Meal Time Categories Section */}
            {activeTab === 'categories' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredCategories.map((category, index) => {
                    const IconComponent = getCategoryIcon(category.name);
                    return (
                      <div
                        key={category._id}
                        onClick={() => handleCategoryClick(category._id, category.name)}
                        className="group cursor-pointer"
                      >
                        <div className={`relative h-40 rounded-xl overflow-hidden bg-gradient-to-br ${getCategoryGradient(index)} p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                          <div className="relative h-full flex flex-col justify-between text-white">
                            <div className="flex items-start justify-between">
                              <IconComponent size={32} className="opacity-90" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">
                                {category.name}
                              </h3>
                              <div className="flex items-center text-sm opacity-90">
                                <span>Xem công thức</span>
                                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {filteredCategories.length === 0 && (
                  <div className="text-center py-20">
                    <Clock className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600">Không tìm thấy danh mục nào</p>
                  </div>
                )}
              </div>
            )}

            {/* Tags Section */}
            {activeTab === 'tags' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredTags.map((tag, index) => {
                    const IconComponent = getTagIcon(tag.name);
                    return (
                      <div
                        key={tag._id}
                        onClick={() => handleTagClick(tag._id, tag.name)}
                        className="group cursor-pointer"
                      >
                        <div className={`relative h-40 rounded-xl overflow-hidden bg-gradient-to-br ${getCategoryGradient(index)} p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                          <div className="relative h-full flex flex-col justify-between text-white">
                            <div className="flex items-start justify-between">
                              <IconComponent size={32} className="opacity-90" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">
                                {tag.name}
                              </h3>
                              <div className="flex items-center text-sm opacity-90">
                                <span>Xem công thức</span>
                                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {filteredTags.length === 0 && (
                  <div className="text-center py-20">
                    <TagIcon className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600">Không tìm thấy tag nào</p>
                  </div>
                )}
              </div>
            )}

            {/* Cuisines Section */}
            {activeTab === 'cuisines' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredCuisines.map((cuisine, index) => {
                    const IconComponent = getCuisineIcon();
                    return (
                      <div
                        key={cuisine._id}
                        onClick={() => handleCuisineClick(cuisine._id, cuisine.name)}
                        className="group cursor-pointer"
                      >
                        <div className={`relative h-40 rounded-xl overflow-hidden bg-gradient-to-br ${getCategoryGradient(index)} p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                          <div className="relative h-full flex flex-col justify-between text-white">
                            <div className="flex items-start justify-between">
                              <IconComponent size={32} className="opacity-90" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">
                                {cuisine.name}
                              </h3>
                              <div className="flex items-center text-sm opacity-90">
                                <span>Xem công thức</span>
                                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {filteredCuisines.length === 0 && (
                  <div className="text-center py-20">
                    <Globe className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600">Không tìm thấy quốc gia nào</p>
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
