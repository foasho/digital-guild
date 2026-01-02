"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";

import { loadMockData, resetMockData } from "@/constants/api-mocks";

export function WorkerHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClearLocalStorage = () => {
    resetMockData();
    window.location.reload();
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 bg-transparent">
        <h1 className="text-xl font-semibold text-white tracking-wide">
          DIGITAL GUILD
        </h1>
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
      </header>

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
