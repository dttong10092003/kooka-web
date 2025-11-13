import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// ==== Types ====
export interface RelatedRecipe {
    recipeId: string;
    recipeName: string;
    recipeImage: string;
}

export interface RelatedUser {
    userId: string;
    userName: string;
    userAvatar: string;
}

export interface RelatedComment {
    commentId: string;
    content: string;
}

export interface Notification {
    _id: string;
    userId: string;
    type: string;
    category: 'RECIPE' | 'COMMUNITY';
    title: string;
    message: string;
    relatedRecipe?: RelatedRecipe;
    relatedUser?: RelatedUser;
    relatedComment?: RelatedComment;
    actionUrl: string;
    isRead: boolean;
    createdAt: string;
}

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface NotificationState {
    recipeNotifications: Notification[];
    communityNotifications: Notification[];
    recipePagination: PaginationInfo;
    communityPagination: PaginationInfo;
    recipeUnreadCount: number;
    communityUnreadCount: number;
    totalUnreadCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    recipeNotifications: [],
    communityNotifications: [],
    recipePagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    communityPagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    recipeUnreadCount: 0,
    communityUnreadCount: 0,
    totalUnreadCount: 0,
    loading: false,
    error: null,
};

// ==== Async Thunks ====

// Fetch notifications by category
export const fetchNotifications = createAsyncThunk(
    "notifications/fetchByCategory",
    async ({ category, page = 1, limit = 20, isRead }: { 
        category?: 'RECIPE' | 'COMMUNITY'; 
        page?: number; 
        limit?: number;
        isRead?: boolean;
    }) => {
        const params: any = { page, limit };
        if (category) params.category = category;
        if (isRead !== undefined) params.isRead = isRead;

        console.log(`🌐 API Call: GET /notifications`, params);
        const res = await axiosInstance.get("/notifications", { params });
        console.log('📦 API Response:', res.data);
        console.log('📦 Notifications array:', res.data.data || res.data);
        return {
            category,
            // Backend trả về { data: [...] } nên lấy res.data.data
            // Nếu không có .data thì lấy res.data luôn
            data: res.data.data || res.data
        };
    }
);

// Fetch unread count
export const fetchUnreadCount = createAsyncThunk(
    "notifications/fetchUnreadCount",
    async (category?: 'RECIPE' | 'COMMUNITY') => {
        const params = category ? { category } : {};
        console.log(`🌐 API Call: GET /notifications/unread-count`, params);
        const res = await axiosInstance.get("/notifications/unread-count", { params });
        console.log('📦 Unread Count Response:', res.data);
        // Backend có thể trả về { data: { unreadCount: X } } hoặc { unreadCount: X }
        const unreadCount = res.data.data?.unreadCount ?? res.data.unreadCount ?? 0;
        return {
            category,
            count: unreadCount
        };
    }
);

// Mark as read
export const markAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (notificationId: string) => {
        await axiosInstance.put(`/notifications/${notificationId}/read`);
        return notificationId;
    }
);

// Mark all as read
export const markAllAsRead = createAsyncThunk(
    "notifications/markAllAsRead",
    async (category?: 'RECIPE' | 'COMMUNITY') => {
        const params = category ? { category } : {};
        await axiosInstance.put("/notifications/mark-all-read", {}, { params });
        return category;
    }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
    "notifications/delete",
    async (notificationId: string) => {
        await axiosInstance.delete(`/notifications/${notificationId}`);
        return notificationId;
    }
);

