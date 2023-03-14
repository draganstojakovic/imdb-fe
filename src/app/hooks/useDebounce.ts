import { useState, useEffect } from 'react';

function useDebounce(value: unknown, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<unknown>(undefined);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
