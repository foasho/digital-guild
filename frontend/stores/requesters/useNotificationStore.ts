import { create } from "zustand";
import type { RequesterNotification } from "@/types";

interface NotificationState {
  notifications: RequesterNotification[];
  setNotifications: (notifications: RequesterNotification[]) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, confirmedAt: new Date().toISOString() } : n
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        confirmedAt: n.confirmedAt || new Date().toISOString(),
      })),
    })),
  getUnreadCount: () =>
    get().notifications.filter((n) => n.confirmedAt === null).length,
}));

