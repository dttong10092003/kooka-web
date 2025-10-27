import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { fetchRecipes } from '../redux/slices/recipeSlice';
import { 
  fetchMealPlansByUser, 
  createMealPlan, 
  updateMealPlan, 
  deleteMealPlan
} from '../redux/slices/mealPlanSlice';
import type { DayPlan, Meal } from '../redux/slices/mealPlanSlice';
import { Calendar, Plus, ChefHat, Clock, Users, Star, Edit, Trash2, ShoppingCart, Download, ChevronLeft, ChevronRight, Coffee, Sun, Moon, CheckCircle, Search } from 'lucide-react';
import type { Recipe } from '../redux/slices/recipeSlice';
import { useLanguage } from '../contexts/LanguageContext';


const MealPlannerPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { recipes, loading: recipesLoading } = useSelector((state: RootState) => state.recipes);
  const { mealPlans } = useSelector((state: RootState) => state.mealPlans);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [currentMealPlanId, setCurrentMealPlanId] = useState<string | null>(null);
  const [currentMealPlanIndex, setCurrentMealPlanIndex] = useState<number>(0);
  const [editingPlans, setEditingPlans] = useState<DayPlan[]>([]);
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{date: string, mealType: 'morning' | 'noon' | 'evening'} | null>(null);
  const [activeTab, setActiveTab] = useState('planner');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [startDateError, setStartDateError] = useState<string>('');
  const [viewMode, setViewMode] = useState<'browse' | 'viewing' | 'creating'>('browse');
  const [justCreatedPlanId, setJustCreatedPlanId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Load recipes and meal plans on mount
  useEffect(() => {
    if (recipes.length === 0) {
      dispatch(fetchRecipes());
    }
    if (user?._id) {
      dispatch(fetchMealPlansByUser(user._id));
    }
  }, [dispatch, recipes.length, user]);

  // Sort meal plans by startDate (pending first, then by date)
  const sortedMealPlans = [...mealPlans].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  // Determine view mode and current plan
  useEffect(() => {
    if (sortedMealPlans.length === 0) {
      setViewMode('browse');
      setCurrentMealPlanId(null);
      setCurrentMealPlanIndex(0);
      setEditingPlans([]);
      setHasUnsavedChanges(false);
    } else {
      if (viewMode === 'creating') return;
      
      if (viewMode === 'viewing' && currentMealPlanId) {
        const currentIndex = sortedMealPlans.findIndex(p => p._id === currentMealPlanId);
        
        if (currentIndex !== -1) {
          setCurrentMealPlanIndex(currentIndex);
          // Chỉ update editingPlans nếu KHÔNG phải vừa mới tạo plan
          // Khi justCreatedPlanId được clear (null), điều kiện này sẽ true và update index
          if (justCreatedPlanId !== currentMealPlanId) {
            setEditingPlans(sortedMealPlans[currentIndex].plans);
          }
        } else {
          // Plan không tìm thấy, chuyển về plan đầu tiên
          setCurrentMealPlanIndex(0);
          const firstPlan = sortedMealPlans[0];
          setCurrentMealPlanId(firstPlan._id);
          setEditingPlans(firstPlan.plans);
        }
      } else {
        // Không có plan nào đang xem, hiển thị plan đầu tiên
        setViewMode('viewing');
        setCurrentMealPlanIndex(0);
        const firstPlan = sortedMealPlans[0];
        setCurrentMealPlanId(firstPlan._id);
        setEditingPlans(firstPlan.plans);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealPlans, justCreatedPlanId]); // Thêm justCreatedPlanId vào dependencies

  // Kiểm tra ngày bắt đầu có nằm trong vùng cấm không (±6 ngày của plan hiện có)
  const isStartDateConflict = (newStartDate: Date): { hasConflict: boolean; conflictMessage?: string } => {
    // Normalize the input date
    const normalizedNewDate = new Date(newStartDate);
    normalizedNewDate.setHours(0, 0, 0, 0);
    
    for (const existingPlan of sortedMealPlans) {
      const existingStart = new Date(existingPlan.startDate);
      existingStart.setHours(0, 0, 0, 0);
      
      // Tính vùng cấm: từ (existingStart - 6 ngày) đến (existingStart + 6 ngày)
      const forbiddenStart = new Date(existingStart);
      forbiddenStart.setDate(existingStart.getDate() - 6);
      forbiddenStart.setHours(0, 0, 0, 0);
      
      const forbiddenEnd = new Date(existingStart);
      forbiddenEnd.setDate(existingStart.getDate() + 6);
      forbiddenEnd.setHours(0, 0, 0, 0);
      
      // Kiểm tra xem newStartDate có nằm trong vùng cấm không
      if (normalizedNewDate >= forbiddenStart && normalizedNewDate <= forbiddenEnd) {
        const formatDate = (date: Date) => {
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };
        
        const message = language === 'vi' 
          ? `Ngày bắt đầu (${formatDate(normalizedNewDate)}) nằm trong vùng cấm (từ ${formatDate(forbiddenStart)} đến ${formatDate(forbiddenEnd)}) của kế hoạch bắt đầu ${formatDate(existingStart)}.`
          : `Start date (${formatDate(normalizedNewDate)}) is in the forbidden zone (from ${formatDate(forbiddenStart)} to ${formatDate(forbiddenEnd)}) of the plan starting ${formatDate(existingStart)}.`;
        
        return { hasConflict: true, conflictMessage: message };
      }
    }
    
    return { hasConflict: false };
  };

  // Generate week dates based on mode
  const getWeekDates = (): Date[] => {
    if (viewMode === 'browse') {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + (selectedWeek * 7));
      
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
      }
      return dates;
    } else if (viewMode === 'creating' && selectedStartDate) {
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(selectedStartDate);
        date.setDate(selectedStartDate.getDate() + i);
        dates.push(date);
      }
      return dates;
    } else if (viewMode === 'viewing' && currentMealPlanId) {
      const currentPlan = sortedMealPlans[currentMealPlanIndex];
      if (currentPlan) {
        const startDate = new Date(currentPlan.startDate);
        const dates = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          dates.push(date);
        }
        return dates;
      }
    }
    
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDaysVi = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const mealTypes: Array<{
    id: 'morning' | 'noon' | 'evening';
    name: string;
    icon: typeof Coffee;
    color: string;
  }> = [
    { id: 'morning', name: language === 'vi' ? 'Sáng' : 'Morning', icon: Coffee, color: 'from-yellow-400 to-orange-400' },
    { id: 'noon', name: language === 'vi' ? 'Trưa' : 'Noon', icon: Sun, color: 'from-orange-400 to-red-400' },
    { id: 'evening', name: language === 'vi' ? 'Tối' : 'Evening', icon: Moon, color: 'from-purple-400 to-indigo-400' }
  ];

  const goToPreviousPlan = () => {
    if (viewMode === 'viewing' && currentMealPlanIndex > 0) {
      const newIndex = currentMealPlanIndex - 1;
      setCurrentMealPlanIndex(newIndex);
      const plan = sortedMealPlans[newIndex];
      setCurrentMealPlanId(plan._id);
      setEditingPlans(plan.plans);
      setHasUnsavedChanges(false);
    }
  };

  const goToNextPlan = () => {
    if (viewMode === 'viewing' && currentMealPlanIndex < sortedMealPlans.length - 1) {
      const newIndex = currentMealPlanIndex + 1;
      setCurrentMealPlanIndex(newIndex);
      const plan = sortedMealPlans[newIndex];
      setCurrentMealPlanId(plan._id);
      setEditingPlans(plan.plans);
      setHasUnsavedChanges(false);
    }
  };

  const goToPreviousWeek = () => {
    if (viewMode === 'browse' && selectedWeek > -2) {
      setSelectedWeek(selectedWeek - 1);
    }
  };

  const goToNextWeek = () => {
    if (viewMode === 'browse' && selectedWeek < 2) {
      setSelectedWeek(selectedWeek + 1);
    }
  };

  const startCreatingNewPlan = () => {
    setShowStartDateModal(true);
    setStartDateError(''); // Reset error khi mở modal
  };

  // Handler để validate ngày khi người dùng chọn
  const handleStartDateChange = (date: Date) => {
    // Normalize date to remove time component
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    
    setSelectedStartDate(normalizedDate);
    
    // Kiểm tra conflict ngay khi chọn ngày
    const conflictCheck = isStartDateConflict(normalizedDate);
    if (conflictCheck.hasConflict) {
      setStartDateError(conflictCheck.conflictMessage || '');
    } else {
      setStartDateError('');
    }
  };

  const confirmStartDate = () => {
    if (!selectedStartDate) return;
    
    // Kiểm tra conflict lần cuối trước khi confirm
    const conflictCheck = isStartDateConflict(selectedStartDate);
    if (conflictCheck.hasConflict) {
      setStartDateError(conflictCheck.conflictMessage || '');
      return;
    }
    
    const pendingPlans = sortedMealPlans.filter(p => p.status === 'pending');
    if (pendingPlans.length >= 3) {
      alert(language === 'vi' 
        ? 'Bạn đã có 3 kế hoạch chưa hoàn thành. Vui lòng hoàn thành hoặc xóa bớt trước khi tạo mới.' 
        : 'You already have 3 pending plans. Please complete or delete some before creating a new one.');
      setShowStartDateModal(false);
      setSelectedStartDate(null);
      setStartDateError('');
      return;
    }
    
    setViewMode('creating');
    setCurrentMealPlanId(null);
    setEditingPlans([]);
    setHasUnsavedChanges(false);
    setShowStartDateModal(false);
    setStartDateError('');
  };

  const cancelCreatingPlan = () => {
    setViewMode(sortedMealPlans.length > 0 ? 'viewing' : 'browse');
    setSelectedStartDate(null);
    setStartDateError('');
    setEditingPlans([]);
    setHasUnsavedChanges(false);
    
    if (sortedMealPlans.length > 0) {
      setCurrentMealPlanIndex(0);
      const firstPlan = sortedMealPlans[0];
      setCurrentMealPlanId(firstPlan._id);
      setEditingPlans(firstPlan.plans);
    } else {
      setCurrentMealPlanId(null);
      setSelectedWeek(0);
    }
  };

  const getDayPlan = (date: string): DayPlan => {
    const existing = editingPlans.find(plan => 
      new Date(plan.date).toISOString().split('T')[0] === date
    );
    if (existing) return existing;
    
    return {
      date,
      morning: {},
      noon: {},
      evening: {}
    };
  };

  const getRecipeFromMeal = (meal?: Meal): Recipe | null => {
    if (!meal || !meal.recipeId) return null;
    return recipes.find(r => r._id === meal.recipeId) || null;
  };

  const addRecipeToMeal = (date: string, mealType: 'morning' | 'noon' | 'evening', recipe: Recipe) => {
    if (currentMealPlanId && currentPlan?.status === 'completed') {
      alert(language === 'vi' 
        ? 'Không thể chỉnh sửa kế hoạch đã hoàn thành' 
        : 'Cannot edit completed plan');
      return;
    }
    
    setEditingPlans(prev => {
      const existing = prev.find(plan => 
        new Date(plan.date).toISOString().split('T')[0] === date
      );
      
      const meal: Meal = {
        recipeId: recipe._id,
        recipeName: recipe.name,
        recipeImage: recipe.image
      };

      if (existing) {
        return prev.map(plan => 
          new Date(plan.date).toISOString().split('T')[0] === date
            ? { ...plan, [mealType]: meal }
            : plan
        );
      } else {
        return [...prev, {
          date,
          [mealType]: meal
        } as DayPlan];
      }
    });
    setHasUnsavedChanges(true);
    setShowRecipeSelector(false);
    setSelectedSlot(null);
  };

  const removeRecipeFromMeal = (date: string, mealType: 'morning' | 'noon' | 'evening') => {
    if (currentMealPlanId && currentPlan?.status === 'completed') {
      alert(language === 'vi' 
        ? 'Không thể chỉnh sửa kế hoạch đã hoàn thành' 
        : 'Cannot edit completed plan');
      return;
    }
    
    setEditingPlans(prev => 
      prev.map(plan => 
        new Date(plan.date).toISOString().split('T')[0] === date
          ? { ...plan, [mealType]: {} }
          : plan
      ).filter(plan => plan.morning?.recipeId || plan.noon?.recipeId || plan.evening?.recipeId)
    );
    setHasUnsavedChanges(true);
  };

  const saveMealPlan = async () => {
    if (!user?._id) {
      alert(language === 'vi' ? 'Vui lòng đăng nhập' : 'Please login');
      return;
    }

    const validPlans = editingPlans.filter(plan => 
      plan.morning?.recipeId || plan.noon?.recipeId || plan.evening?.recipeId
    );

    if (validPlans.length === 0) {
      alert(language === 'vi' ? 'Vui lòng thêm ít nhất một món ăn' : 'Please add at least one meal');
      return;
    }

    try {
      if (currentMealPlanId) {
        await dispatch(updateMealPlan({
          id: currentMealPlanId,
          mealPlan: {
            userId: user._id,
            plans: validPlans
          }
        })).unwrap();
        setHasUnsavedChanges(false);
        alert(language === 'vi' ? 'Cập nhật thành công!' : 'Updated successfully!');
      } else {
        // Khi tạo mới, phải gửi cả startDate lên backend
        if (!selectedStartDate) {
          alert(language === 'vi' ? 'Vui lòng chọn ngày bắt đầu' : 'Please select a start date');
          return;
        }
        
        // Format startDate - use ISO string split at 'T' to get just the date part
        const formattedStartDate = selectedStartDate.toISOString().split('T')[0];
        
        const newPlan = await dispatch(createMealPlan({
          userId: user._id,
          plans: validPlans,
          startDate: formattedStartDate
        })).unwrap();
        
        // Sau khi tạo thành công, LUÔN hiển thị plan vừa tạo
        setJustCreatedPlanId(newPlan._id); // Set flag để useEffect không ghi đè
        setHasUnsavedChanges(false);
        setSelectedStartDate(null);
        setViewMode('viewing');
        setCurrentMealPlanId(newPlan._id);
        setEditingPlans(newPlan.plans); // Set từ response API
        
        // Đợi Redux update xong rồi mới tìm index chính xác
        setTimeout(() => {
          setJustCreatedPlanId(null);
        }, 100);
        
        alert(language === 'vi' ? 'Tạo kế hoạch thành công!' : 'Plan created successfully!');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      alert(errorMessage || (language === 'vi' ? 'Có lỗi xảy ra' : 'An error occurred'));
    }
  };

  const deletePlan = async () => {
    if (!currentMealPlanId) return;
    
    if (!confirm(language === 'vi' ? 'Bạn có chắc muốn xóa kế hoạch này?' : 'Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      await dispatch(deleteMealPlan(currentMealPlanId)).unwrap();
      
      const remainingPlans = sortedMealPlans.filter(p => p._id !== currentMealPlanId);
      
      if (remainingPlans.length > 0) {
        setViewMode('viewing');
        setCurrentMealPlanIndex(0);
        const nextPlan = remainingPlans[0];
        setCurrentMealPlanId(nextPlan._id);
        setEditingPlans(nextPlan.plans);
      } else {
        setViewMode('browse');
        setCurrentMealPlanId(null);
        setCurrentMealPlanIndex(0);
        setEditingPlans([]);
        setSelectedWeek(0);
      }
      
      setHasUnsavedChanges(false);
      alert(language === 'vi' ? 'Đã xóa kế hoạch!' : 'Plan deleted!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      alert(errorMessage || (language === 'vi' ? 'Có lỗi xảy ra' : 'An error occurred'));
    }
  };

  const generateShoppingList = () => {
    const ingredientMap = new Map<string, { name: string, count: number }>();
    
    editingPlans.forEach(plan => {
      [plan.morning, plan.noon, plan.evening].forEach(meal => {
        if (meal?.recipeId) {
          const recipe = recipes.find(r => r._id === meal.recipeId);
          if (recipe && recipe.ingredients) {
            recipe.ingredients.forEach((ingredient) => {
              const name = ingredient.name;
              if (ingredientMap.has(name)) {
                const existing = ingredientMap.get(name)!;
                ingredientMap.set(name, { name, count: existing.count + 1 });
              } else {
                ingredientMap.set(name, { name, count: 1 });
              }
            });
          }
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

    editingPlans.forEach(plan => {
      [plan.morning, plan.noon, plan.evening].forEach(meal => {
        if (meal?.recipeId) {
          const recipe = recipes.find(r => r._id === meal.recipeId);
          if (recipe) {
            totalRecipes++;
            totalCookTime += recipe.time || 0;
            avgRating += recipe.rate || 0;
            ratingCount++;
          }
        }
      });
    });

    return {
      totalRecipes,
      totalCookTime,
      avgRating: ratingCount > 0 ? (avgRating / ratingCount).toFixed(1) : '0',
      plannedDays: editingPlans.filter(plan => 
        plan.morning?.recipeId || plan.noon?.recipeId || plan.evening?.recipeId
      ).length
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

  const currentPlan = currentMealPlanId ? mealPlans.find(p => p._id === currentMealPlanId) : null;

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month - normalized to midnight
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      dayDate.setHours(0, 0, 0, 0);
      days.push(dayDate);
    }
    
    return days;
  };

  const isDateDisabled = (date: Date | null): boolean => {
    if (!date) return true;
    
    // Normalize dates to remove time component
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Disable dates before tomorrow
    if (normalizedDate < tomorrow) return true;
    
    // Check conflict with existing plans
    const conflictCheck = isStartDateConflict(normalizedDate);
    return conflictCheck.hasConflict;
  };

  const isDateInConflictZone = (date: Date | null): boolean => {
    if (!date) return false;
    const conflictCheck = isStartDateConflict(date);
    return conflictCheck.hasConflict;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
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
              <div className="flex items-center justify-between mb-4">
                {viewMode === 'browse' ? (
                  <button
                    onClick={goToPreviousWeek}
                    disabled={selectedWeek <= -2}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      selectedWeek <= -2 
                        ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                ) : viewMode === 'viewing' ? (
                  <button
                    onClick={goToPreviousPlan}
                    disabled={currentMealPlanIndex <= 0}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      currentMealPlanIndex <= 0
                        ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                ) : (
                  <div className="w-10"></div>
                )}

                <div className="text-center flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {viewMode === 'viewing' && currentPlan ? (
                      <>
                        {new Date(currentPlan.startDate).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { 
                          month: 'long', 
                          day: 'numeric' 
                        })} - {new Date(currentPlan.endDate).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </>
                    ) : (
                      <>
                        {weekDates[0].toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { 
                          month: 'long', 
                          day: 'numeric' 
                        })} - {weekDates[6].toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </>
                    )}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {viewMode === 'browse' && (
                      selectedWeek === 0 
                        ? (language === 'vi' ? 'Tuần này' : 'This week')
                        : selectedWeek > 0 
                          ? (language === 'vi' ? `${selectedWeek} tuần tới` : `${selectedWeek} weeks ahead`)
                          : (language === 'vi' ? `${Math.abs(selectedWeek)} tuần trước` : `${Math.abs(selectedWeek)} weeks ago`)
                    )}
                    {viewMode === 'viewing' && currentPlan && (
                      <>
                        {language === 'vi' ? 'Kế hoạch' : 'Plan'} {currentMealPlanIndex + 1}/{sortedMealPlans.length}
                        <span className="mx-2">•</span>
                        <span className={currentPlan.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                          {currentPlan.status === 'completed'
                            ? (language === 'vi' ? 'Đã hoàn thành' : 'Completed')
                            : (language === 'vi' ? 'Đang thực hiện' : 'Pending')
                          }
                        </span>
                      </>
                    )}
                    {viewMode === 'creating' && (
                      language === 'vi' ? 'Đang tạo kế hoạch mới' : 'Creating new plan'
                    )}
                  </p>
                </div>

                {viewMode === 'browse' ? (
                  <button
                    onClick={goToNextWeek}
                    disabled={selectedWeek >= 2}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      selectedWeek >= 2
                        ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                ) : viewMode === 'viewing' ? (
                  <button
                    onClick={goToNextPlan}
                    disabled={currentMealPlanIndex >= sortedMealPlans.length - 1}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      currentMealPlanIndex >= sortedMealPlans.length - 1
                        ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                ) : (
                  <div className="w-10"></div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  {viewMode === 'browse' && (
                    <button
                      onClick={startCreatingNewPlan}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{language === 'vi' ? 'Tạo Kế Hoạch Mới' : 'Create New Plan'}</span>
                    </button>
                  )}
                  {viewMode === 'viewing' && (
                    <button
                      onClick={startCreatingNewPlan}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{language === 'vi' ? 'Tạo Kế Hoạch Mới' : 'Create New Plan'}</span>
                    </button>
                  )}
                  {viewMode === 'creating' && (
                    <button
                      onClick={cancelCreatingPlan}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center space-x-2"
                    >
                      <span>{language === 'vi' ? 'Hủy' : 'Cancel'}</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {hasUnsavedChanges && (
                    <span className="text-sm text-orange-600 mr-2">
                      {language === 'vi' ? 'Có thay đổi chưa lưu' : 'Unsaved changes'}
                    </span>
                  )}
                  {viewMode !== 'browse' && (
                    <>
                      {currentMealPlanId && currentPlan?.status === 'pending' && (
                        <button
                          onClick={deletePlan}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center space-x-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>{language === 'vi' ? 'Xóa' : 'Delete'}</span>
                        </button>
                      )}
                      {(viewMode === 'creating' || (currentMealPlanId && currentPlan?.status === 'pending')) && (
                        <button
                          onClick={saveMealPlan}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>
                            {viewMode === 'creating' 
                              ? (language === 'vi' ? 'Lưu Kế Hoạch' : 'Save Plan')
                              : (language === 'vi' ? 'Cập Nhật Kế Hoạch' : 'Update Plan')
                            }
                          </span>
                        </button>
                      )}
                      {currentMealPlanId && currentPlan?.status === 'completed' && (
                        <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>{language === 'vi' ? 'Kế hoạch đã hoàn thành (chỉ xem)' : 'Completed plan (view only)'}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Empty State cho Browse Mode */}
            {viewMode === 'browse' && mealPlans.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12">
                <div className="text-center max-w-md mx-auto">
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {language === 'vi' ? 'Chưa Có Kế Hoạch Bữa Ăn' : 'No Meal Plans Yet'}
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {language === 'vi' 
                      ? 'Bắt đầu tạo kế hoạch bữa ăn của bạn ngay hôm nay! Chọn các công thức yêu thích và lên kế hoạch cho cả tuần.' 
                      : 'Start creating your meal plans today! Choose your favorite recipes and plan for the whole week.'}
                  </p>
                  <button
                    onClick={startCreatingNewPlan}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-semibold">
                      {language === 'vi' ? 'Tạo Kế Hoạch Đầu Tiên' : 'Create Your First Plan'}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              /* Meal Planning Grid */
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <div className="min-w-[1000px]">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28 sticky left-0 bg-gray-50 z-10">
                            {language === 'vi' ? 'Bữa' : 'Meal'}
                          </th>
                          {weekDates.map((date) => {
                            const dayOfWeek = date.getDay();
                            const isToday = new Date().toDateString() === date.toDateString();
                            return (
                              <th key={date.toISOString()} className="px-2 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <div className={`${isToday ? 'text-green-600' : ''}`}>
                                  <div className="font-bold text-sm">
                                    {language === 'vi' ? weekDaysVi[dayOfWeek] : weekDays[dayOfWeek]}
                                  </div>
                                  <div className={`text-xs mt-1 ${isToday ? 'text-green-500 font-semibold' : 'text-gray-500'}`}>
                                    {date.getDate()}/{date.getMonth() + 1}
                                  </div>
                                </div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {mealTypes.map((mealType) => {
                          const IconComponent = mealType.icon;
                          return (
                            <tr key={mealType.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                              <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-100">
                                <div className="flex items-center space-x-2">
                                  <div className={`bg-gradient-to-r ${mealType.color} p-1.5 rounded-lg shadow-sm`}>
                                    <IconComponent className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="font-medium text-gray-800 text-sm">{mealType.name}</span>
                                </div>
                              </td>
                              {weekDates.map((date) => {
                                const dateStr = date.toISOString().split('T')[0];
                                const dayPlan = getDayPlan(dateStr);
                                const meal = dayPlan[mealType.id];
                                const recipe = getRecipeFromMeal(meal);
                                
                                return (
                                  <td key={dateStr} className="px-2 py-3">
                                    {recipe ? (
                                      <div 
                                        className="relative rounded-lg overflow-hidden h-24 group cursor-pointer hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                                        style={{
                                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${recipe.image})`,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center'
                                        }}
                                      >
                                        <div className="absolute inset-0 p-2 flex flex-col justify-between">
                                          <div className="flex items-start justify-between gap-1">
                                            <h4 
                                              className="font-semibold text-white text-xs line-clamp-2 flex-1 drop-shadow-lg leading-tight"
                                              onClick={() => handleRecipeClick(recipe._id)}
                                            >
                                              {recipe.name}
                                            </h4>
                                            {(viewMode === 'creating' || (currentPlan?.status === 'pending')) && (
                                              <div className="flex space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                  onClick={() => handleRecipeClick(recipe._id)}
                                                  className="p-1 bg-white/95 rounded hover:bg-white transition-colors duration-200 shadow-sm"
                                                  title={language === 'vi' ? 'Xem chi tiết' : 'View details'}
                                                >
                                                  <Edit className="h-3 w-3 text-blue-600" />
                                                </button>
                                                <button
                                                  onClick={() => removeRecipeFromMeal(dateStr, mealType.id)}
                                                  className="p-1 bg-white/95 rounded hover:bg-white transition-colors duration-200 shadow-sm"
                                                  title={language === 'vi' ? 'Xóa' : 'Remove'}
                                                >
                                                  <Trash2 className="h-3 w-3 text-red-600" />
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex items-center justify-between text-[10px] text-white drop-shadow">
                                            <div className="flex items-center space-x-1">
                                              <div className="flex items-center space-x-0.5 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                                <Clock className="h-2.5 w-2.5" />
                                                <span className="font-medium">{recipe.time}m</span>
                                              </div>
                                              <div className="flex items-center space-x-0.5 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                                <Star className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" />
                                                <span className="font-medium">{(recipe.rate || 0).toFixed(1)}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      (viewMode === 'creating' || (currentPlan?.status === 'pending')) ? (
                                        <button
                                          onClick={() => {
                                            setSelectedSlot({ date: dateStr, mealType: mealType.id });
                                            setShowRecipeSelector(true);
                                          }}
                                          className="w-full h-24 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50/50 transition-all duration-200 flex items-center justify-center group"
                                        >
                                          <div className="text-center">
                                            <Plus className="h-5 w-5 text-gray-300 group-hover:text-green-500 mx-auto mb-0.5 transition-colors duration-200" />
                                            <span className="text-[10px] text-gray-400 group-hover:text-green-600 transition-colors duration-200 font-medium">
                                              {language === 'vi' ? 'Thêm' : 'Add'}
                                            </span>
                                          </div>
                                        </button>
                                      ) : (
                                        <div className="w-full h-24 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/30 flex items-center justify-center">
                                          <span className="text-[10px] text-gray-300 font-medium">
                                            {language === 'vi' ? 'Trống' : 'Empty'}
                                          </span>
                                        </div>
                                      )
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
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        checkedIngredients.has(item.name)
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300'
                      }`}>
                        {checkedIngredients.has(item.name) && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className={`flex-1 ${
                        checkedIngredients.has(item.name) 
                          ? 'line-through text-gray-500' 
                          : 'text-gray-900'
                      }`}>
                        {item.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.count}x
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {language === 'vi' 
                      ? 'Chưa có nguyên liệu nào trong kế hoạch' 
                      : 'No ingredients in your meal plan yet'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Start Date Modal */}
      {showStartDateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold">
                  {language === 'vi' ? '📅 Chọn Ngày Bắt Đầu' : '📅 Select Start Date'}
                </h3>
                <button
                  onClick={() => {
                    setShowStartDateModal(false);
                    setSelectedStartDate(null);
                    setStartDateError('');
                    setCurrentMonth(new Date());
                  }}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <Plus className="h-6 w-6 transform rotate-45" />
                </button>
              </div>
              <p className="text-white/90 text-sm">
                {language === 'vi' 
                  ? 'Kế hoạch sẽ bắt đầu từ ngày này và kéo dài 7 ngày' 
                  : 'Your meal plan will start from this date and last for 7 days'}
              </p>
            </div>

            {/* Calendar */}
            <div className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h4 className="text-lg font-bold text-gray-900">
                  {currentMonth.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h4>
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {(language === 'vi' ? weekDaysVi : weekDays).map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth(currentMonth).map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const isDisabled = isDateDisabled(date);
                  const isSelected = selectedStartDate?.toDateString() === date.toDateString();
                  const isToday = new Date().toDateString() === date.toDateString();
                  const isInConflictZone = isDateInConflictZone(date);
                  const isHovered = hoveredDate?.toDateString() === date.toDateString();

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => {
                        if (!isDisabled) {
                          handleStartDateChange(date);
                        }
                      }}
                      onMouseEnter={() => !isDisabled && setHoveredDate(date)}
                      onMouseLeave={() => setHoveredDate(null)}
                      disabled={isDisabled}
                      className={`
                        aspect-square rounded-lg font-medium text-sm transition-all duration-200
                        ${isSelected 
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-110 z-10' 
                          : isDisabled && isInConflictZone
                            ? 'bg-red-50 text-red-300 cursor-not-allowed line-through'
                            : isDisabled
                              ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                              : isToday
                                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                : 'bg-gray-50 text-gray-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-blue-100 hover:text-gray-900'
                        }
                        ${isHovered && !isDisabled && !isSelected ? 'ring-2 ring-green-300' : ''}
                        ${isSelected ? 'ring-2 ring-green-400' : ''}
                      `}
                      title={
                        isDisabled && isInConflictZone 
                          ? (language === 'vi' ? 'Ngày này xung đột với kế hoạch hiện có' : 'This date conflicts with existing plans')
                          : isDisabled 
                            ? (language === 'vi' ? 'Không thể chọn ngày này' : 'Cannot select this date')
                            : ''
                      }
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* Selected Date Display */}
              {selectedStartDate && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        {language === 'vi' ? 'Ngày được chọn:' : 'Selected date:'}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedStartDate.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-500" />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {startDateError && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm text-red-700 leading-relaxed">{startDateError}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-2 flex space-x-3">
              <button
                onClick={() => {
                  setShowStartDateModal(false);
                  setSelectedStartDate(null);
                  setStartDateError('');
                  setCurrentMonth(new Date());
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                onClick={confirmStartDate}
                disabled={!selectedStartDate || !!startDateError}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>{language === 'vi' ? 'Xác Nhận' : 'Confirm'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Selector Modal */}
      {showRecipeSelector && (
        <div className="fixed inset-0 bg-gray-800/20 flex items-center justify-center p-4 z-50">
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
              {recipesLoading ? (
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
                              <span>{(recipe.rate || 0).toFixed(1)}</span>
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
