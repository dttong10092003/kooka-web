import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { fetchRecipes } from '../redux/slices/recipeSlice';
import { Calendar, Plus, ChefHat, Clock, Users, Star, Edit, Trash2, ShoppingCart, Download, RefreshCw, Coffee, Sun, Moon, Heart, CheckCircle, Search } from 'lucide-react';
import type { Recipe } from '../redux/slices/recipeSlice';
import { useLanguage } from '../contexts/LanguageContext';

interface MealPlan {
  id: string;
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  snack?: Recipe;
}

const MealPlannerPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { recipes, loading } = useSelector((state: RootState) => state.recipes);
  
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{date: string, mealType: string} | null>(null);
  const [activeTab, setActiveTab] = useState('planner');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  // Load recipes on mount
  useEffect(() => {
    if (recipes.length === 0) {
      dispatch(fetchRecipes());
    }
  }, [dispatch, recipes.length]);

  // Load meal plans from localStorage
  useEffect(() => {
    const savedPlans = localStorage.getItem('mealPlans');
    if (savedPlans) {
      try {
        setMealPlans(JSON.parse(savedPlans));
      } catch (error) {
        console.error('Error loading meal plans:', error);
      }
    }
  }, []);

  // Save meal plans to localStorage whenever they change
  useEffect(() => {
    if (mealPlans.length > 0) {
      localStorage.setItem('mealPlans', JSON.stringify(mealPlans));
    }
  }, [mealPlans]);

  // Generate week dates
  const getWeekDates = (weekOffset: number = 0) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(selectedWeek);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDaysVi = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const mealTypes = [
    { id: 'breakfast', name: language === 'vi' ? 'Sáng' : 'Breakfast', icon: Coffee, color: 'from-yellow-400 to-orange-400' },
    { id: 'lunch', name: language === 'vi' ? 'Trưa' : 'Lunch', icon: Sun, color: 'from-orange-400 to-red-400' },
    { id: 'dinner', name: language === 'vi' ? 'Tối' : 'Dinner', icon: Moon, color: 'from-purple-400 to-indigo-400' },
    { id: 'snack', name: language === 'vi' ? 'Phụ' : 'Snack', icon: Heart, color: 'from-pink-400 to-rose-400' }
  ];

  const getMealPlan = (date: string): MealPlan => {
    const existing = mealPlans.find(plan => plan.date === date);
    if (existing) return existing;
    
    return {
      id: `plan-${date}`,
      date,
      breakfast: undefined,
      lunch: undefined,
      dinner: undefined,
      snack: undefined
    };
  };

  const addRecipeToMeal = (date: string, mealType: string, recipe: Recipe) => {
    setMealPlans(prev => {
      const existing = prev.find(plan => plan.date === date);
      if (existing) {
        return prev.map(plan => 
          plan.date === date 
            ? { ...plan, [mealType]: recipe }
            : plan
        );
      } else {
        return [...prev, {
          id: `plan-${date}`,
          date,
          [mealType]: recipe
        } as MealPlan];
      }
    });
    setShowRecipeSelector(false);
    setSelectedSlot(null);
  };

  const removeRecipeFromMeal = (date: string, mealType: string) => {
    setMealPlans(prev => 
      prev.map(plan => 
        plan.date === date 
          ? { ...plan, [mealType]: undefined }
          : plan
      )
    );
  };

  const generateShoppingList = () => {
    const ingredientMap = new Map<string, { name: string, count: number }>();
    
    mealPlans.forEach(plan => {
      [plan.breakfast, plan.lunch, plan.dinner, plan.snack].forEach(recipe => {
        if (recipe && recipe.ingredients) {
          recipe.ingredients.forEach(ingredient => {
            const name = ingredient.name;
            if (ingredientMap.has(name)) {
              const existing = ingredientMap.get(name)!;
              ingredientMap.set(name, { name, count: existing.count + 1 });
            } else {
              ingredientMap.set(name, { name, count: 1 });
            }
          });
        }
      });
    });
    
    return Array.from(ingredientMap.values());
  };

  const getWeekStats = () => {
    let totalRecipes = 0;
    let totalCookTime = 0;
    let avgRating = 0;
    let ratingCount = 0;

    mealPlans.forEach(plan => {
      [plan.breakfast, plan.lunch, plan.dinner, plan.snack].forEach(recipe => {
        if (recipe) {
          totalRecipes++;
          totalCookTime += recipe.time || 0;
          avgRating += recipe.rate || 0;
          ratingCount++;
        }
      });
    });

    return {
      totalRecipes,
      totalCookTime,
      avgRating: ratingCount > 0 ? (avgRating / ratingCount).toFixed(1) : '0',
      plannedDays: new Set(mealPlans.filter(plan => 
        plan.breakfast || plan.lunch || plan.dinner || plan.snack
      ).map(plan => plan.date)).size
    };
  };

  const stats = getWeekStats();

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  const toggleIngredientCheck = (ingredientName: string) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientName)) {
        newSet.delete(ingredientName);
      } else {
        newSet.add(ingredientName);
      }
      return newSet;
    });
  };

  const downloadShoppingList = () => {
    const shoppingList = generateShoppingList();
    const text = shoppingList.map(item => `☐ ${item.name} (${item.count}x)`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-2xl">
                <Calendar className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              {language === 'vi' ? 'Lập Kế Hoạch' : 'Meal'}
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent block">
                {language === 'vi' ? 'Bữa Ăn' : 'Planner'}
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              {language === 'vi' 
                ? 'Lập kế hoạch bữa ăn thông minh, tiết kiệm thời gian và tạo danh sách mua sắm tự động'
                : 'Plan your meals smartly, save time, and generate automatic shopping lists'
              }
            </p>
          </div>

          {/* Week Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-xl inline-block mb-4">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalRecipes}</div>
              <div className="text-sm text-gray-600">{language === 'vi' ? 'Công Thức' : 'Recipes'}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl inline-block mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalCookTime}m</div>
              <div className="text-sm text-gray-600">{language === 'vi' ? 'Thời Gian' : 'Cook Time'}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl inline-block mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.avgRating}</div>
              <div className="text-sm text-gray-600">{language === 'vi' ? 'Đánh Giá TB' : 'Avg Rating'}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-xl inline-block mb-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.plannedDays}</div>
              <div className="text-sm text-gray-600">{language === 'vi' ? 'Ngày Đã Lập' : 'Planned Days'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('planner')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200 ${
                  activeTab === 'planner'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>{language === 'vi' ? 'Lập Kế Hoạch' : 'Meal Planner'}</span>
              </button>
              <button
                onClick={() => setActiveTab('shopping')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200 ${
                  activeTab === 'shopping'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{language === 'vi' ? 'Danh Sách Mua Sắm' : 'Shopping List'}</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Planner Tab */}
        {activeTab === 'planner' && (
          <div className="space-y-8">
            {/* Week Navigation */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedWeek(selectedWeek - 1)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <RefreshCw className="h-5 w-5 transform rotate-180" />
                </button>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {weekDates[0].toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { 
                      month: 'long', 
                      day: 'numeric' 
                    })} - {weekDates[6].toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {selectedWeek === 0 
                      ? (language === 'vi' ? 'Tuần này' : 'This week')
                      : selectedWeek > 0 
                        ? (language === 'vi' ? `${selectedWeek} tuần tới` : `${selectedWeek} weeks ahead`)
                        : (language === 'vi' ? `${Math.abs(selectedWeek)} tuần trước` : `${Math.abs(selectedWeek)} weeks ago`)
                    }
                  </p>
                </div>
                <button
                  onClick={() => setSelectedWeek(selectedWeek + 1)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Meal Planning Grid */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-32">
                        {language === 'vi' ? 'Bữa Ăn' : 'Meal'}
                      </th>
                      {weekDates.map((date, index) => (
                        <th key={date.toISOString()} className="px-4 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider min-w-48">
                          <div>
                            <div className="font-bold text-gray-900">
                              {language === 'vi' ? weekDaysVi[index] : weekDays[index]}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {date.getDate()}/{date.getMonth() + 1}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mealTypes.map((mealType) => {
                      const IconComponent = mealType.icon;
                      return (
                        <tr key={mealType.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className={`bg-gradient-to-r ${mealType.color} p-2 rounded-lg`}>
                                <IconComponent className="h-5 w-5 text-white" />
                              </div>
                              <span className="font-medium text-gray-900">{mealType.name}</span>
                            </div>
                          </td>
                          {weekDates.map((date) => {
                            const dateStr = date.toISOString().split('T')[0];
                            const mealPlan = getMealPlan(dateStr);
                            const recipe = mealPlan[mealType.id as keyof MealPlan] as Recipe | undefined;
                            
                            return (
                              <td key={dateStr} className="px-4 py-4">
                                {recipe ? (
                                  <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200 group">
                                    <div className="flex items-start justify-between mb-2">
                                      <h4 
                                        className="font-medium text-gray-900 text-sm line-clamp-2 flex-1 cursor-pointer hover:text-green-600"
                                        onClick={() => handleRecipeClick(recipe._id)}
                                      >
                                        {recipe.name}
                                      </h4>
                                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                          onClick={() => handleRecipeClick(recipe._id)}
                                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </button>
                                        <button
                                          onClick={() => removeRecipeFromMeal(dateStr, mealType.id)}
                                          className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                      <div className="flex items-center space-x-2">
                                        <div className="flex items-center space-x-1">
                                          <Clock className="h-3 w-3" />
                                          <span>{recipe.time}m</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Star className="h-3 w-3 text-yellow-400" />
                                          <span>{recipe.rate.toFixed(1)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setSelectedSlot({ date: dateStr, mealType: mealType.id });
                                      setShowRecipeSelector(true);
                                    }}
                                    className="w-full h-20 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 flex items-center justify-center group"
                                  >
                                    <div className="text-center">
                                      <Plus className="h-6 w-6 text-gray-400 group-hover:text-green-500 mx-auto mb-1 transition-colors duration-200" />
                                      <span className="text-xs text-gray-500 group-hover:text-green-600 transition-colors duration-200">
                                        {language === 'vi' ? 'Thêm món' : 'Add meal'}
                                      </span>
                                    </div>
                                  </button>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Shopping List Tab */}
        {activeTab === 'shopping' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'vi' ? 'Danh Sách Mua Sắm' : 'Shopping List'}
                </h2>
                {generateShoppingList().length > 0 && (
                  <button 
                    onClick={downloadShoppingList}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>{language === 'vi' ? 'Tải Xuống' : 'Download'}</span>
                  </button>
                )}
              </div>

              {generateShoppingList().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generateShoppingList().map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                        checkedIngredients.has(item.name)
                          ? 'bg-green-50 hover:bg-green-100'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleIngredientCheck(item.name)}
                    >
                      <input
                        type="checkbox"
                        checked={checkedIngredients.has(item.name)}
                        onChange={() => toggleIngredientCheck(item.name)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className={`flex-1 capitalize ${
                        checkedIngredients.has(item.name) 
                          ? 'text-gray-400 line-through' 
                          : 'text-gray-700'
                      }`}>
                        {item.name} <span className="text-gray-500">({item.count}x)</span>
                      </span>
                      {checkedIngredients.has(item.name) && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    {language === 'vi' ? 'Chưa có nguyên liệu nào' : 'No ingredients yet'}
                  </p>
                  <p className="text-gray-400">
                    {language === 'vi' ? 'Thêm công thức vào kế hoạch để tạo danh sách mua sắm' : 'Add recipes to your meal plan to generate shopping list'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recipe Selector Modal */}
      {showRecipeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {language === 'vi' ? 'Chọn Công Thức' : 'Select Recipe'}
                </h3>
                <button
                  onClick={() => {
                    setShowRecipeSelector(false);
                    setSelectedSlot(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <Plus className="h-6 w-6 transform rotate-45" />
                </button>
              </div>
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'vi' ? 'Tìm kiếm công thức...' : 'Search recipes...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                  <p className="text-gray-500 mt-4">
                    {language === 'vi' ? 'Đang tải...' : 'Loading...'}
                  </p>
                </div>
              ) : filteredRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {language === 'vi' ? 'Không tìm thấy công thức nào' : 'No recipes found'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <div
                      key={recipe._id}
                      onClick={() => selectedSlot && addRecipeToMeal(selectedSlot.date, selectedSlot.mealType, recipe)}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={recipe.image || 'https://via.placeholder.com/150'}
                          alt={recipe.name}
                          className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{recipe.name}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{recipe.short}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{recipe.time}m</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{recipe.size}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400" />
                              <span>{recipe.rate.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlannerPage;
