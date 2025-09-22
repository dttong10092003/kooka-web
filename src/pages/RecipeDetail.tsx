import { ArrowLeft, ChefHat, Clock, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { getRecipeById } from '../redux/slices/recipeSlice';

export default function RecipeDetail() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
    const [showVideo, setShowVideo] = useState(false);

    // Get recipe from Redux store
    const recipes = useSelector((state: RootState) => state.recipes.recipes);
    const loading = useSelector((state: RootState) => state.recipes.loading);
    const recipe = recipes.find(r => r._id === id);

    useEffect(() => {
        if (id && !recipe) {
            dispatch(getRecipeById(id));
        }
    }, [dispatch, id, recipe]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <h2 className="text-2xl font-semibold">Recipe not found</h2>
                <Link to="/recipes" className="text-orange-500 hover:underline mt-4 block">
                    Return to recipes
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Header with Image */}
            <div className="relative h-[50vh] md:h-[60vh] w-full">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                />
                <Link
                    to="/recipes"
                    className="absolute top-4 left-4 bg-white/90 hover:bg-white rounded-full p-2 z-20 transition-all"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white z-20">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-green-500/80 px-4 py-1 rounded-full text-sm font-medium">
                                {recipe.difficulty}
                            </span>
                            <span className="bg-orange-500/80 px-4 py-1 rounded-full text-sm font-medium">
                                {recipe.cuisine}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                            {recipe.name}
                        </h1>
                        <p className="text-base sm:text-lg opacity-95 max-w-2xl mb-4 md:mb-6">
                            {recipe.short}
                        </p>

                        {/* Recipe Info - Moved here as shown in image */}
                        <div className="flex flex-wrap items-center gap-4 md:gap-8">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-sm sm:text-base">{recipe.time} minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-sm sm:text-base">{recipe.size} servings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-yellow-400" />
                                <span className="font-medium text-sm sm:text-base">{recipe.rate.toFixed(1)}</span>
                                <span className="opacity-80 text-sm sm:text-base">({recipe.numberOfRate} reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8 max-w-6xl">

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm mb-6 md:mb-8">
                    <div className="flex flex-wrap border-b border-gray-200">
                        <button
                            className={`py-3 px-3 sm:py-4 sm:px-6 font-medium flex items-center ${activeTab === 'ingredients'
                                    ? 'text-orange-500 border-b-2 border-orange-500'
                                    : 'text-gray-600'
                                }`}
                            onClick={() => setActiveTab('ingredients')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 sm:mr-2 sm:w-5 sm:h-5">
                                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                            </svg>
                            <span className="text-sm sm:text-base">Ingredients</span>
                        </button>
                        <button
                            className={`py-3 px-3 sm:py-4 sm:px-6 font-medium flex items-center ${activeTab === 'instructions'
                                    ? 'text-orange-500 border-b-2 border-orange-500'
                                    : 'text-gray-600'
                                }`}
                            onClick={() => setActiveTab('instructions')}
                        >
                            <ChefHat className="mr-1 sm:mr-2 w-5 h-5" />
                            <span className="text-sm sm:text-base">Cooking Instructions</span>
                        </button>
                    </div>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'ingredients' && (
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-orange-100">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-gray-800">
                            <span className="text-orange-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6">
                                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                                    <path d="M7 2v20" />
                                    <path d="M21 15V2" />
                                    <path d="M18 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                    <path d="M21 15a3 3 0 0 0-3-3" />
                                </svg>
                            </span>
                            Ingredients
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            {recipe.ingredients.map((ingredient, index) => {
                                // Determine if this is a heading or regular ingredient
                                const isHeading = ingredient.includes(':') && !ingredient.includes(',');

                                if (isHeading) {
                                    return (
                                        <div key={index} className="col-span-1 md:col-span-2 mt-2 first:mt-0">
                                            <h3 className="text-sm sm:text-base font-semibold text-orange-600 pb-1 border-b border-orange-200">
                                                {ingredient.replace(':', '')}
                                            </h3>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={index} className="flex items-center gap-3 py-1.5 sm:py-2 bg-orange-50/50 px-3 rounded-lg hover:bg-orange-50 transition-colors">
                                        <div className="h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                id={`ingredient-${index}`}
                                                className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 border-2 border-orange-300 rounded-sm focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 transition-colors cursor-pointer"
                                            />
                                        </div>
                                        <label
                                            htmlFor={`ingredient-${index}`}
                                            className="text-sm sm:text-base text-gray-700 cursor-pointer hover:text-gray-900"
                                        >
                                            {ingredient}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-orange-100">
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="block text-gray-400 text-xs sm:text-sm">Prep time</span>
                                        <span className="font-medium text-sm sm:text-base">{Math.floor(recipe.time * 0.3)} min</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M8 5h8" />
                                            <path d="M8 10h8" />
                                            <path d="M8 15h8" />
                                            <path d="M8 20h8" />
                                            <path d="M12 5v15" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="block text-gray-400 text-xs sm:text-sm">Cook time</span>
                                        <span className="font-medium text-sm sm:text-base">{Math.floor(recipe.time * 0.7)} min</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="block text-gray-400 text-xs sm:text-sm">Total time</span>
                                        <span className="font-medium text-sm sm:text-base">{recipe.time} min</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'instructions' && (
                    <div>
                        {/* Toggle Video Button */}
                        {recipe.video && (
                            <button
                                onClick={() => setShowVideo(!showVideo)}
                                className="mb-4 sm:mb-6 bg-orange-100 text-orange-600 hover:bg-orange-200 px-4 sm:px-5 py-1.5 sm:py-2 rounded-md flex items-center gap-1.5 sm:gap-2 font-medium transition-colors text-sm sm:text-base"
                            >
                                {showVideo ? 'Hide Video' : 'Show Video Tutorial'}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                            </button>
                        )}

                        {/* Video Player */}
                        {showVideo && recipe.video && (
                            <div className="mb-6 sm:mb-8 rounded-lg overflow-hidden shadow-lg">
                                <div className="relative w-full pt-[56.25%]">
                                    <iframe
                                        src={recipe.video.replace("watch?v=", "embed/")}
                                        title={`${recipe.name} video tutorial`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute top-0 left-0 w-full h-full"
                                    ></iframe>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-gray-800">
                                <span className="text-orange-500">
                                    <ChefHat className="h-5 w-5 sm:h-6 sm:w-6" />
                                </span>
                                Cooking Instructions
                            </h2>

                            <div className="space-y-6 sm:space-y-8">
                                {recipe.instructions.map((instruction, index) => (
                                    <div key={index} className="flex gap-3 sm:gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-base sm:text-lg">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 text-gray-800">{instruction.title}</h3>

                                            {instruction.image && (
                                                <img
                                                    src={instruction.image}
                                                    alt={instruction.title}
                                                    className="w-full h-auto object-cover rounded-lg mb-3 sm:mb-4"
                                                />
                                            )}

                                            <div className="space-y-2 sm:space-y-3">
                                                {instruction.subTitle.map((step, stepIndex) => (
                                                    <p key={stepIndex} className="text-sm sm:text-base text-gray-700 leading-relaxed">{step}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Cooking Tips */}
                <div className="mt-8 sm:mt-10 bg-orange-50 rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-orange-700 flex items-center gap-1.5 sm:gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6">
                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                        Cooking Tips
                    </h2>
                    <ul className="list-disc pl-5 sm:pl-6 space-y-2 sm:space-y-3 text-orange-900 text-sm sm:text-base">
                        <li>Read through all instructions before starting to cook</li>
                        <li>Prepare and measure all ingredients before you begin</li>
                        <li>Adjust seasoning to taste preference</li>
                        <li>For best results, use fresh ingredients</li>
                    </ul>
                </div>

                {/* Related Recipes - Placeholder */}
                <div className="mt-10 sm:mt-16 mb-6 sm:mb-10">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-1.5 sm:gap-2 text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 sm:w-6 sm:h-6">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        You Might Also Like
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* This would be populated from your Redux store or API */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-36 sm:h-48 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
                                    alt="Vegetable Salad"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-3 sm:p-4">
                                <h3 className="font-semibold text-base sm:text-lg mb-1">Fresh Vegetable Salad</h3>
                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    <span>15 minutes</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-36 sm:h-48 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                                    alt="Grilled Chicken"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-3 sm:p-4">
                                <h3 className="font-semibold text-base sm:text-lg mb-1">Grilled Chicken with Herbs</h3>
                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    <span>30 minutes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
