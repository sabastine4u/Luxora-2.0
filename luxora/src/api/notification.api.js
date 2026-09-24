import http from './http';

export const notificationApi = {
  listNotifications: (params = {}) => http.get('/notifications', { params }),
  getUnreadCount: () => http.get('/notifications/unread-count'),
  markNotificationRead: (notificationId) =>
    http.patch(`/notifications/${notificationId}/read`),
  markAllNotificationsRead: () => http.patch('/notifications/read-all'),
  archiveNotification: (notificationId) =>
    http.patch(`/notifications/${notificationId}/archive`),
};
