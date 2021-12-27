import { usePersistCallback } from "./usePersistCallback";
import { useRef } from "react";

export type Option = {
  /* 两次点击的最大时间间隔 */
  timeRange?: number;
  /* 是否防抖，多次只触发一次 */
  debounce?: boolean;
  /* 是否双击与单击互斥 */
  preventEachOther?: boolean;
};

const defaultOption: Option = {
  timeRange: 250,
  debounce: true,
  preventEachOther: true,
};

export const useDoubleClick = <T extends any[]>(
  {
    onSingleClick,
    onDoubleClick,
  }: {
    onSingleClick?: (...params: T) => void;
    onDoubleClick?: (...params: T) => void;
  },
  {
    timeRange = defaultOption.timeRange,
    debounce = defaultOption.debounce,
    preventEachOther = defaultOption.preventEachOther,
  }: Option = defaultOption
) => {
  const lastClickRef = useRef<{ key: any; count: number }>();
  const timerRef = useRef<number>();

  const handleClick = usePersistCallback((key: any, ...params: T) => {
    // 防抖逻辑
    if (debounce && lastClickRef.current?.key === key && timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // 不互斥逻辑
    if (!preventEachOther) {
      onSingleClick?.(...params);
    }

    lastClickRef.current = {
      key,
      count:
        lastClickRef.current && lastClickRef.current.key === key
          ? lastClickRef.current?.count + 1
          : 1,
    };

    timerRef.current = setTimeout(() => {
      if (
        lastClickRef.current?.key === key &&
        lastClickRef.current?.count &&
        lastClickRef.current.count >= 2
      ) {
        onDoubleClick?.(...params);
      } else if (preventEachOther && lastClickRef.current?.count === 1) {
        // 互斥逻辑
        onSingleClick?.(...params);
      }
      lastClickRef.current = undefined;
    }, timeRange);
  });

  return handleClick;
};
