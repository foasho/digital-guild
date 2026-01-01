"use client";

import { ReactNode } from "react";
import {
  BackgroundImage,
  GuildCard,
  MobileOnlyOverlay,
  MockSwitchBar,
  WorkerFooter,
  WorkerHeader,
} from "@/components/layout";

interface WorkerLayoutProps {
  children: ReactNode;
}

export default function WorkerLayout({ children }: WorkerLayoutProps) {
  return (
    <BackgroundImage>
      {/* MobileOnlyOverlay - sm以上で表示 */}
      <MobileOnlyOverlay />

      {/* MockSwitchBar - Fixed at top */}
      <MockSwitchBar visible={true} mode="worker" />

      {/* Main container - Centered with max-width for mobile */}
      <div className="mx-auto max-w-[480px] h-[100dvh] flex flex-col">
        {/* Top padding for MockSwitchBar (approx 40px) */}
        <div className="pt-10 pb-3 bg-black/25">
          {/* Header */}
          <WorkerHeader />

          {/* Guild Card */}
          <GuildCard />
        </div>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      </div>

      {/* Footer - Fixed at bottom */}
      <WorkerFooter />
    </BackgroundImage>
  );
}
