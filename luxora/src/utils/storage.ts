export const storage = {
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  setItem: <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  },
  removeItem: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }
  },
  // User Session Management
  getUserSession: <T>(): T | null => {
    return storage.getItem<T | null>('user_session', null);
  },
  setUserSession: <T>(user: T): void => {
    storage.setItem('user_session', user);
  },
  clearUserSession: (): void => {
    storage.removeItem('user_session');
  }
};
