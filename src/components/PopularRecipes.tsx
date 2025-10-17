import { useEffect } from "react"
import { RecipeCard } from "./RecipeCard"

import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/store"
import { fetchRecipes } from "../redux/slices/recipeSlice"
import { checkMultipleRecipes } from "../redux/slices/favoriteSlice"

export default function PopularRecipes() {
    // const recipes = [
    //     {
    //         id: "1",
    //         title: "Classic Spaghetti Carbonara",
    //         description: "Món mì ống kem với trứng, phô mai và thịt xông khói",
    //         image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=500",
    //         rating: 4.8,
    //         difficulty: "Medium" as const,
    //         cookTime: "20m",
    //         servings: 4,
    //         cuisine: "Italian",
    //         ingredients: ["spaghetti", "eggs", "parmesan cheese"],
    //         moreIngredients: 3,
    //         reviews: 234,
    //     },
    //     {
    //         id: "2",
    //         title: "Chicken Stir Fry",
    //         description: "Gà xào nhanh và lành mạnh với rau củ hỗn hợp",
    //         image: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=500",
    //         rating: 4.6,
    //         difficulty: "Easy" as const,
    //         cookTime: "15m",
    //         servings: 3,
    //         cuisine: "Asian",
    //         ingredients: ["chicken breast", "bell peppers", "broccoli"],
    //         moreIngredients: 4,
    //         reviews: 189,
    //     },
    //     {
    //         id: "3",
    //         title: "Margherita Pizza",
    //         description: "Pizza Ý cổ điển với húng quế tươi và mozzarella",
    //         image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=500",
    //         rating: 4.9,
    //         difficulty: "Medium" as const,
    //         cookTime: "25m",
    //         servings: 2,
    //         cuisine: "Italian",
    //         ingredients: ["pizza dough", "tomato sauce", "mozzarella cheese"],
    //         moreIngredients: 2,
    //         reviews: 456,
    //     },
    //     {
    //         id: "4",
    //         title: "Caesar Salad",
    //         description: "Salad cổ điển với sốt Caesar và bánh mì nướng",
    //         image: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=500",
    //         rating: 4.4,
    //         difficulty: "Easy" as const,
    //         cookTime: "10m",
    //         servings: 2,
    //         cuisine: "American",
    //         ingredients: ["romaine lettuce", "caesar dressing", "croutons"],
    //         moreIngredients: 3,
    //         reviews: 167,
    //     },
    //     {
    //         id: "5",
    //         title: "Beef Tacos",
    //         description: "Tacos thịt bò với rau sống và sốt cay",
    //         image: "https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=500",
    //         rating: 4.7,
    //         difficulty: "Easy" as const,
    //         cookTime: "20m",
    //         servings: 4,
    //         cuisine: "Mexican",
    //         ingredients: ["ground beef", "taco shells", "lettuce"],
    //         moreIngredients: 4,
    //         reviews: 298,
    //     },
    //     {
    //         id: "6",
    //         title: "Chocolate Cake",
    //         description: "Bánh chocolate mềm mịn với kem tươi",
    //         image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=500",
    //         rating: 4.9,
    //         difficulty: "Easy" as const,
    //         cookTime: "45m",
    //         servings: 8,
    //         cuisine: "Dessert",
    //         ingredients: ["chocolate", "flour", "eggs"],
    //         moreIngredients: 5,
    //         reviews: 523,
    //     },
    // ]

    const dispatch = useDispatch<AppDispatch>()
    const { recipes} = useSelector((state: RootState) => state.recipes)
    const user = useSelector((state: RootState) => state.auth.user)

    useEffect(() => {
        dispatch(fetchRecipes())
    }, [dispatch])

    // Check favorites for all recipes when user is logged in
    useEffect(() => {
        if (user && recipes.length > 0) {
            const recipeIds = recipes.slice(0, 6).map(recipe => recipe._id)
            dispatch(checkMultipleRecipes({ recipeIds }))
        }
    }, [user, recipes, dispatch])

    console.log("PopularRecipes - recipes:", recipes)

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Công thức phổ biến</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Khám phá những công thức được yêu thích nhất từ cộng đồng đầu bếp tại gia của chúng tôi
                    </p>
                </div>

                

                {/* Recipe Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.slice(0, 6).map((recipe) => (
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
            </div>
        </section>
    )
}
