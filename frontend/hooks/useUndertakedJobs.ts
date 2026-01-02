import { useState, useEffect } from "react";
import { UndertakedJobApi } from "@/constants/api-mocks/undertakedJobApi";
import { UndertakedJob } from "@/types";

const useUndertakedJobs = (): UndertakedJob[] => {
  const [undertakedJobs, setUndertakedJobs] = useState<UndertakedJob[]>([]);
  useEffect(() => {
    const fetchUndertakedJobs = async (): Promise<void> => {
      const _undertakedJobs = await UndertakedJobApi.index();
      setUndertakedJobs(_undertakedJobs);
    };
    fetchUndertakedJobs();
  }, []);
  return undertakedJobs;
};

export { useUndertakedJobs };
