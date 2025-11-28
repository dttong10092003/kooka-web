import { useEffect, useMemo, useRef } from "react"
import { RecipeCard } from "./RecipeCard"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/store"
import { searchRecipes, searchRecipesByKeyword } from "../redux/slices/recipeSlice"
import { checkMultipleRecipes } from "../redux/slices/favoriteSlice"

interface SearchingRecipesProps {
    // trường hợp tìm theo ingredients
    ingredients?: string[]
    cuisine?: string
    category?: string
    tags?: string[]

    // trường hợp tìm theo keyword
    searchParams?: {
        keyword?: string
        ingredients?: string[]
        cuisine?: string
        category?: string
        tags?: string[]
    }
}

export default function SearchingRecipes({
    ingredients,
    cuisine,
    category,
    tags,
    searchParams,
}: SearchingRecipesProps) {
    const dispatch = useDispatch<AppDispatch>()
    const { searchResults, loading, error } = useSelector((state: RootState) => state.recipes)
    const user = useSelector((state: RootState) => state.auth.user)

    // Memoize các dependencies để tránh re-render không cần thiết
    const ingredientsKey = useMemo(() => JSON.stringify(ingredients), [ingredients])
    const tagsKey = useMemo(() => JSON.stringify(tags), [tags])
    const searchParamsKey = useMemo(() => JSON.stringify(searchParams), [searchParams])

    // Ref để track query đã dispatch, tránh dispatch trùng lặp
    const lastQueryRef = useRef<string>("")

    useEffect(() => {
        const currentQuery = searchParamsKey + ingredientsKey + cuisine + category + tagsKey;
        
        // Nếu query giống với lần trước, không dispatch nữa
        if (lastQueryRef.current === currentQuery) {
            return;
        }


        lastQueryRef.current = currentQuery;

        if (searchParams?.keyword) {
            // tìm theo keyword
            dispatch(
                searchRecipesByKeyword({
                    keywords: searchParams.keyword,
                    cuisine: searchParams.cuisine,
                    category: searchParams.category,
                    tags: searchParams.tags,
                    top_k: 10,
                })
            )
        } else if (
            ingredients &&
            (ingredients.length > 0 || cuisine || category || (tags && tags.length > 0))
        ) {
            // tìm theo ingredients
            dispatch(
                searchRecipes({
                    ingredients,
                    cuisine,
                    category,
                    tags,
                    top_k: 10,
                })
            )
        }
    }, [dispatch, ingredientsKey, cuisine, category, tagsKey, searchParamsKey, searchParams, ingredients, tags])

    // Check favorites for all recipes when user is logged in
    useEffect(() => {
        if (user && searchResults.length > 0) {
            const recipeIds = searchResults.map(recipe => recipe._id)
            dispatch(checkMultipleRecipes({ recipeIds }))
        }
    }, [user, searchResults, dispatch])

    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Kết quả tìm kiếm công thức
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Các công thức gợi ý dựa trên lựa chọn của bạn
                    </p>
                </div>

                {/* Loading / Error */}
                {loading && <p className="text-center text-gray-500">Đang tìm kiếm...</p>}
                {error && <p className="text-center text-red-500">Lỗi: {error}</p>}

                {/* Recipe Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.length > 0 ? (
                        searchResults.map((recipe) => (
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
                        ))
                    ) : (
                        !loading && (
                            <p className="text-center text-gray-500 col-span-3">
                                Không tìm thấy công thức phù hợp
                            </p>
                        )
                    )}
                </div>
            </div>
        </section>
    )
}