// ==== Slice ====
const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        // Add new notification (for real-time updates)
        addNotification: (state, action: PayloadAction<Notification>) => {
            const notification = action.payload;
            if (notification.category === 'RECIPE') {
                state.recipeNotifications.unshift(notification);
                if (!notification.isRead) {
                    state.recipeUnreadCount += 1;
                    state.totalUnreadCount += 1;
                }
            } else {
                state.communityNotifications.unshift(notification);
                if (!notification.isRead) {
                    state.communityUnreadCount += 1;
                    state.totalUnreadCount += 1;
                }
            }
        },
        // Clear all notifications
        clearNotifications: (state) => {
            state.recipeNotifications = [];
            state.communityNotifications = [];
            state.recipeUnreadCount = 0;
            state.communityUnreadCount = 0;
            state.totalUnreadCount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                const { category, data } = action.payload;
                const { notifications, pagination, unreadCount } = data;

                if (!category || category === 'RECIPE') {
                    if (pagination.page === 1) {
                        state.recipeNotifications = notifications;
                    } else {
                        state.recipeNotifications = [...state.recipeNotifications, ...notifications];
                    }
                    state.recipePagination = pagination;
                    state.recipeUnreadCount = unreadCount;
                }
                
                if (!category || category === 'COMMUNITY') {
                    if (pagination.page === 1) {
                        state.communityNotifications = notifications;
                    } else {
                        state.communityNotifications = [...state.communityNotifications, ...notifications];
                    }
                    state.communityPagination = pagination;
                    state.communityUnreadCount = unreadCount;
                }

                state.totalUnreadCount = state.recipeUnreadCount + state.communityUnreadCount;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch notifications";
            })

            // Fetch unread count
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                const { category, count } = action.payload;
                
                if (!category) {
                    state.totalUnreadCount = count;
                } else if (category === 'RECIPE') {
                    state.recipeUnreadCount = count;
                } else {
                    state.communityUnreadCount = count;
                }
                
                if (category) {
                    state.totalUnreadCount = state.recipeUnreadCount + state.communityUnreadCount;
                }
            })

            // Mark as read
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notificationId = action.payload;
                
                // Update in recipe notifications
                const recipeIndex = state.recipeNotifications.findIndex(n => n._id === notificationId);
                if (recipeIndex !== -1 && !state.recipeNotifications[recipeIndex].isRead) {
                    state.recipeNotifications[recipeIndex].isRead = true;
                    state.recipeUnreadCount = Math.max(0, state.recipeUnreadCount - 1);
                }

                // Update in community notifications
                const communityIndex = state.communityNotifications.findIndex(n => n._id === notificationId);
                if (communityIndex !== -1 && !state.communityNotifications[communityIndex].isRead) {
                    state.communityNotifications[communityIndex].isRead = true;
                    state.communityUnreadCount = Math.max(0, state.communityUnreadCount - 1);
                }

                state.totalUnreadCount = state.recipeUnreadCount + state.communityUnreadCount;
            })

            // Mark all as read
            .addCase(markAllAsRead.fulfilled, (state, action) => {
                const category = action.payload;

                if (!category || category === 'RECIPE') {
                    state.recipeNotifications = state.recipeNotifications.map(n => ({ ...n, isRead: true }));
                    state.recipeUnreadCount = 0;
                }

                if (!category || category === 'COMMUNITY') {
                    state.communityNotifications = state.communityNotifications.map(n => ({ ...n, isRead: true }));
                    state.communityUnreadCount = 0;
                }

                state.totalUnreadCount = state.recipeUnreadCount + state.communityUnreadCount;
            })

            // Delete notification
            .addCase(deleteNotification.fulfilled, (state, action) => {
                const notificationId = action.payload;

                // Remove from recipe notifications
                const recipeNotif = state.recipeNotifications.find(n => n._id === notificationId);
                if (recipeNotif) {
                    state.recipeNotifications = state.recipeNotifications.filter(n => n._id !== notificationId);
                    if (!recipeNotif.isRead) {
                        state.recipeUnreadCount = Math.max(0, state.recipeUnreadCount - 1);
                    }
                }

                // Remove from community notifications
                const communityNotif = state.communityNotifications.find(n => n._id === notificationId);
                if (communityNotif) {
                    state.communityNotifications = state.communityNotifications.filter(n => n._id !== notificationId);
                    if (!communityNotif.isRead) {
                        state.communityUnreadCount = Math.max(0, state.communityUnreadCount - 1);
                    }
                }

                state.totalUnreadCount = state.recipeUnreadCount + state.communityUnreadCount;
            });
    },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
