"use client";

import { useState, useEffect, useCallback } from "react";
import { RequesterNotificationApi } from "@/constants/api-mocks";
import { useNotificationStore } from "@/stores/requesters";
import type { RequesterNotification } from "@/types";

interface UseNotificationsResult {
  notifications: RequesterNotification[];
  unreadCount: number;
  pending: boolean;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  refetch: () => Promise<void>;
}

/**
 * 発注者通知を取得するhook
 */
const useNotifications = (requesterId: number = 1000): UseNotificationsResult => {
  const [pending, setPending] = useState(false);
  const { notifications, setNotifications, getUnreadCount } =
    useNotificationStore();

  const fetchNotifications = useCallback(async (): Promise<void> => {
    setPending(true);
    try {
      // LocalStorageから取得
      const data = RequesterNotificationApi.getByRequesterId(requesterId);
      setNotifications(data);
    } finally {
      setPending(false);
    }
  }, [setNotifications, requesterId]);

  useEffect(() => {
    // マウント時に常にLocalStorageから最新データを取得
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 既読処理（LocalStorageにも保存）
  const markAsRead = useCallback((id: number) => {
    RequesterNotificationApi.markAsRead(id);
    // storeを更新
    const updated = RequesterNotificationApi.getByRequesterId(requesterId);
    setNotifications(updated);
  }, [requesterId, setNotifications]);

  // 全既読処理（LocalStorageにも保存）
  const markAllAsRead = useCallback(() => {
    RequesterNotificationApi.markAllAsRead(requesterId);
    // storeを更新
    const updated = RequesterNotificationApi.getByRequesterId(requesterId);
    setNotifications(updated);
  }, [requesterId, setNotifications]);

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

