import type React from "react"
import { Star } from "lucide-react"

interface Review {
  id: string
  recipeName: string
  rating: number
  comment: string
  date: string
}

const MyReviews: React.FC = () => {
  // Mock data
  const userReviews: Review[] = [
    {
      id: "1",
      recipeName: "Phở Bò",
      rating: 5,
      comment: "Hương vị tuyệt vời, nước dùng đậm đà và rất chuẩn vị!",
      date: "2024-05-12",
    },
    {
      id: "2",
      recipeName: "Bánh Mì Việt Nam",
      rating: 4,
      comment: "Rất ngon, giòn rụm nhưng hơi ít pate so với khẩu vị của mình.",
      date: "2024-06-01",
    },
    {
      id: "3",
      recipeName: "Gỏi Cuốn",
      rating: 5,
      comment: "Tươi mát, dễ ăn và lành mạnh. Ăn hoài không ngán.",
      date: "2024-06-15",
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh Giá Của Tôi</h2>

      {userReviews.length > 0 ? (
        <div className="space-y-4">
          {userReviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {review.recipeName}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">Chưa có đánh giá nào</p>
          <p className="text-gray-400">
            Hãy đánh giá các công thức bạn đã thử để xem chúng ở đây
          </p>
        </div>
      )}
    </div>
  )
}

export default MyReviews
