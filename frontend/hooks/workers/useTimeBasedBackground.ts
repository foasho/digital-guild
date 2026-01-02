"use client";

import { useState, useEffect } from "react";

type TimeOfDay = "morning" | "noon" | "night";

interface UseTimeBasedBackgroundResult {
  backgroundPath: string;
  timeOfDay: TimeOfDay;
}

/**
 * 現在時刻に基づいて適切な背景画像パスを返すカスタムフック
 *
 * 時間帯判定:
 * - 6:00-11:59 → morning (朝)
 * - 12:00-17:59 → noon (昼)
 * - 18:00-5:59 → night (夜)
 */
export function useTimeBasedBackground(): UseTimeBasedBackgroundResult {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("morning");

  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      let newTimeOfDay: TimeOfDay;

      if (hour >= 6 && hour < 12) {
        newTimeOfDay = "morning";
      } else if (hour >= 12 && hour < 18) {
        newTimeOfDay = "noon";
      } else {
        newTimeOfDay = "night";
      }

      setTimeOfDay(newTimeOfDay);
    };

    // 初回実行
    updateTimeOfDay();

    // 1分ごとに時間帯をチェック
    const intervalId = setInterval(updateTimeOfDay, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const backgroundPath = `/backgrounds/${timeOfDay}.png`;

  return {
    backgroundPath,
    timeOfDay,
  };
}
