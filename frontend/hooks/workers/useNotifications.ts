"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { WorkerNotificationApi } from "@/constants/api-mocks";
import { useNotificationStore } from "@/stores/workers";
import type { WorkerNotification } from "@/types";

interface UseNotificationsResult {
  notifications: WorkerNotification[];
  unreadCount: number;
  pending: boolean;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  refetch: () => Promise<void>;
}

/**
 * 労働者通知を取得するhook
 */
const useNotifications = (workerId: number = 1): UseNotificationsResult => {
  const [pending, setPending] = useState(false);
  const hasFetched = useRef(false);
  const { notifications, setNotifications, getUnreadCount } =
    useNotificationStore();

  const fetchNotifications = useCallback(async (): Promise<void> => {
    setPending(true);
    try {
      // LocalStorageから取得
      const data = WorkerNotificationApi.getByWorkerId(workerId);
      setNotifications(data);
    } finally {
      setPending(false);
    }
  }, [setNotifications, workerId]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchNotifications();
    }
  }, [fetchNotifications]);

  // 既読処理（LocalStorageにも保存）
  const markAsRead = useCallback((id: number) => {
    WorkerNotificationApi.markAsRead(id);
    // storeを更新
    const updated = WorkerNotificationApi.getByWorkerId(workerId);
    setNotifications(updated);
  }, [workerId, setNotifications]);

  // 全既読処理（LocalStorageにも保存）
  const markAllAsRead = useCallback(() => {
    WorkerNotificationApi.markAllAsRead(workerId);
    // storeを更新
    const updated = WorkerNotificationApi.getByWorkerId(workerId);
    setNotifications(updated);
  }, [workerId, setNotifications]);

  return {
    notifications,
    unreadCount: getUnreadCount(),
    pending,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};

export { useNotifications };

