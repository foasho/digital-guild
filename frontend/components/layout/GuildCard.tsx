"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/react";
import Image from "next/image";
import { useWorkerStore, useTrustPassportStore } from "@/stores";

const DEFAULT_NAME = "田中　一郎";
const DEFAULT_BALANCE = 81520;
const DEFAULT_RANK = "BRONZE";

export function GuildCard() {
  const [isHydrated, setIsHydrated] = useState(false);

  const worker = useWorkerStore((state) => state.worker);
  const jpycBalance = useWorkerStore((state) => state.jpycBalance);
  const getRank = useTrustPassportStore((state) => state.getRank);

  // Rehydrate stores on mount
  useEffect(() => {
    useWorkerStore.persist.rehydrate();
    useTrustPassportStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  // Use default values until hydration is complete or if store is empty
  const displayName = isHydrated && worker?.name ? worker.name : DEFAULT_NAME;
  const displayBalance = isHydrated && jpycBalance > 0 ? jpycBalance : DEFAULT_BALANCE;
  const displayRank = isHydrated ? getRank().toUpperCase() : DEFAULT_RANK;

  const formattedBalance = displayBalance.toLocaleString();

  return (
    <Card
      className="mx-4 border-2 border-amber-500/80 bg-amber-900/30 backdrop-blur-sm"
      radius="lg"
      shadow="md"
    >
      <CardBody className="flex flex-row items-center gap-3 p-3">
        {/* Left: Avatar */}
        <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400/70">
          <Image
            src="/avatar4.png"
            alt={displayName}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Center: Label and Name */}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-xs text-amber-100/80">探索者</span>
          <span className="text-base font-bold text-white truncate">
            {displayName}
          </span>
        </div>

        {/* Right: Balance and Class */}
        <div className="flex flex-col items-end shrink-0">
          <span className="text-sm text-amber-100">
            {formattedBalance} JPYC
          </span>
          <span className="text-xs text-amber-100/80">
            class <span className="font-bold">{displayRank}</span>
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
