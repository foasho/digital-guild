"use client";

import { useState, useEffect } from "react";
import { RequesterApi } from "@/constants/api-mocks";
import type { Requester } from "@/types";

/**
 * 発注者一覧を取得するhook
 */
const useRequesters = (): Requester[] => {
  const [requesters, setRequesters] = useState<Requester[]>([]);

  useEffect(() => {
    const fetchRequesters = async (): Promise<void> => {
      const list = await RequesterApi.index();
      setRequesters(list);
    };
    fetchRequesters();
  }, []);

  return requesters;
};

/**
 * 特定の発注者を取得するhook
 * モックでは最初の発注者を返す
 */
const useRequester = (): Requester | undefined => {
  const [requester, setRequester] = useState<Requester | undefined>(undefined);

  useEffect(() => {
    const fetchRequester = async (): Promise<void> => {
      const list = await RequesterApi.index();
      if (list.length > 0) {
        setRequester(list[0]);
      }
    };
    fetchRequester();
  }, []);

  return requester;
};

/**
 * IDで発注者を取得するhook
 */
const useRequesterById = (id: number): Requester | undefined => {
  const [requester, setRequester] = useState<Requester | undefined>(undefined);

  useEffect(() => {
    const fetchRequester = async (): Promise<void> => {
      try {
        const data = await RequesterApi.getById({ id });
        setRequester(data);
      } catch {
        setRequester(undefined);
      }
    };
    if (id) {
      fetchRequester();
    }
  }, [id]);

  return requester;
};

export { useRequesters, useRequester, useRequesterById };

