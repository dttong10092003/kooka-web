import type React from "react"
import { useEffect } from "react"
import { Star, Trash2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { fetchUserReviews } from "../redux/slices/commentSlice"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../utils/axiosInstance"

const MyReviews: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { userReviews, loading, error } = useAppSelector((state) => state.comments)

  useEffect(() => {
    console.log('🔍 Loading user reviews...')
    dispatch(fetchUserReviews())
  }, [dispatch])

  useEffect(() => {
    console.log('📊 User reviews state:', userReviews)
  }, [userReviews])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Hôm nay"
    if (days === 1) return "Hôm qua"
    if (days < 7) return `${days} ngày trước`
    if (days < 30) return `${Math.floor(days / 7)} tuần trước`
    if (days < 365) return `${Math.floor(days / 30)} tháng trước`
    return `${Math.floor(days / 365)} năm trước`
  }

  // Handle click on review to navigate to recipe
  const handleRecipePress = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`)
  }

  // Handle delete review
  const handleDeleteReview = async (commentId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      return
    }

    try {
      await axiosInstance.delete(`/comments/${commentId}`)
      // Reload reviews after delete
      dispatch(fetchUserReviews())
      alert("Đã xóa đánh giá thành công!")
    } catch (error) {
      console.error("Error deleting review:", error)
      alert("Không thể xóa đánh giá. Vui lòng thử lại!")
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh Giá Của Tôi</h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh Giá Của Tôi</h2>
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh Giá Của Tôi</h2>

      {userReviews.length > 0 ? (
        <div className="space-y-4">
          {userReviews
            .filter((review) => review.recipe) // Chỉ hiển thị review có recipe
            .map((review) => (
              <div
                key={review._id}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                {/* Recipe Info - Clickable */}
                <div
                  onClick={() => review.recipe && handleRecipePress(review.recipe._id)}
                  className="flex items-center gap-4 p-4 border-b border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={review.recipe!.image}
                    alt={review.recipe!.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">
                      {review.recipe!.name}
                    </h3>
                    <p className="text-gray-500 text-xs">Nhấn để xem chi tiết</p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="p-4">
                  {/* Rating & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              review.ratingRecipe && i < review.ratingRecipe
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {review.ratingRecipe}.0
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {/* Comment Text */}
                  <div className="bg-gray-50 p-3 rounded-xl mb-3">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.content}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Xóa đánh giá</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Star className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-semibold mb-2">Chưa có đánh giá</p>
          <p className="text-gray-400 text-sm px-8">
            Hãy thử các món ăn và để lại đánh giá của bạn!
          </p>
        </div>
      )}
    </div>
  )
}

export default MyReviews
