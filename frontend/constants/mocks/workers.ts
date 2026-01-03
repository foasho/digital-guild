import type { Worker } from "@/types";

export const defaultWorker: Worker = {
  id: 1,
  name: "田中一郎",
  birth: "2001-05-15",
  gender: "male",
  address: "東京都渋谷区",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

export const workers: Worker[] = [defaultWorker];
