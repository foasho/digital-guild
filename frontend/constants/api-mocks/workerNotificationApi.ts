import type { WorkerNotification } from "@/types";

const STORAGE_KEY = "workerNotifications";

/**
 * 労働者通知のモックAPI
 */
export const WorkerNotificationApi = {
  /**
   * 全ての通知を取得
   */
  getAll: (): WorkerNotification[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  /**
   * ワーカーIDで通知を取得
   */
  getByWorkerId: (workerId: number): WorkerNotification[] => {
    const all = WorkerNotificationApi.getAll();
    return all.filter((n) => n.workerId === workerId);
  },

  /**
   * 通知を既読にする
   */
  markAsRead: (id: number): WorkerNotification | null => {
    const all = WorkerNotificationApi.getAll();
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
  markAllAsRead: (workerId: number): WorkerNotification[] => {
    const all = WorkerNotificationApi.getAll();
    const now = new Date().toISOString();
    const updated = all.map((n) =>
      n.workerId === workerId && !n.confirmedAt
        ? { ...n, confirmedAt: now }
        : n
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.filter((n) => n.workerId === workerId);
  },

  /**
   * 未読数を取得
   */
  getUnreadCount: (workerId: number): number => {
    const notifications = WorkerNotificationApi.getByWorkerId(workerId);
    return notifications.filter((n) => !n.confirmedAt).length;
  },
};

