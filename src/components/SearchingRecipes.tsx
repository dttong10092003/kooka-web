import { useEffect } from "react"
import { RecipeCard } from "./RecipeCard"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/store"
import { searchRecipes } from "../redux/slices/recipeSlice"

interface SearchingRecipesProps {
    ingredients: string[] // danh sách nguyên liệu truyền từ HeroSection
    cuisine?: string
    category?: string
    tags?: string[]
}

export default function SearchingRecipes({
    ingredients,
    cuisine,
    category,
    tags,
}: SearchingRecipesProps) {
    const dispatch = useDispatch<AppDispatch>()
    const { recipes, loading, error } = useSelector((state: RootState) => state.recipes)

    useEffect(() => {
        if (ingredients.length > 0 || cuisine || category || (tags && tags.length > 0)) {
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
    }, [ingredients, cuisine, category, tags, dispatch])

    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Kết quả tìm kiếm công thức
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Các công thức gợi ý dựa trên nguyên liệu và lựa chọn của bạn
                    </p>
                </div>

                {/* Loading / Error */}
                {loading && <p className="text-center text-gray-500">Đang tìm kiếm...</p>}
                {error && <p className="text-center text-red-500">Lỗi: {error}</p>}

                {/* Recipe Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.length > 0 ? (
                        recipes.map((recipe) => (
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
                                cuisine={recipe.cuisine}
                                ingredients={Array.isArray(recipe.ingredients) ? recipe.ingredients.slice(0, 3) : []}
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
