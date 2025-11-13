import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchUnreadCount } from '../redux/slices/notificationSlice';

interface NotificationBadgeProps {
    onClick?: () => void;
    className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
    onClick,
    className = ''
}) => {
    const dispatch = useAppDispatch();
    const { totalUnreadCount } = useAppSelector((state) => state.notifications);
    const { user } = useAppSelector((state) => state.auth);

    // Fetch unread count when component mounts and every 30 seconds
    useEffect(() => {
        if (user) {
            dispatch(fetchUnreadCount())
                .catch((error) => {
                    console.log('Notification API not ready:', error);
                });

            const interval = setInterval(() => {
                dispatch(fetchUnreadCount())
                    .catch((error) => {
                        console.log('Notification API not ready:', error);
                    });
            }, 30000); // 30 seconds

            return () => clearInterval(interval);
        }
    }, [dispatch, user]);

    return (
        <button 
            className={`relative p-2 hover:bg-gray-100 rounded-full transition-colors ${className}`}
            onClick={onClick}
            aria-label="Notifications"
        >
            <Bell className="h-6 w-6 text-gray-700" />
            {totalUnreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full min-w-[20px]">
                    {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                </span>
            )}
        </button>
    );
};
