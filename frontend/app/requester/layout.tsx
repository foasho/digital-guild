"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  Building2,
  LayoutDashboard,
  Plus,
  Settings,
  HelpCircle,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { MockSwitchBar } from "@/components/layout";
import { loadMockData } from "@/constants/api-mocks";
import { useNotifications } from "@/hooks/requesters";

interface RequesterLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    href: "/requester/dashboard",
    label: "ダッシュボード",
    icon: LayoutDashboard,
  },
  {
    href: "/requester/jobs/new",
    label: "新規ジョブ作成",
    icon: Plus,
  },
];

const secondaryNavItems = [
  {
    href: "#",
    label: "設定",
    icon: Settings,
    disabled: true,
  },
  {
    href: "#",
    label: "ヘルプ",
    icon: HelpCircle,
    disabled: true,
  },
];

export default function RequesterLayout({ children }: RequesterLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
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

  // 初回起動時にモックデータをLocalStorageにロード
  useEffect(() => {
    loadMockData();
    setMounted(true);
    // ダークモードの初期化
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* MockSwitchBar - Fixed at top */}
      <MockSwitchBar visible={true} mode="requester" />

      {/* サイドバー - PC/タブレット用 */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:pt-10">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-5 pb-4 overflow-y-auto">
          {/* ロゴ */}
          <div className="flex items-center gap-3 px-6 mb-8">
            <div className="p-2.5 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">DIGITAL GUILD</h1>
              <p className="text-xs text-gray-500">発注者ポータル</p>
            </div>
          </div>

          {/* メインナビ */}
          <nav className="flex-1 px-4 space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              メニュー
            </p>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-sky-50 text-sky-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${isActive ? "text-sky-600" : "text-gray-400"}`}
                  />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-6">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                その他
              </p>
              {secondaryNavItems.map((item) => (
                <span
                  key={item.label}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded">
                    準備中
                  </span>
                </span>
              ))}
            </div>
          </nav>

          {/* フッター情報 */}
          <div className="px-4 py-4 border-t border-gray-100">
          </div>
        </div>
      </aside>

      {/* モバイル用ヘッダー */}
      <header className="lg:hidden fixed top-10 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/requester/dashboard" className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">DIGITAL GUILD</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* 通知アイコン */}
            <div className="relative">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
                onPress={() => setIsNotificationOpen(true)}
                className="text-gray-500 dark:text-gray-400"
              >
                <Bell className="w-5 h-5" />
              </Button>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </div>
            {/* ダークモードトグル */}
            <Button
              isIconOnly
              variant="light"
              radius="full"
              size="sm"
              onPress={toggleTheme}
              className="text-gray-500 dark:text-gray-400"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {sidebarOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-sky-50 text-sky-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* PC用トップバー */}
      <header className="hidden lg:block fixed top-10 left-64 right-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-14 px-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* 通知アイコン */}
            <div className="relative">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
                onPress={() => setIsNotificationOpen(true)}
                className="text-gray-500 dark:text-gray-400"
              >
                <Bell className="w-5 h-5" />
              </Button>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </div>
            {/* ダークモードトグル */}
            <Button
              isIconOnly
              variant="light"
              radius="full"
              size="sm"
              onPress={toggleTheme}
              className="text-gray-500 dark:text-gray-400"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              SO
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="lg:pl-64 pt-24 lg:pt-24 pb-8 min-h-screen">
        <div className="pt-4 px-8">{children}</div>
      </main>

      {/* 通知モーダル */}
      <Modal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        placement="center"
        backdrop="blur"
        size="sm"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[70vh] bg-white/75",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-sky-500" />
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
                className="text-sky-500 text-xs"
                onPress={markAllAsRead}
              >
                すべて既読
              </Button>
            )}
          </ModalHeader>
          <ModalBody className="p-0">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                通知はありません
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      notification.confirmedAt ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!notification.confirmedAt && (
                        <span className="w-2 h-2 bg-sky-500 rounded-full mt-2 shrink-0" />
                      )}
                      <div className={`flex-1 ${notification.confirmedAt ? "pl-5" : ""}`}>
                        <p className="text-gray-800 font-medium text-sm">
                          {notification.title}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {notification.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-gray-400 text-xs">
                            {formatDate(notification.createdAt)}
                          </p>
                          {notification.url && (
                            <span className="flex items-center gap-0.5 text-sky-500 text-xs font-medium">
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
    </div>
  );
}
