"use client";

import { useState, useEffect } from "react";
import { requesters as mockRequesters } from "@/constants/mocks";
import { useRequesterStore } from "@/stores/requesters";
import type { Requester } from "@/types";

interface UseRequesterResult {
  requester: Requester | null;
  pending: boolean;
}

/**
 * 現在の発注者を取得し、Storeに格納するhook
 * 例外: 直接モックデータを参照
 */
const useRequester = (): UseRequesterResult => {
  const [pending, setPending] = useState(false);
  const { requester, setRequester } = useRequesterStore();

  useEffect(() => {
    const fetchRequester = async (): Promise<void> => {
      if (requester) return;
      setPending(true);
      try {
        // TODO: 本番移行では、APIから取得する予定
        if (mockRequesters.length > 0) {
          setRequester(mockRequesters[0]);
        }
      } finally {
        setPending(false);
      }
    };
    fetchRequester();
  }, [requester, setRequester]);

  return { requester, pending };
};

/**
 * IDで発注者を取得するhook
 */
const useRequesterById = (id: number): Requester | undefined => {
  const [requester, setRequester] = useState<Requester | undefined>(undefined);

  useEffect(() => {
    // TODO: 本番移行では、APIから取得する予定
    const found = mockRequesters.find((r) => r.id === id);
    setRequester(found);
  }, [id]);

  return requester;
};

export { useRequester, useRequesterById };

