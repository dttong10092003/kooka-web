import { Clock, Users, Star, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { toggleFavorite } from "../redux/slices/favoriteSlice"
import { useEffect, useState } from "react"

interface RecipeCardProps {
  id: string
  title: string
  description: string
  image: string
  rating: number
  difficulty: string
  cookTime: string
  servings: number
  cuisine: string
  ingredients: string[]
  moreIngredients?: number
  reviews: number
}

export function RecipeCard({
  id,
  title,
  description,
  image,
  rating,
  difficulty,
  cookTime,
  servings,
  cuisine,
  ingredients,
  moreIngredients,
  reviews,
}: RecipeCardProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { favoriteRecipeIds } = useAppSelector((state: any) => state.favorites)
  const { user } = useAppSelector((state: any) => state.auth)
  const [isFavorited, setIsFavorited] = useState(false)
  
  useEffect(() => {
    setIsFavorited(favoriteRecipeIds.includes(id))
  }, [favoriteRecipeIds, id])

  const difficultyColors: Record<string, string> = {
    "Dễ": "bg-green-100 text-green-800",
    "Trung bình": "bg-yellow-100 text-yellow-800",
    "Khó": "bg-red-100 text-red-800",
  }

  const difficultyClass =
    difficultyColors[difficulty] || "bg-gray-100 text-gray-800"

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      navigate("/login")
      return
    }
    try {
      await dispatch(toggleFavorite({ recipeId: id })).unwrap()
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  return (
    <div
      onClick={() => navigate(`/recipe/${id}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group h-full flex flex-col">
      {/* Image */}
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{(rating || 0).toFixed(1)}</span>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
        <div
          className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${difficultyClass}`}
        >
          {difficulty}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-shrink-0">{description}</p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-shrink-0">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{servings} người ăn</span>
          </div>
          <span className="text-gray-400">•</span>
          <span>{cuisine}</span>
        </div>

        {/* Ingredients */}
        <div className="mb-4 flex-grow">
          <div className="flex flex-wrap gap-1">
            {ingredients.slice(0, 3).map((ingredient) => (
              <span key={ingredient} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                {ingredient}
              </span>
            ))}
            {(moreIngredients ?? 0) > 0 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">+{moreIngredients} more</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm text-gray-500">{reviews} đánh giá</span>
          <button type="button"
            onClick={() => {
              navigate(`/recipes/${id}`)
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">View Recipe</button>
        </div>
      </div>
    </div>
  )
}
