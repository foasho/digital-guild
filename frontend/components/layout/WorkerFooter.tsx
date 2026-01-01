"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  icon: string;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: "/icons/board.png", label: "掲示板", path: "/worker/request-boards" },
  { icon: "/icons/map.png", label: "マップ", path: "/worker/request-map" },
  { icon: "/icons/job.png", label: "ジョブ", path: "/worker/jobs" },
  { icon: "/icons/wallet.png", label: "ウォレット", path: "/worker/wallet" },
];

export function WorkerFooter() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-800">
      <nav className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
                isActive
                  ? "text-amber-400"
                  : "text-neutral-400 hover:text-white"
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
                className={`object-contain ${
                  isActive
                    ? "opacity-100 brightness-125"
                    : "opacity-70 brightness-100"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-amber-400" : "text-neutral-400"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
}
