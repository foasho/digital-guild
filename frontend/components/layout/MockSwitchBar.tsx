"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

type MockSwitchBarProps = {
  visible: boolean;
  mode: "worker" | "requester";
};

export function MockSwitchBar({ visible, mode }: MockSwitchBarProps) {
  const router = useRouter();

  if (!visible) {
    return null;
  }

  const handleSwitch = () => {
    if (mode === "worker") {
      router.push("/requester");
    } else {
      router.push("/worker/request-boards");
    }
  };

  const message =
    mode === "worker"
      ? "※これはモックです。発注者側UIは右のボタンから。"
      : "※これはモックです。労働者側UIは右のボタンから。";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 bg-black/70 backdrop-blur-sm">
      <span className="text-[10px] text-white">{message}</span>
      <Button size="sm" color="primary" className="text-[10px] text-white" variant="solid" onPress={handleSwitch}>
        切り替え
      </Button>
    </div>
  );
}
