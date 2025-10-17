import type React from "react"
import { useEffect, useState } from "react"
import { Heart, Loader2 } from "lucide-react"
import { RecipeCard } from "../components/RecipeCard"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { getUserFavorites } from "../redux/slices/favoriteSlice"
import { fetchRecipes } from "../redux/slices/recipeSlice"

const MyFavourite: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state: any) => state.auth)
  const { favorites, loading } = useAppSelector((state: any) => state.favorites)
  const { recipes } = useAppSelector((state: any) => state.recipes)
  const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([])

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserFavorites({ userId: user._id }))
      dispatch(fetchRecipes())
    }
  }, [dispatch, user])

  useEffect(() => {
    if (favorites.length > 0 && recipes.length > 0) {
      const favoriteRecipeIds = favorites.map((fav: any) => fav.recipeId)
      const matchedRecipes = recipes.filter((recipe: any) => 
        favoriteRecipeIds.includes(recipe._id)
      )
      setFavoriteRecipes(matchedRecipes)
    } else {
      setFavoriteRecipes([])
    }
  }, [favorites, recipes])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Công Thức Yêu Thích</h2>

      {favoriteRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe: any) => (
            <RecipeCard
              key={recipe._id}
              id={recipe._id}
              title={recipe.name}
              description={recipe.short}
              image={recipe.image || "https://via.placeholder.com/400x250"}
              rating={recipe.rate || 0}
              difficulty={recipe.difficulty || "Trung bình"}
              cookTime={`${recipe.time || 0}m`}
              servings={recipe.size || 0}
              cuisine={recipe.cuisine?.name || "Không rõ"}
              ingredients={
                Array.isArray(recipe.ingredients)
                  ? recipe.ingredients.slice(0, 3).map((ing: any) => ing.name)
                  : []
              }
              moreIngredients={
                Array.isArray(recipe.ingredients) && recipe.ingredients.length > 3
                  ? recipe.ingredients.length - 3
                  : 0
              }
              reviews={recipe.numberOfRate || 0}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">Chưa có công thức yêu thích nào</p>
          <p className="text-gray-400">Hãy thêm công thức yêu thích để xem ở đây</p>
        </div>
      )}
    </div>
  )
}

export default MyFavourite
