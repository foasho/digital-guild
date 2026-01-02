import { useState, useEffect } from "react";
import { workers } from "@/constants/mocks";
import { Worker } from "@/types";

const useWorker = (): Worker | undefined => {
  const [worker, setWorker] = useState<Worker | undefined>(undefined);
  useEffect(() => {
    const fetchWorker = async (): Promise<void> => {
      const worker = workers[0];//TODO: 本番移行では、APIから取得する予定
      setWorker(worker);
    };
    fetchWorker();
  }, []);

  return worker;
};

export { useWorker };
