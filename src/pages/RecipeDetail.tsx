import { ArrowLeft, ChefHat, Clock, Star, Users, Heart, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { getRecipeById } from '../redux/slices/recipeSlice';
import { toggleFavorite, checkUserFavorited } from '../redux/slices/favoriteSlice';
import CommentSection from '../components/CommentSection';
import axiosInstance from '../utils/axiosInstance';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

export default function RecipeDetail() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [isFavorited, setIsFavorited] = useState(false);
    const [openSteps, setOpenSteps] = useState<number[]>([]);

    // Get currentRecipe from Redux store (recipe with full instructions)
    const currentRecipe = useSelector((state: RootState) => state.recipes.currentRecipe);
    const loading = useSelector((state: RootState) => state.recipes.loading);

    // Get user and favorite state
    const user = useSelector((state: RootState) => state.auth.user);
    const favoriteRecipeIds = useSelector((state: RootState) => state.favorites.favoriteRecipeIds);

    useEffect(() => {
        if (id) {
            dispatch(getRecipeById(id));
            
            // Increment view count when user visits recipe detail
            const incrementView = async () => {
                try {
                    // Get or create sessionId for anti-spam
                    let sessionId = sessionStorage.getItem('sessionId');
                    if (!sessionId) {
                        sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                        sessionStorage.setItem('sessionId', sessionId);
                    }
                    
                    await axiosInstance.post(`/views/${id}/increment`, {
                        sessionId
                    });
                } catch (error) {
                    console.error('Failed to increment view:', error);
                }
            };
            
            incrementView();
        }
    }, [dispatch, id]);

    // Check if recipe is favorited
    useEffect(() => {
        if (id && user?._id) {
            dispatch(checkUserFavorited({ recipeId: id, userId: user._id }));
        }
    }, [dispatch, id, user]);

    useEffect(() => {
        if (id) {
            setIsFavorited(favoriteRecipeIds.includes(id));
        }
    }, [favoriteRecipeIds, id]);

    const handleFavoriteClick = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (id) {
            try {
                const result = await dispatch(toggleFavorite({ recipeId: id })).unwrap();
                
                // Show toast based on action
                if (result.message?.includes('added') || result.message?.includes('thêm')) {
                    toast.success(
                        language === 'vi' 
                            ? ' Đã thêm vào yêu thích!' 
                            : ' Added to favorites!'
                    );
                } else {
                    toast.success(
                        language === 'vi' 
                            ? ' Đã bỏ yêu thích!' 
                            : ' Removed from favorites!'
                    );
                }
            } catch (error) {
                console.error("Failed to toggle favorite:", error);
                toast.error(
                    language === 'vi' 
                        ? 'Có lỗi xảy ra. Vui lòng thử lại!' 
                        : 'An error occurred. Please try again!'
                );
            }
        }
    };

    const toggleStep = (index: number) => {
        setOpenSteps(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    // Chỉ show loading spinner khi đang load VÀ chưa có currentRecipe
    if (loading && !currentRecipe) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    // Show not found nếu không loading và không có currentRecipe
    if (!loading && !currentRecipe) {
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <h2 className="text-2xl font-semibold">
                    {language === 'vi' ? 'Không tìm thấy công thức' : 'Recipe not found'}
                </h2>
                <Link to="/recipes" className="text-orange-500 hover:underline mt-4 block">
                    {language === 'vi' ? 'Quay lại danh sách công thức' : 'Return to recipes'}
                </Link>
            </div>
        );
    }

    // Nếu currentRecipe tồn tại NHƯNG chưa có instructions (đang load), show loading
    if (!currentRecipe || !currentRecipe.instructions || currentRecipe.instructions.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Header with Image */}
            <div className="relative h-[50vh] md:h-[60vh] w-full">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src={currentRecipe.image}
                    alt={currentRecipe.name}
                    className="w-full h-full object-cover"
                />
                <Link
                    to="/recipes"
                    className="absolute top-4 left-4 bg-white/90 hover:bg-white rounded-full p-2 z-20 transition-all"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <button
                    onClick={handleFavoriteClick}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 z-20 transition-all"
                    aria-label={isFavorited 
                        ? (language === 'vi' ? "Bỏ khỏi yêu thích" : "Remove from favorites") 
                        : (language === 'vi' ? "Thêm vào yêu thích" : "Add to favorites")}
                >
                    <Heart
                        className={`h-6 w-6 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                            }`}
                    />
                </button>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white z-20">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-green-500/80 px-4 py-1 rounded-full text-sm font-medium">
                                {currentRecipe.difficulty}
                            </span>
                            <span className="bg-orange-500/80 px-4 py-1 rounded-full text-sm font-medium">
                                {currentRecipe.cuisine.name}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                            {currentRecipe.name}
                        </h1>
                        <p className="text-base sm:text-lg opacity-95 max-w-2xl mb-4 md:mb-6">
                            {currentRecipe.short}
                        </p>

                        {/* Recipe Info - Moved here as shown in image */}
                        <div className="flex flex-wrap items-center gap-4 md:gap-8">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-sm sm:text-base">
                                    {currentRecipe.time} {language === 'vi' ? 'phút' : 'minutes'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-sm sm:text-base">
                                    {currentRecipe.size} {language === 'vi' ? 'người ăn' : 'servings'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-yellow-400" />
                                <span className="font-medium text-sm sm:text-base">{(currentRecipe.rate || 0).toFixed(1)}</span>
                                <span className="opacity-80 text-sm sm:text-base">
                                    ({currentRecipe.numberOfRate || 0} {language === 'vi' ? 'đánh giá' : 'reviews'})
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8 max-w-7xl">

                {/* Main Content - Ingredients & Instructions Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 sm:mb-10">
                    
                    {/* Ingredients - Left Side (1/3) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg border-2 border-orange-100 overflow-hidden sticky top-4">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-white">
                                    <span className="bg-white p-2 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6 text-orange-500">
                                            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                                            <path d="M7 2v20" />
                                            <path d="M21 15V2" />
                                            <path d="M18 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                            <path d="M21 15a3 3 0 0 0-3-3" />
                                        </svg>
                                    </span>
                                    {language === 'vi' ? 'Nguyên Liệu' : 'Ingredients'}
                                </h2>
                            </div>

                            <div className="p-4 sm:p-5">
                                <div className="space-y-2">
                                    {currentRecipe.ingredients && currentRecipe.ingredients.length > 0 ? (
                                        currentRecipe.ingredients.map((ingredient, index) => (
                                            <label 
                                                key={index} 
                                                htmlFor={`ingredient-${index}`}
                                                className="flex items-center gap-3 py-2.5 px-3 bg-gray-50 rounded-lg hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all duration-300 cursor-pointer group"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`ingredient-${index}`}
                                                    className="h-5 w-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 transition-all duration-200 cursor-pointer"
                                                />
                                                <span className="text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 font-medium flex-1 transition-colors duration-200">
                                                    {ingredient.name}
                                                </span>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">
                                            {language === 'vi' ? 'Đang tải nguyên liệu...' : 'Loading ingredients...'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions - Right Side (2/3) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg border-2 border-orange-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-white">
                                    <span className="bg-white p-2 rounded-lg">
                                        <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
                                    </span>
                                    {language === 'vi' ? 'Hướng Dẫn Nấu Ăn' : 'Cooking Instructions'}
                                </h2>
                            </div>

                            <div className="p-4 sm:p-6">
                                <div className="space-y-3">
                                    {currentRecipe.instructions.map((instruction, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:border-orange-300 transition-all">
                                            {/* Step Header - Clickable */}
                                            <button
                                                onClick={() => toggleStep(index)}
                                                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent transition-all duration-300 text-left group"
                                            >
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                                                        {index + 1}
                                                    </div>
                                                </div>

                                                <div className="flex-grow">
                                                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                                                        {instruction.title}
                                                    </h3>
                                                </div>

                                                <div className="flex-shrink-0">
                                                    <ChevronDown 
                                                        className={`h-5 w-5 text-orange-500 transition-all duration-500 ease-in-out ${
                                                            openSteps.includes(index) ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </div>
                                            </button>

                                            {/* Step Content - Collapsible */}
                                            <div 
                                                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                                    openSteps.includes(index) ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                <div className="p-4 sm:p-5 pt-0 bg-gray-50 border-t border-gray-200">
                                                    {/* Images */}
                                                    {instruction.images && instruction.images.length > 0 && (
                                                        <div className="mb-4 max-w-lg mx-auto">
                                                            {/* 1 ảnh - nằm giữa */}
                                                            {instruction.images.length === 1 && (
                                                                <div className="w-3/5 sm:w-2/3 mx-auto">
                                                                    <img
                                                                        src={instruction.images[0]}
                                                                        alt={`${instruction.title} - 1`}
                                                                        className="w-full h-auto object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            target.style.display = 'none';
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                            
                                                            {/* 2 ảnh - 2 ảnh 1 hàng */}
                                                            {instruction.images.length === 2 && (
                                                                <div className="grid grid-cols-2 gap-1">
                                                                    {instruction.images.map((img: string, imgIndex: number) => (
                                                                        <div key={imgIndex} className="w-full overflow-hidden rounded-lg">
                                                                            <img
                                                                                src={img}
                                                                                alt={`${instruction.title} - ${imgIndex + 1}`}
                                                                                className="w-full h-full object-cover aspect-square"
                                                                                onError={(e) => {
                                                                                    const target = e.target as HTMLImageElement;
                                                                                    target.style.display = 'none';
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            
                                                            {/* 3 ảnh - 2 ảnh trên, 1 ảnh dưới */}
                                                            {instruction.images.length === 3 && (
                                                                <div className="space-y-1">
                                                                    <div className="grid grid-cols-2 gap-1">
                                                                        {instruction.images.slice(0, 2).map((img: string, imgIndex: number) => (
                                                                            <div key={imgIndex} className="w-full overflow-hidden rounded-lg">
                                                                                <img
                                                                                    src={img}
                                                                                    alt={`${instruction.title} - ${imgIndex + 1}`}
                                                                                    className="w-full h-full object-cover aspect-square"
                                                                                    onError={(e) => {
                                                                                        const target = e.target as HTMLImageElement;
                                                                                        target.style.display = 'none';
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="w-full overflow-hidden rounded-lg">
                                                                        <img
                                                                            src={instruction.images[2]}
                                                                            alt={`${instruction.title} - 3`}
                                                                            className="w-full h-auto object-cover"
                                                                            onError={(e) => {
                                                                                const target = e.target as HTMLImageElement;
                                                                                target.style.display = 'none';
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            
                                                            {/* 4 ảnh - 2 ảnh trên, 2 ảnh dưới */}
                                                            {instruction.images.length === 4 && (
                                                                <div className="grid grid-cols-2 gap-1">
                                                                    {instruction.images.map((img: string, imgIndex: number) => (
                                                                        <div key={imgIndex} className="w-full overflow-hidden rounded-lg">
                                                                            <img
                                                                                src={img}
                                                                                alt={`${instruction.title} - ${imgIndex + 1}`}
                                                                                className="w-full h-full object-cover aspect-square"
                                                                                onError={(e) => {
                                                                                    const target = e.target as HTMLImageElement;
                                                                                    target.style.display = 'none';
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            
                                                            {/* Hơn 4 ảnh - grid 2 hoặc 3 cột */}
                                                            {instruction.images.length > 4 && (
                                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                                                                    {instruction.images.map((img: string, imgIndex: number) => (
                                                                        <div key={imgIndex} className="w-full overflow-hidden rounded-lg">
                                                                            <img
                                                                                src={img}
                                                                                alt={`${instruction.title} - ${imgIndex + 1}`}
                                                                                className="w-full h-full object-cover aspect-square"
                                                                                onError={(e) => {
                                                                                    const target = e.target as HTMLImageElement;
                                                                                    target.style.display = 'none';
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Step Details */}
                                                    <div className="space-y-2">
                                                        {instruction.subTitle.map((step: string, stepIndex: number) => (
                                                            <div key={stepIndex} className="flex gap-2">
                                                                <span className="text-orange-500 font-bold mt-1">•</span>
                                                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed flex-1">
                                                                    {step}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cooking Tips & Video Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    
                    {/* Cooking Tips - Left Side (2/3) */}
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 sm:p-7 shadow-md border-2 border-orange-200 h-full">
                            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 text-orange-700 flex items-center gap-2">
                                <div className="bg-orange-500 p-2 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6 text-white">
                                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                    </svg>
                                </div>
                                {language === 'vi' ? 'Mẹo Nấu Ăn' : 'Cooking Tips'}
                            </h2>
                            <div className="space-y-3">
                                <div className="flex gap-3 items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">1</span>
                                        </div>
                                    </div>
                                    <p className="text-orange-900 text-sm sm:text-base leading-relaxed">
                                        {language === 'vi' ? 'Đọc hết tất cả hướng dẫn trước khi bắt đầu nấu' : 'Read through all instructions before starting to cook'}
                                    </p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">2</span>
                                        </div>
                                    </div>
                                    <p className="text-orange-900 text-sm sm:text-base leading-relaxed">
                                        {language === 'vi' ? 'Chuẩn bị và đong đo tất cả nguyên liệu trước khi bắt đầu' : 'Prepare and measure all ingredients before you begin'}
                                    </p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">3</span>
                                        </div>
                                    </div>
                                    <p className="text-orange-900 text-sm sm:text-base leading-relaxed">
                                        {language === 'vi' ? 'Điều chỉnh gia vị theo khẩu vị cá nhân' : 'Adjust seasoning to taste preference'}
                                    </p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">4</span>
                                        </div>
                                    </div>
                                    <p className="text-orange-900 text-sm sm:text-base leading-relaxed">
                                        {language === 'vi' ? 'Để có kết quả tốt nhất, hãy sử dụng nguyên liệu tươi' : 'For best results, use fresh ingredients'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Tutorial - Right Side (1/3) */}
                    {currentRecipe.video && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-md border-2 border-orange-100 overflow-hidden h-full">
                                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 sm:p-4 border-b border-orange-200">
                                    <h3 className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                        </svg>
                                        {language === 'vi' ? 'Video Hướng Dẫn' : 'Video Tutorial'}
                                    </h3>
                                </div>
                                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                                    <iframe
                                        src={currentRecipe.video.replace("watch?v=", "embed/")}
                                        title={`${currentRecipe.name} video tutorial`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute top-0 left-0 w-full h-full"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Comment Section */}
                <CommentSection recipeId={currentRecipe._id} />
            </div>
        </div>
    );
}
