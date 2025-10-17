import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThumbsUp, Send, Edit2, Trash2, X, MessageCircle, Reply, MoreVertical, AlertCircle, EyeOff } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import {
    getCommentsByRecipeId,
    createComment,
    updateComment,
    deleteComment,
    updateCommentLikes,
    createReply,
} from '../redux/slices/commentSlice';
import { toggleLike, getUserLikes } from '../redux/slices/likeSlice';

interface CommentSectionProps {
    recipeId: string;
}

export default function CommentSection({ recipeId }: CommentSectionProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [newComment, setNewComment] = useState('');
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
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const userProfile = useSelector((state: RootState) => state.user.profile);
    const likedComments = useSelector((state: RootState) => state.likes.likedComments);

    // Lấy avatar từ profile hoặc user
    const userAvatar = userProfile?.avatar || currentUser?.avatar;

    // Debug: Log liked comments
    useEffect(() => {
        console.log('🔍 Liked Comments Array:', likedComments);
        console.log('🔍 Total comments:', comments.length);
        comments.forEach(c => {
            console.log(`  Comment ${c._id}: likes=${c.likes}, isLiked=${likedComments.includes(c._id)}`);
        });
    }, [likedComments, comments]);

    // Load comments and user likes when component mounts
    useEffect(() => {
        if (recipeId) {
            dispatch(getCommentsByRecipeId(recipeId)).catch(err => {
                console.error('Failed to load comments:', err);
            });
        }
    }, [dispatch, recipeId]);

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

        try {
            await dispatch(createComment({ recipeId, content: newComment })).unwrap();
            setNewComment('');
        } catch (error) {
            console.error('Failed to create comment:', error);
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
            alert('Please login to like comments');
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

        console.log('🔵 Toggle like for comment:', commentId);
        console.log('🔵 Current comment:', currentComment);
        console.log('🔵 Current likes:', currentLikes);
        console.log('🔵 Is currently liked:', isCurrentlyLiked);
        console.log('🔵 New likes will be:', newLikes);
        console.log('🔵 Comment object before update:', JSON.stringify(currentComment));

        // Optimistic update: Update UI ngay lập tức
        dispatch(updateCommentLikes({ commentId, likes: newLikes }));
        console.log('🔵 Dispatched updateCommentLikes with likes:', newLikes);

        try {
            const result = await dispatch(toggleLike(commentId)).unwrap();
            console.log('✅ Toggle SUCCESS:', result);
            console.log('✅ Backend returned likes:', result.likes);
            
            // Sync với giá trị chính xác từ server
            dispatch(updateCommentLikes({ commentId, likes: result.likes }));
            console.log('✅ Synced with server likes:', result.likes);
        } catch (error: any) {
            console.error('❌ Failed to toggle like:', error);
            
            // Rollback optimistic update nếu lỗi
            dispatch(updateCommentLikes({ commentId, likes: currentLikes }));
            
            const errorMsg = error.message || error.response?.data?.message || 'Failed to like/unlike comment';
            alert(`Error: ${errorMsg}`);
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
        alert('Báo cáo comment: ' + commentId);
        setOpenMenuId(null);
    };

    // Handle hide
    const handleHide = (commentId: string) => {
        alert('Ẩn comment: ' + commentId);
        setOpenMenuId(null);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-8 sm:mt-10">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="h-6 w-6 text-orange-500" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Comments <span className="text-gray-500 text-lg">({totalComments})</span>
                </h2>
            </div>

            {/* Add Comment Form */}
            {currentUser ? (
                <form onSubmit={handleSubmitComment} className="mb-8">
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
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts about this recipe..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all"
                                rows={3}
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={!newComment.trim() || loading}
                                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                                >
                                    <Send className="h-4 w-4" />
                                    Post Comment
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                    <p className="text-orange-700">
                        Please <a href="/login" className="font-semibold underline">login</a> to leave a comment
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
                        <p className="text-gray-500 text-lg">No comments yet</p>
                        <p className="text-gray-400 text-sm">Be the first to share your thoughts!</p>
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
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                                    >
                                                        <X className="h-4 w-4" />
                                                        Cancel
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
                                                    console.log('🎯 BEFORE CLICK - comment.likes:', comment.likes);
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
                                                console.log(`🎯 RENDER comment ${comment._id}: likes=${comment.likes} (${typeof comment.likes}), normalized=${likes}, shouldShow=${shouldShow}`);
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
                                            <span>Reply</span>
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
                                                Replying to <span className="font-semibold text-orange-600">@{comment.firstName} {comment.lastName}</span>
                                            </div>
                                            <textarea
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder={`Reply to ${comment.firstName}...`}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
                                                rows={2}
                                                autoFocus
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={cancelReply}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleSubmitReply(comment._id)}
                                                    disabled={!replyContent.trim()}
                                                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Reply
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
                                                                    className={`p-1 rounded-full transition-all ${
                                                                        likedComments.includes(reply._id)
                                                                            ? 'text-blue-600 hover:bg-blue-50'
                                                                            : 'text-gray-600 hover:bg-gray-100'
                                                                    } ${!currentUser ? 'cursor-not-allowed opacity-50' : ''}`}
                                                                    title={likedComments.includes(reply._id) ? 'Unlike' : 'Like'}
                                                                >
                                                                    <ThumbsUp
                                                                        className={`h-3 w-3 transition-all ${
                                                                            likedComments.includes(reply._id) ? 'fill-blue-600' : ''
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
                                                                <span>Reply</span>
                                                            </button>
                                                        </div>

                                                        {/* Reply Form for nested reply */}
                                                        {replyingTo === comment._id && replyToUser === `${reply.firstName} ${reply.lastName}` && (
                                                            <div className="mt-3 ml-2">
                                                                <div className="text-xs text-gray-500 mb-1">
                                                                    Replying to <span className="font-semibold text-orange-600">@{reply.firstName} {reply.lastName}</span>
                                                                </div>
                                                                <textarea
                                                                    value={replyContent}
                                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                                    placeholder={`Reply to ${reply.firstName}...`}
                                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
                                                                    rows={2}
                                                                    autoFocus
                                                                />
                                                                <div className="flex gap-2 mt-2">
                                                                    <button
                                                                        onClick={cancelReply}
                                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleSubmitReply(comment._id)}
                                                                        disabled={!replyContent.trim()}
                                                                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                                                                    >
                                                                        Reply
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
