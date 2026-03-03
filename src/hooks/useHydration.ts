import { useEffect, useState } from 'react';

export function useHydration(load: () => Promise<void>): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    load().then(() => setReady(true));
  }, [load]);
  return ready;
}
