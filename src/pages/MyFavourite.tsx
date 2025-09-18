import type React from "react"
import { Heart, Star, Clock } from "lucide-react"

const MyFavourite: React.FC = () => {
  const favoriteRecipes = [
    {
      id: 1,
      title: "Phở Bò",
      description: "Món phở bò truyền thống Việt Nam với nước dùng thơm ngon.",
      image: "https://picsum.photos/400/250?random=1",
      rating: 4.8,
      cookTime: 45,
    },
    {
      id: 2,
      title: "Bánh Mì Thịt Nướng",
      description: "Bánh mì giòn tan kẹp thịt nướng đậm đà hương vị.",
      image: "https://picsum.photos/400/250?random=2",
      rating: 4.6,
      cookTime: 20,
    },
    {
      id: 3,
      title: "Gỏi Cuốn Tôm Thịt",
      description: "Món ăn thanh mát, chấm kèm nước mắm pha chua ngọt.",
      image: "https://picsum.photos/400/250?random=3",
      rating: 4.7,
      cookTime: 15,
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Công Thức Yêu Thích</h2>

      {favoriteRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => alert(`Xóa ${recipe.title} khỏi yêu thích`)}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200"
                >
                  <Heart className="h-5 w-5 text-red-500 fill-current" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{recipe.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.cookTime} phút</span>
                  </div>
                </div>
              </div>
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
