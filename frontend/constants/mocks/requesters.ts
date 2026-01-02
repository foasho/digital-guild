import type { Requester } from "@/types";

export const defaultRequester: Requester = {
  id: 1,
  name: "湯煙町自治体",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester2: Requester = {
  id: 2,
  name: "みかん里町農業協同組合",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requester3: Requester = {
  id: 3,
  name: "温泉郷旅館組合",
  createdAt: "2025-01-01T00:00:00Z",
};

export const requesters: Requester[] = [
  defaultRequester,
  requester2,
  requester3,
];
