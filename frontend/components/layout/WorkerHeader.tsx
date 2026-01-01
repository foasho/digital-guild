"use client";

import { Button } from "@heroui/react";

export function WorkerHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-transparent">
      <h1 className="text-xl font-semibold text-white tracking-wide">
        Digital GUILD
      </h1>
      <Button
        isIconOnly
        variant="light"
        aria-label="Menu"
        className="text-white"
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
    </header>
  );
}
