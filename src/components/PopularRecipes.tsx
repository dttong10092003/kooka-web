import { useEffect, useMemo } from "react"
import { RecipeCard } from "./RecipeCard"

import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/store"
import { fetchPopularRecipes } from "../redux/slices/recipeSlice"
import { checkMultipleRecipes } from "../redux/slices/favoriteSlice"

export default function PopularRecipes() {
    const dispatch = useDispatch<AppDispatch>()
    const { popularRecipes, loading } = useSelector((state: RootState) => state.recipes)
    const user = useSelector((state: RootState) => state.auth.user)

    // Memoize recipe IDs to prevent unnecessary recalculations
    const displayedRecipeIds = useMemo(() => {
        return popularRecipes.map(recipe => recipe._id).join(',')
    }, [popularRecipes])

    useEffect(() => {
        dispatch(fetchPopularRecipes(6))
    }, [dispatch])

    // Check favorites for all recipes when user is logged in
    // Only run when user changes or displayed recipes change
    useEffect(() => {
        if (user && displayedRecipeIds) {
            const recipeIds = displayedRecipeIds.split(',')
            dispatch(checkMultipleRecipes({ recipeIds }))
        }
    }, [user?._id, displayedRecipeIds, dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

    console.log("PopularRecipes - popularRecipes:", popularRecipes)

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Công thức phổ biến</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Khám phá những công thức nấu ăn yêu thích nhất từ cộng đồng đầu bếp tại gia!
                    </p>
                </div>

                {/* Recipe Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {popularRecipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe._id}
                                    id={recipe._id}
                                    title={recipe.name}
                                    description={recipe.short}
                                    image={recipe.image}
                                    rating={recipe.rate}
                                    difficulty={recipe.difficulty}
                                    cookTime={`${recipe.time}m`}
                                    servings={recipe.size}
                                    cuisine={recipe.cuisine.name}
                                    ingredients={
                                        Array.isArray(recipe.ingredients)
                                            ? recipe.ingredients.slice(0, 3).map((ing) => ing.name)
                                            : []
                                    }
                                    moreIngredients={
                                        Array.isArray(recipe.ingredients) && recipe.ingredients.length > 3
                                            ? recipe.ingredients.length - 3
                                            : 0
                                    }
                                    reviews={recipe.numberOfRate}
                                />
                            ))}
                        </div>

                        {/* View All Button */}
                        {popularRecipes.length >= 6 && (
                            <div className="text-center">
                                <a
                                    href="/recipes/all"
                                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                                >
                                    <span>Xem tất cả món ăn</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}
