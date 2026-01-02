"use client";

import { ReactNode, useEffect } from "react";
import { MockSwitchBar } from "@/components/layout";
import { loadMockData } from "@/constants/api-mocks";

interface RequesterLayoutProps {
  children: ReactNode;
}

export default function RequesterLayout({ children }: RequesterLayoutProps) {
  // 初回起動時にモックデータをLocalStorageにロード
  useEffect(() => {
    loadMockData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* MockSwitchBar - Fixed at top */}
      <MockSwitchBar visible={true} mode="requester" />

      {/* Main container */}
      <div className="mx-auto max-w-7xl min-h-screen flex flex-col">
        {/* Top padding for MockSwitchBar (approx 40px) */}
        <div className="pt-10">
          {/* Header */}
          <header className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">発注管理</h1>
          </header>
        </div>

        {/* Main content area */}
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
