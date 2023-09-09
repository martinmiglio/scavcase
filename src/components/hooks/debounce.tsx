import { Dispatch, useEffect, useState, SetStateAction } from "react";

export function useDebounce<T>(
  value: T,
  delay: number,
): [T, T, Dispatch<SetStateAction<T>>] {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [valueToSet, setValueToSet] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(valueToSet);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [delay, valueToSet]);

  return [valueToSet, debouncedValue, setValueToSet];
}
