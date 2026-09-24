import { io, type Socket } from 'socket.io-client';
import { getToken } from '../api/token';

type NotificationHandler = (payload: Record<string, unknown>) => void;
type MessageHandler = (payload: Record<string, unknown>) => void;
type ConnectionErrorHandler = (error: Error) => void;

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const socketOrigin = apiBaseUrl.replace(/\/api\/v1\/?$/, '');

let socket: Socket | null = null;

export const socketService = {
  connect() {
    const token = getToken();
    if (!token) return null;

    if (socket?.connected || socket?.active) return socket;

    socket = io(socketOrigin, {
      auth: { token },
    });
    return socket;
  },

  disconnect() {
    socket?.disconnect();
    socket = null;
  },

  onNotification(handler: NotificationHandler) {
    const activeSocket = this.connect();
    activeSocket?.on('notification:new', handler);
    return () => activeSocket?.off('notification:new', handler);
  },

  onMessage(handler: MessageHandler) {
    const activeSocket = this.connect();
    activeSocket?.on('message:new', handler);
    return () => activeSocket?.off('message:new', handler);
  },

  onConnectError(handler: ConnectionErrorHandler) {
    const activeSocket = this.connect();
    activeSocket?.on('connect_error', handler);
    return () => activeSocket?.off('connect_error', handler);
  },

  onReconnect(handler: () => void) {
    const activeSocket = this.connect();
    activeSocket?.io.on('reconnect', handler);
    return () => activeSocket?.io.off('reconnect', handler);
  },
};
