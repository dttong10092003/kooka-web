import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Send, Edit2, Trash2, X, MessageCircle } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import {
    getCommentsByRecipeId,
    createComment,
    updateComment,
    deleteComment,
    updateCommentLikes,
} from '../redux/slices/commentSlice';
import { likeComment, unlikeComment, getUserLikes } from '../redux/slices/likeSlice';

interface CommentSectionProps {
    recipeId: string;
}

export default function CommentSection({ recipeId }: CommentSectionProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [newComment, setNewComment] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    // Redux selectors
    const comments = useSelector((state: RootState) => state.comments.comments);
    const loading = useSelector((state: RootState) => state.comments.loading);
    const totalComments = useSelector((state: RootState) => state.comments.totalComments);
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const likedComments = useSelector((state: RootState) => state.likes.likedComments);

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

        const isLiked = likedComments.has(commentId);

        try {
            if (isLiked) {
                const result = await dispatch(unlikeComment(commentId)).unwrap();
                dispatch(updateCommentLikes({ commentId, likes: result.likes }));
            } else {
                const result = await dispatch(likeComment(commentId)).unwrap();
                dispatch(updateCommentLikes({ commentId, likes: result.likes }));
            }
        } catch (error) {
            console.error('Failed to toggle like:', error);
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
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                                {currentUser.avatar ? (
                                    <img
                                        src={currentUser.avatar}
                                        alt="User"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span>{currentUser.username?.[0]?.toUpperCase() || 'U'}</span>
                                )}
                            </div>
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
                                        {comment.userId.avatar ? (
                                            <img
                                                src={comment.userId.avatar}
                                                alt={`${comment.userId.firstName} ${comment.userId.lastName}`}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span>
                                                {comment.userId.firstName?.[0]?.toUpperCase() || 'U'}
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
                                                    {comment.userId.firstName} {comment.userId.lastName}
                                                </h4>
                                                <p className="text-xs text-gray-500">
                                                    {formatDate(comment.createdAt)}
                                                </p>
                                            </div>

                                            {/* Edit/Delete buttons for own comments */}
                                            {currentUser?._id === comment.userId._id && (
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

                                    {/* Like Button */}
                                    <div className="flex items-center gap-4 mt-2 ml-2">
                                        <button
                                            onClick={() => handleToggleLike(comment._id)}
                                            disabled={!currentUser}
                                            className={`flex items-center gap-1.5 text-sm font-medium transition-all ${
                                                likedComments.has(comment._id)
                                                    ? 'text-red-500'
                                                    : 'text-gray-500 hover:text-red-500'
                                            } ${!currentUser ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            <Heart
                                                className={`h-4 w-4 transition-all ${
                                                    likedComments.has(comment._id) ? 'fill-red-500' : ''
                                                }`}
                                            />
                                            <span>{comment.likes}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
