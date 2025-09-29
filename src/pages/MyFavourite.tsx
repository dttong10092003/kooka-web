import type React from "react"
import { Heart } from "lucide-react"
import { RecipeCard } from "../components/RecipeCard"

const MyFavourite: React.FC = () => {
  const favoriteRecipes = [
    {
      id: "1",
      title: "Phở Bò",
      description: "Món phở bò truyền thống Việt Nam với nước dùng thơm ngon.",
      image: "https://picsum.photos/400/250?random=1",
      rating: 4.8,
      difficulty: "Trung bình",
      cookTime: "45 phút",
      servings: 4,
      cuisine: "Việt Nam",
      ingredients: ["Thịt bò", "Bánh phở", "Hành lá"],
      reviews: 120
    },
    {
      id: "2",
      title: "Bánh Mì Thịt Nướng",
      description: "Bánh mì giòn tan kẹp thịt nướng đậm đà hương vị.",
      image: "https://picsum.photos/400/250?random=2",
      rating: 4.6,
      difficulty: "Dễ",
      cookTime: "20 phút",
      servings: 2,
      cuisine: "Việt Nam",
      ingredients: ["Bánh mì", "Thịt nướng", "Rau cải"],
      reviews: 85
    },
    {
      id: "3",
      title: "Gỏi Cuốn Tôm Thịt",
      description: "Món ăn thanh mát, chấm kèm nước mắm pha chua ngọt.",
      image: "https://picsum.photos/400/250?random=3",
      rating: 4.7,
      difficulty: "Dễ",
      cookTime: "15 phút",
      servings: 3,
      cuisine: "Việt Nam",
      ingredients: ["Bánh tráng", "Tôm", "Thịt heo"],
      reviews: 95
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Công Thức Yêu Thích</h2>

      {favoriteRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe) => (
            <div key={recipe.id} className="relative h-full">
              <div className="h-full">
                <RecipeCard
                  id={recipe.id}
                  title={recipe.title}
                  description={recipe.description}
                  image={recipe.image}
                  rating={recipe.rating}
                  difficulty={recipe.difficulty}
                  cookTime={recipe.cookTime}
                  servings={recipe.servings}
                  cuisine={recipe.cuisine}
                  ingredients={recipe.ingredients}
                  reviews={recipe.reviews}
                />
              </div>
              {/* Favorite heart overlay */}
              <button
                onClick={() => alert(`Xóa ${recipe.title} khỏi yêu thích`)}
                className="absolute top-12 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors duration-200 z-10 shadow-md"
              >
                <Heart className="h-4 w-4 text-red-500 fill-current" />
              </button>
            </div>
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
