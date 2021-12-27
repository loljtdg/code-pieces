import React, { useCallback, useRef } from "react";

export function usePersistCallback<T extends (...args: any[]) => any>(
  fn: T,
  deps?: React.DependencyList
) {
  const ref = useRef<T>();
  ref.current = fn;

  return useCallback<T>(((...args) => ref.current!(...args)) as T, deps ?? []);
}
