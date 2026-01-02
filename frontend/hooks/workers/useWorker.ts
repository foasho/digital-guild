import { useState, useEffect } from "react";
import { workers } from "@/constants/mocks";
import { Worker } from "@/types";
import { useWorkerStore } from "@/stores/workers";

type UseWorkerProps = {
  worker: Worker | null;
  pending: boolean;
};
const useWorker = (): UseWorkerProps => {
  const [pending, setPending] = useState(false);
  const { worker, setWorker } = useWorkerStore();
  useEffect(() => {
    const fetchWorker = async (): Promise<void> => {
      setPending(true);
      try {
        const worker = workers[0];//TODO: 本番移行では、APIから取得する予定
        setWorker(worker);
      } finally {
        setPending(false);
      }
    };
    fetchWorker();
  }, []);
  return { worker, pending };
};

export { useWorker };
