import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from '../redux/slices/notificationSlice';
import { useLanguage } from '../contexts/LanguageContext';

interface NotificationDropdownProps {
    onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'RECIPE' | 'COMMUNITY'>('RECIPE');

    const {
        recipeNotifications,
        communityNotifications,
        recipePagination,
        communityPagination,
        recipeUnreadCount,
        communityUnreadCount
    } = useAppSelector((state) => state.notifications);

    const currentNotifications = activeTab === 'RECIPE' ? recipeNotifications : communityNotifications;
    const currentPagination = activeTab === 'RECIPE' ? recipePagination : communityPagination;
    const currentUnreadCount = activeTab === 'RECIPE' ? recipeUnreadCount : communityUnreadCount;

    // Load notifications when tab changes
    useEffect(() => {
        console.log(`🔔 Fetching ${activeTab} notifications...`);
        dispatch(fetchNotifications({ category: activeTab, page: 1 }))
            .unwrap()
            .then((response) => {
                console.log(`✅ Notifications loaded:`, response);
            })
            .catch((error) => {
                console.log('❌ Notification API error:', error);
            });
    }, [dispatch, activeTab]);

    const handleNotificationClick = async (notification: any) => {
        // Mark as read if not read yet
        if (!notification.isRead) {
            await dispatch(markAsRead(notification._id));
        }

        // Navigate to the action URL
        navigate(notification.actionUrl);
        onClose();
    };

    const handleMarkAllRead = () => {
        console.log(`📝 Marking all ${activeTab} as read...`);
        dispatch(markAllAsRead(activeTab));
    };

    const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
        e.stopPropagation();
        await dispatch(deleteNotification(notificationId));
    };

    const handleMarkRead = async (e: React.MouseEvent, notificationId: string) => {
        e.stopPropagation();
        await dispatch(markAsRead(notificationId));
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            // Tab Công thức
            case 'RECIPE_NEW_VIDEO':
                return ''; // Video mới
            case 'RECIPE_INGREDIENTS':
                return ''; // Đổi nguyên liệu/mẹo hay
            case 'RECIPE_UPDATE':
                return ''; // Cập nhật chung
            
            // Tab Cộng đồng
            case 'REVIEW_LIKED':
            case 'COMMENT_LIKED':
                return '❤️'; // Like
            case 'REVIEW_REPLIED':
            case 'COMMENT_REPLIED':
                return ''; // Reply
            
            default:
                return '';
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (language === 'vi') {
            if (minutes < 1) return 'Vừa xong';
            if (minutes < 60) return `${minutes} phút trước`;
            if (hours < 24) return `${hours} giờ trước`;
            if (days < 7) return `${days} ngày trước`;
        } else {
            if (minutes < 1) return 'Just now';
            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            if (days < 7) return `${days}d ago`;
        }
        return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US');
    };

    return (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {language === 'vi' ? 'Thông báo' : 'Notifications'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('RECIPE')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === 'RECIPE'
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {language === 'vi' ? 'Công thức' : 'Recipes'}
                        {recipeUnreadCount > 0 && (
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                activeTab === 'RECIPE' 
                                    ? 'bg-white text-orange-600' 
                                    : 'bg-orange-100 text-orange-700'
                            }`}>
                                {recipeUnreadCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('COMMUNITY')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === 'COMMUNITY'
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {language === 'vi' ? 'Cộng đồng' : 'Community'}
                        {communityUnreadCount > 0 && (
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                activeTab === 'COMMUNITY' 
                                    ? 'bg-white text-orange-600' 
                                    : 'bg-orange-100 text-orange-700'
                            }`}>
                                {communityUnreadCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Mark all as read */}
                {currentUnreadCount > 0 && (
                    <div className="mt-3 flex justify-end">
                        <button
                            onClick={handleMarkAllRead}
                            className="p-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title={language === 'vi' ? 'Đánh dấu tất cả đã đọc' : 'Mark all as read'}
                        >
                            <Check className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto max-h-[500px]">
                {currentNotifications.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center">
                        <div className="text-7xl sm:text-8xl mb-4 animate-bounce">
                            {activeTab === 'RECIPE' ? '🍳' : '�'}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                            {language === 'vi' 
                                ? (activeTab === 'RECIPE' 
                                    ? 'Chưa có thông báo công thức' 
                                    : 'Chưa có thông báo cộng đồng')
                                : (activeTab === 'RECIPE'
                                    ? 'No recipe notifications'
                                    : 'No community notifications')
                            }
                        </h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            {language === 'vi'
                                ? (activeTab === 'RECIPE'
                                    ? 'Khi món ăn yêu thích của bạn có cập nhật (video mới, đổi nguyên liệu), thông báo sẽ hiển thị tại đây'
                                    : 'Khi có người like hoặc reply review/comment của bạn, thông báo sẽ hiển thị tại đây')
                                : (activeTab === 'RECIPE'
                                    ? 'When your favorite recipes are updated (new video, ingredient changes), notifications will appear here'
                                    : 'When someone likes or replies to your review/comment, notifications will appear here')
                            }
                        </p>
                    </div>
                ) : (
                    <div>
                        {currentNotifications.map((notif) => (
                            <div
                                key={notif._id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                    !notif.isRead ? 'bg-blue-50' : ''
                                }`}
                            >
                                <div className="flex gap-3">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 text-2xl">
                                        {getNotificationIcon(notif.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-2">
                                            {/* User Avatar (for community notifications) */}
                                            {notif.relatedUser && (
                                                <img
                                                    src={notif.relatedUser.userAvatar}
                                                    alt={notif.relatedUser.userName}
                                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                />
                                            )}

                                            {/* Text */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                                    {notif.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {formatTime(notif.createdAt)}
                                                </p>
                                            </div>

                                            {/* Recipe Image */}
                                            {notif.relatedRecipe && (
                                                <img
                                                    src={notif.relatedRecipe.recipeImage}
                                                    alt={notif.relatedRecipe.recipeName}
                                                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                        {!notif.isRead && (
                                            <button
                                                onClick={(e) => handleMarkRead(e, notif._id)}
                                                className="p-1 hover:bg-green-100 rounded transition-colors"
                                                title={language === 'vi' ? 'Đánh dấu đã đọc' : 'Mark as read'}
                                            >
                                                <Check className="h-4 w-4 text-green-600" />
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm(
                                                    language === 'vi' 
                                                        ? 'Bạn có chắc muốn xóa thông báo này?' 
                                                        : 'Are you sure you want to delete this notification?'
                                                )) {
                                                    handleDelete(e, notif._id);
                                                }
                                            }}
                                            className="p-1 hover:bg-red-100 rounded transition-colors"
                                            title={language === 'vi' ? 'Xóa' : 'Delete'}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Load More (if needed) */}
            {currentPagination.page < currentPagination.totalPages && (
                <div className="p-3 border-t border-gray-200">
                    <button
                        onClick={() => dispatch(fetchNotifications({ 
                            category: activeTab, 
                            page: currentPagination.page + 1 
                        }))}
                        className="w-full py-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
                    >
                        {language === 'vi' ? 'Xem thêm' : 'Load more'}
                    </button>
                </div>
            )}
        </div>
    );
};
