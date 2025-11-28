import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThumbsUp, Send, Edit2, Trash2, X, MessageCircle, Reply, MoreVertical, AlertCircle, EyeOff, Star, CheckCircle } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import {
    getCommentsByRecipeId,
    createComment,
    updateComment,
    deleteComment,
    updateCommentLikes,
    createReply,
    checkUserReview,
} from '../redux/slices/commentSlice';
import { toggleLike, getUserLikes } from '../redux/slices/likeSlice';
import { getRecipeById } from '../redux/slices/recipeSlice';
import toast from 'react-hot-toast';

interface CommentSectionProps {
    recipeId: string;
}

export default function CommentSection({ recipeId }: CommentSectionProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0); // Rating từ 0-5 (0 = chưa chọn)
    const [hoverRating, setHoverRating] = useState(0); // Hiển thị khi hover
    const [showConfirmExit, setShowConfirmExit] = useState(false);
    const [pendingExitAction, setPendingExitAction] = useState<null | (() => void)>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    // Kiểm tra có dữ liệu chưa lưu không
    const hasUnsavedReview = newComment.trim().length > 0 || rating > 0;

    // Xử lý khi người dùng cố gắng rời khỏi form đánh giá
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedReview) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedReview]);

    // THÊM CODE MỚI Ở ĐÂY - Xử lý nút Quay lại của trình duyệt
    useEffect(() => {
        if (!hasUnsavedReview) return;

        // Push một state giả vào history để chặn back
                const handleBackButton = () => {
                    if (hasUnsavedReview) {
                        // Push lại state để giữ người dùng ở trang hiện tại
                        window.history.pushState(null, '', window.location.pathname);
        
                        // Hiển thị confirm dialog
                        setShowConfirmExit(true);
                        setPendingExitAction(() => () => {
                            // Nếu xác nhận rời đi, cho phép back
                            window.history.back();
                        });
                    }
                };

        // Push một state null để có thể bắt popstate
        window.history.pushState(null, '', window.location.pathname);

        window.addEventListener('popstate', handleBackButton);

        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [hasUnsavedReview]);

    const handleConfirmExit = () => {
        setShowConfirmExit(false);
        setPendingExitAction(null);
        // Xóa nội dung đánh giá
        setNewComment('');
        setRating(0);
        // Nếu có hành động chờ, thực hiện nó
        if (pendingExitAction) pendingExitAction();
    };

    const handleCancelExit = () => {
        setShowConfirmExit(false);
        setPendingExitAction(null);
    };
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [replyToUser, setReplyToUser] = useState<string>(''); // Tên người được reply

    // Redux selectors
    const comments = useSelector((state: RootState) => state.comments.comments);
    const loading = useSelector((state: RootState) => state.comments.loading);
    const totalComments = useSelector((state: RootState) => state.comments.totalComments);
    const userHasReviewed = useSelector((state: RootState) => state.comments.userHasReviewed);
    const userRating = useSelector((state: RootState) => state.comments.userRating);
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const userProfile = useSelector((state: RootState) => state.user.profile);
    const likedComments = useSelector((state: RootState) => state.likes.likedComments);

    // Lấy avatar từ profile hoặc user
    const userAvatar = userProfile?.avatar || currentUser?.avatar;

    // Debug: Log liked comments
    // useEffect(() => {

    //     comments.forEach(c => {
    //         console.log(`  Comment ${c._id}: likes=${c.likes}, isLiked=${likedComments.includes(c._id)}`);
    //     });
    // }, [likedComments, comments]);

    // Load comments and user likes when component mounts
    useEffect(() => {
        if (recipeId) {
            dispatch(getCommentsByRecipeId(recipeId)).catch(err => {
                console.error('Failed to load comments:', err);
            });
        }
    }, [dispatch, recipeId]);

    // Check nếu user đã review recipe này chưa
    useEffect(() => {
        if (recipeId && currentUser) {
            dispatch(checkUserReview(recipeId)).catch(err => {
                console.warn('Failed to check user review:', err);
            });
        }
    }, [dispatch, recipeId, currentUser]);

    useEffect(() => {
        if (recipeId && currentUser) {
            // Load user likes - không block UI nếu fail
            dispatch(getUserLikes(recipeId)).catch(err => {
                console.warn('Failed to load user likes, continuing anyway:', err);
            });
        }
    }, [dispatch, recipeId, currentUser]);

    // Handle submit new comment
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;

        // Validate rating (phải chọn số sao từ 1-5)
        if (!rating || rating < 1 || rating > 5) {
            toast.error('Please select a rating (1-5 stars) for this recipe');
            return;
        }

        try {
            await dispatch(createComment({ recipeId, content: newComment, rating })).unwrap();
            setNewComment('');
            setRating(0); 

            // Reload recipe để cập nhật rating mới
            dispatch(getRecipeById(recipeId));
        } catch (error: any) {
            console.error('Failed to create comment:', error);
            if (error.message) {
                toast.error(error.message);
            }
        }
    };

    // Handle edit comment
    const handleEditComment = async (commentId: string) => {
        if (!editContent.trim()) return;

        try {
            await dispatch(updateComment({ commentId, content: editContent })).unwrap();
            setEditingId(null);
            setEditContent('');
        } catch (error) {
            console.error('Failed to update comment:', error);
        }
    };

    // Handle delete comment
    const handleDeleteComment = async (commentId: string) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await dispatch(deleteComment(commentId)).unwrap();
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    // Handle like/unlike comment
    const handleToggleLike = async (commentId: string) => {
        if (!currentUser) {
            toast.error('Please login to like comments');
            return;
        }

        // Tìm comment hiện tại để lấy số likes
        let currentComment = comments.find(c => c._id === commentId);
        if (!currentComment) {
            // Tìm trong replies
            for (const comment of comments) {
                if (comment.replies) {
                    const reply = comment.replies.find(r => r._id === commentId);
                    if (reply) {
                        currentComment = reply;
                        break;
                    }
                }
            }
        }

        const currentLikes = currentComment?.likes || 0;
        const isCurrentlyLiked = likedComments.includes(commentId);
        const newLikes = isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1;


        // Optimistic update: Update UI ngay lập tức
        dispatch(updateCommentLikes({ commentId, likes: newLikes }));

        try {
            const result = await dispatch(toggleLike(commentId)).unwrap();
           

            // Sync với giá trị chính xác từ server
            dispatch(updateCommentLikes({ commentId, likes: result.likes }));
        } catch (error: any) {
            console.error('❌ Failed to toggle like:', error);

            // Rollback optimistic update nếu lỗi
            dispatch(updateCommentLikes({ commentId, likes: currentLikes }));

            const errorMsg = error.message || error.response?.data?.message || 'Failed to like/unlike comment';
            toast.error(`Error: ${errorMsg}`);
        }
    };

    // Start editing
    const startEdit = (commentId: string, content: string) => {
        setEditingId(commentId);
        setEditContent(content);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setEditContent('');
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 7) {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } else if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    };

    // Start reply
    const startReply = (commentId: string, userName?: string) => {
        setReplyingTo(commentId);
        setReplyContent('');
        setReplyToUser(userName || '');
    };

    // Cancel reply
    const cancelReply = () => {
        setReplyingTo(null);
        setReplyContent('');
        setReplyToUser('');
    };

    // Submit reply
    const handleSubmitReply = async (parentCommentId: string) => {
        if (!replyContent.trim() || !currentUser) return;

        try {
            await dispatch(createReply({
                parentCommentId,
                content: replyContent,
                recipeId
            })).unwrap();
            cancelReply();
        } catch (error) {
            console.error('Failed to post reply:', error);
        }
    };

    // Toggle menu
    const toggleMenu = (commentId: string) => {
        setOpenMenuId(openMenuId === commentId ? null : commentId);
    };

    // Handle report
    const handleReport = (commentId: string) => {
        toast.success('Báo cáo comment: ' + commentId);
        setOpenMenuId(null);
    };

    // Handle hide
    const handleHide = (commentId: string) => {
        toast.success('Ẩn comment: ' + commentId);
        setOpenMenuId(null);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-8 sm:mt-10">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="h-6 w-6 text-orange-500" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Đánh giá <span className="text-gray-500 text-lg">({totalComments})</span>
                </h2>
            </div>

            {/* Add Comment Form */}
            {currentUser ? (
                userHasReviewed ? (
                    // User đã review rồi - hiển thị thông báo
                    <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold text-green-800 mb-2">
                                    Bạn đã đánh giá công thức này
                                </h3>
                                <p className="text-green-700 mb-3">
                                    Cảm ơn bạn đã phản hồi! Đánh giá của bạn giúp người khác khám phá các công thức tuyệt vời.
                                </p>
                                {userRating && (
                                    <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-lg inline-flex">
                                        <span className="text-sm font-medium text-gray-700">Đánh giá của bạn:</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-5 w-5 ${star <= userRating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800">
                                            ({userRating}/5)
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    // User chưa review - hiển thị form
                    <form
                        ref={formRef}
                        onSubmit={handleSubmitComment}
                        className="mb-8"
                    >
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                {userAvatar ? (
                                    <img
                                        src={userAvatar}
                                        alt={currentUser.username || 'User'}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                                        <span>{currentUser.username?.[0]?.toUpperCase() || 'U'}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow">
                                {/* Rating Stars */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Đánh giá của bạn <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    className={`h-8 w-8 transition-colors ${star <= (hoverRating || rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                        {rating > 0 && (
                                            <span className="ml-2 text-sm text-gray-600 self-center">
                                                {rating} {rating === 1 ? 'star' : 'stars'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Chia sẻ suy nghĩ của bạn về công thức này..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all"
                                    rows={3}
                                />
                                <div className="flex justify-end mt-2 gap-2">
                                
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim() || !rating || loading}
                                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                                    >
                                        <Send className="h-4 w      -4" />
                                        Đăng đánh giá
                                    </button>
                                </div>
                                {/* Hộp thoại xác nhận khi rời khỏi form đánh giá */}
                                {showConfirmExit && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                                            <h3 className="text-lg font-semibold mb-3 text-gray-800">Bạn có muốn tiếp tục đánh giá không?</h3>
                                            <p className="mb-5 text-gray-600">Nội dung đánh giá của bạn sẽ bị xóa nếu bạn rời khỏi. Bạn muốn tiếp tục đánh giá hay hủy bỏ?</p>
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                                                    onClick={handleCancelExit}
                                                >
                                                    Tiếp tục đánh giá
                                                </button>
                                                <button
                                                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
                                                    onClick={handleConfirmExit}
                                                >
                                                    Hủy bỏ đánh giá
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                )
            ) : (
                <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                    <p className="text-orange-700">
                        Vui lòng <a href="/login" className="font-semibold underline">đăng nhập</a> để để lại đánh giá
                    </p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {loading && comments.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-lg">Chưa có đánh giá nào</p>
                        <p className="text-gray-400 text-sm">Hãy là người đầu tiên chia sẻ suy nghĩ của bạn!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                            <div className="flex gap-3">
                                {/* User Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                                        {comment.userAvatar ? (
                                            <img
                                                src={comment.userAvatar}
                                                alt={`${comment.firstName} ${comment.lastName}`}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span>
                                                {comment.firstName?.[0]?.toUpperCase() || 'U'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Comment Content */}
                                <div className="flex-grow">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {comment.firstName} {comment.lastName}
                                                </h4>
                                                <p className="text-xs text-gray-500">
                                                    {formatDate(comment.createdAt)}
                                                </p>
                                                {/* Hiển thị rating nếu có */}
                                                {comment.ratingRecipe && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`h-4 w-4 ${star <= comment.ratingRecipe!
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'text-gray-300'
                                                                    }`}
                                                            />
                                                        ))}
                                                        <span className="text-xs text-gray-600 ml-1">
                                                            ({comment.ratingRecipe}/5)
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Edit/Delete buttons for own comments */}
                                            {currentUser?._id === comment.userId && (
                                                <div className="flex gap-2">
                                                    {editingId !== comment._id && (
                                                        <>
                                                            <button
                                                                onClick={() => startEdit(comment._id, comment.content)}
                                                                className="text-gray-400 hover:text-orange-500 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteComment(comment._id)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Edit Mode */}
                                        {editingId === comment._id ? (
                                            <div>
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                                    rows={3}
                                                />
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={() => handleEditComment(comment._id)}
                                                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                                    >
                                                        <X className="h-4 w-4" />
                                                        Hủy
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                                        )}
                                    </div>

                                    {/* Action Buttons: Like, Reply, Menu */}
                                    <div className="flex items-center gap-6 mt-3 ml-2">
                                        {/* Like Button (YouTube style) */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    handleToggleLike(comment._id);
                                                }}
                                                disabled={!currentUser}
                                                className={`p-1.5 rounded-full transition-all ${likedComments.includes(comment._id)
                                                    ? 'text-blue-600 hover:bg-blue-50'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                    } ${!currentUser ? 'cursor-not-allowed opacity-50' : ''}`}
                                                title={likedComments.includes(comment._id) ? 'Unlike' : 'Like'}
                                            >
                                                <ThumbsUp
                                                    className={`h-4 w-4 transition-all ${likedComments.includes(comment._id) ? 'fill-blue-600' : ''
                                                        }`}
                                                />
                                            </button>
                                            {(() => {
                                                const likes = comment.likes || 0;
                                                const shouldShow = likes > 0;
                                                return shouldShow ? (
                                                    <span className={`text-sm font-medium ${likedComments.includes(comment._id) ? 'text-blue-600' : 'text-gray-600'}`}>
                                                        {likes}
                                                    </span>
                                                ) : null;
                                            })()}
                                        </div>

                                        {/* Reply Button */}
                                        <button
                                            onClick={() => startReply(comment._id)}
                                            disabled={!currentUser}
                                            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Reply className="h-4 w-4" />
                                            <span>Trả lời</span>
                                        </button>

                                        {/* More Menu */}
                                        <div className="relative">
                                            <button
                                                onClick={() => toggleMenu(comment._id)}
                                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {openMenuId === comment._id && (
                                                <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[180px]">
                                                    <button
                                                        onClick={() => handleHide(comment._id)}
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <EyeOff className="h-4 w-4" />
                                                        Tiết lộ nội dung
                                                    </button>
                                                    <button
                                                        onClick={() => handleReport(comment._id)}
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <AlertCircle className="h-4 w-4" />
                                                        Báo xấu
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Reply Form */}
                                    {replyingTo === comment._id && !replyToUser && (
                                        <div className="mt-4 ml-2 pl-4 border-l-2 border-orange-200">
                                            <div className="text-xs text-gray-500 mb-1">
                                                Trả lời <span className="font-semibold text-orange-600">@{comment.firstName} {comment.lastName}</span>
                                            </div>
                                            <textarea
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder={`Trả lời ${comment.firstName}...`}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
                                                rows={2}
                                                autoFocus
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={cancelReply}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    onClick={() => handleSubmitReply(comment._id)}
                                                    disabled={!replyContent.trim()}
                                                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Trả lời
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Replies List */}
                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="mt-4 ml-2 pl-4 border-l-2 border-gray-200 space-y-4">
                                            {comment.replies.map((reply) => (
                                                <div key={reply._id} className="flex gap-3">
                                                    {/* Reply User Avatar */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                                                            {reply.userAvatar ? (
                                                                <img
                                                                    src={reply.userAvatar}
                                                                    alt={`${reply.firstName} ${reply.lastName}`}
                                                                    className="w-full h-full rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <span>
                                                                    {reply.firstName?.[0]?.toUpperCase() || 'U'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Reply Content */}
                                                    <div className="flex-grow">
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <div>
                                                                    <h5 className="font-semibold text-gray-900 text-sm">
                                                                        {reply.firstName} {reply.lastName}
                                                                    </h5>
                                                                    <p className="text-xs text-gray-500">
                                                                        {formatDate(reply.createdAt)}
                                                                    </p>
                                                                </div>

                                                                {/* Edit/Delete for own replies */}
                                                                {currentUser?._id === reply.userId && (
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => startEdit(reply._id, reply.content)}
                                                                            className="text-gray-400 hover:text-orange-500 transition-colors"
                                                                            title="Edit"
                                                                        >
                                                                            <Edit2 className="h-3 w-3" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteComment(reply._id)}
                                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                                            title="Delete"
                                                                        >
                                                                            <Trash2 className="h-3 w-3" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Edit Mode for Reply */}
                                                            {editingId === reply._id ? (
                                                                <div>
                                                                    <textarea
                                                                        value={editContent}
                                                                        onChange={(e) => setEditContent(e.target.value)}
                                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
                                                                        rows={2}
                                                                    />
                                                                    <div className="flex gap-2 mt-2">
                                                                        <button
                                                                            onClick={() => handleEditComment(reply._id)}
                                                                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                                                                        >
                                                                            Save
                                                                        </button>
                                                                        <button
                                                                            onClick={cancelEdit}
                                                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
                                                            )}
                                                        </div>

                                                        {/* Reply Actions */}
                                                        <div className="flex items-center gap-4 mt-2 ml-2">
                                                            {/* Like Button (YouTube style) */}
                                                            <div className="flex items-center gap-1.5">
                                                                <button
                                                                    onClick={() => handleToggleLike(reply._id)}
                                                                    disabled={!currentUser}
                                                                    className={`p-1 rounded-full transition-all ${likedComments.includes(reply._id)
                                                                            ? 'text-blue-600 hover:bg-blue-50'
                                                                            : 'text-gray-600 hover:bg-gray-100'
                                                                        } ${!currentUser ? 'cursor-not-allowed opacity-50' : ''}`}
                                                                    title={likedComments.includes(reply._id) ? 'Unlike' : 'Like'}
                                                                >
                                                                    <ThumbsUp
                                                                        className={`h-3 w-3 transition-all ${likedComments.includes(reply._id) ? 'fill-blue-600' : ''
                                                                            }`}
                                                                    />
                                                                </button>
                                                                {reply.likes > 0 && (
                                                                    <span className={`text-xs font-medium ${likedComments.includes(reply._id) ? 'text-blue-600' : 'text-gray-600'}`}>
                                                                        {reply.likes}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Reply to Reply Button */}
                                                            <button
                                                                onClick={() => startReply(comment._id, `${reply.firstName} ${reply.lastName}`)}
                                                                disabled={!currentUser}
                                                                className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <Reply className="h-3 w-3" />
                                                                <span>Trả lời</span>
                                                            </button>
                                                        </div>

                                                        {/* Reply Form for nested reply */}
                                                        {replyingTo === comment._id && replyToUser === `${reply.firstName} ${reply.lastName}` && (
                                                            <div className="mt-3 ml-2">
                                                                <div className="text-xs text-gray-500 mb-1">
                                                                    Trả lời <span className="font-semibold text-orange-600">@{reply.firstName} {reply.lastName}</span>
                                                                </div>
                                                                <textarea
                                                                    value={replyContent}
                                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                                    placeholder={`Trả lời ${reply.firstName}...`}
                                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
                                                                    rows={2}
                                                                    autoFocus
                                                                />
                                                                <div className="flex gap-2 mt-2">
                                                                    <button
                                                                        onClick={cancelReply}
                                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                                                                    >
                                                                        Hủy
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleSubmitReply(comment._id)}
                                                                        disabled={!replyContent.trim()}
                                                                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                                                                    >
                                                                        Trả lời
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
