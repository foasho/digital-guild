import type { RequesterNotification } from "@/types";

const STORAGE_KEY = "requesterNotifications";

/**
 * 発注者通知のモックAPI
 */
export const RequesterNotificationApi = {
  /**
   * 全ての通知を取得
   */
  getAll: (): RequesterNotification[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  /**
   * リクエスターIDで通知を取得
   */
  getByRequesterId: (requesterId: number): RequesterNotification[] => {
    const all = RequesterNotificationApi.getAll();
    return all.filter((n) => n.requesterId === requesterId);
  },

  /**
   * 通知を既読にする
   */
  markAsRead: (id: number): RequesterNotification | null => {
    const all = RequesterNotificationApi.getAll();
    const index = all.findIndex((n) => n.id === id);
    if (index === -1) return null;

    all[index] = {
      ...all[index],
      confirmedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return all[index];
  },

  /**
   * すべての通知を既読にする
   */
  markAllAsRead: (requesterId: number): RequesterNotification[] => {
    const all = RequesterNotificationApi.getAll();
    const now = new Date().toISOString();
    const updated = all.map((n) =>
      n.requesterId === requesterId && !n.confirmedAt
        ? { ...n, confirmedAt: now }
        : n
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.filter((n) => n.requesterId === requesterId);
  },

  /**
   * 未読数を取得
   */
  getUnreadCount: (requesterId: number): number => {
    const notifications = RequesterNotificationApi.getByRequesterId(requesterId);
    return notifications.filter((n) => !n.confirmedAt).length;
  },

  /**
   * 通知を作成
   */
  create: (notification: Omit<RequesterNotification, "id">): RequesterNotification => {
    const all = RequesterNotificationApi.getAll();
    const newId = all.length > 0 ? Math.max(...all.map((n) => n.id)) + 1 : 1;
    const newNotification: RequesterNotification = {
      id: newId,
      ...notification,
    };
    all.unshift(newNotification); // 先頭に追加
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newNotification;
  },
};

