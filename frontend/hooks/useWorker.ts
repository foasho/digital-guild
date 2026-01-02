"use client";

import { useState, useEffect } from "react";
import { WorkerApi } from "@/constants/api-mocks";
import type { Worker } from "@/types";

/**
 * 現在のワーカー情報を取得するhook
 * モックでは最初のワーカーを返す
 */
const useWorker = (): Worker | undefined => {
  const [worker, setWorker] = useState<Worker | undefined>(undefined);

  useEffect(() => {
    const fetchWorker = async (): Promise<void> => {
      const workers = await WorkerApi.index();
      if (workers.length > 0) {
        setWorker(workers[0]);
      }
    };
    fetchWorker();
  }, []);

  return worker;
};

export { useWorker };
