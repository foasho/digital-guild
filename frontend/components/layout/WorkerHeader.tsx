"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { Bell, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { resetMockData } from "@/constants/api-mocks";
import { useNotifications } from "@/hooks/workers";

export function WorkerHeader() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    if (!notification.confirmedAt) {
      markAsRead(notification.id);
    }
    if (notification.url) {
      setIsNotificationOpen(false);
      router.push(notification.url);
    }
  };

  const handleClearLocalStorage = () => {
    resetMockData();
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "たった今";
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 bg-transparent">
        <h1 className="text-xl font-semibold text-white tracking-wide">
          DIGITAL GUILD
        </h1>
        <div className="flex items-center gap-2">
          {/* 通知アイコン */}
          <div className="relative">
            <Button
              isIconOnly
              variant="light"
              aria-label="通知"
              className="text-white"
              onPress={() => setIsNotificationOpen(true)}
            >
              <Bell size={22} />
            </Button>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </div>
          {/* メニューアイコン */}
        <Button
          isIconOnly
          variant="light"
          aria-label="Menu"
          className="text-white"
          onPress={() => setIsMenuOpen(true)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </Button>
        </div>
      </header>

      {/* 通知モーダル */}
      <Modal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        placement="center"
        backdrop="blur"
        size="sm"
        scrollBehavior="inside"
        classNames={{
          backdrop: "bg-black/75",
          base: "bg-gray-900/95 border border-white/10 max-h-[70vh]",
          header: "border-b border-white/10",
          body: "p-0",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-amber-400" />
              通知
              {unreadCount > 0 && (
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {unreadCount}件
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="light"
                className="text-amber-400 text-xs"
                onPress={markAllAsRead}
              >
                すべて既読
              </Button>
            )}
          </ModalHeader>
          <ModalBody>
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-white/50">
                通知はありません
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-4 text-left hover:bg-white/5 transition-colors ${
                      notification.confirmedAt ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!notification.confirmedAt && (
                        <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 shrink-0" />
                      )}
                      <div className={`flex-1 ${notification.confirmedAt ? "pl-5" : ""}`}>
                        <p className="text-white font-medium text-sm">
                          {notification.title}
                        </p>
                        <p className="text-white/60 text-xs mt-1">
                          {notification.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-white/40 text-xs">
                            {formatDate(notification.createdAt)}
                          </p>
                          {notification.url && (
                            <span className="flex items-center gap-0.5 text-amber-400 text-xs font-medium">
                              詳細を見る
                              <ChevronRight size={14} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 開発用メニューモーダル */}
      <Modal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        placement="center"
        backdrop="blur"
        classNames={{
          backdrop: "bg-black/75",
          base: "bg-gray-900/95 border border-white/10",
          header: "border-b border-white/10",
          footer: "border-t border-white/10",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-white">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-amber-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              開発者メニュー
            </div>
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-red-400 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-red-400 font-semibold mb-1">
                      データリセット
                    </h3>
                    <p className="text-white/60 text-sm">
                      ローカルストレージのデータをすべて削除し、アプリを初期状態に戻します。受注済みジョブやブックマークなどがリセットされます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => setIsMenuOpen(false)}
              className="text-white/70 bg-white/10 hover:bg-white/20"
            >
              キャンセル
            </Button>
            <Button
              color="danger"
              onPress={handleClearLocalStorage}
              className="bg-red-500 text-white font-semibold"
            >
              データを削除してリロード
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
