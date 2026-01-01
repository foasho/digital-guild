import type { Requester } from "@/types";

export const defaultRequester: Requester = {
  id: "requester-1",
  name: "湯煙町観光協会",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester2: Requester = {
  id: "requester-2",
  name: "みかん里町農業協同組合",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester3: Requester = {
  id: "requester-3",
  name: "温泉郷旅館組合",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requesters: Requester[] = [
  defaultRequester,
  requester2,
  requester3,
];
