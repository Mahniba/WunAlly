import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPersonalizedTips, type PersonalizedTip } from '../services/api/tips';
import { hasAccessToken } from '../services/api/session';
import { getPersonalizedTipsLocal } from '../utils/personalizedTips';
import { useProfileStore } from '../store/useProfileStore';
import { useMoodStore } from '../store/useMoodStore';
import { useSymptomsStore } from '../store/useSymptomsStore';

export function usePersonalizedTips(week: number) {
  const [tips, setTips] = useState<PersonalizedTip[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    try {
      if (await hasAccessToken()) {
        const res = await fetchPersonalizedTips(week);
        setTips(res.tips);
        return;
      }
    } catch (error) {
      console.warn('Personalized tips API failed, using local fallback:', error);
    }
    const profile = useProfileStore.getState().profile;
    const moodEntries = useMoodStore.getState().entries;
    const symptomEntries = useSymptomsStore.getState().entries;
    setTips(
      getPersonalizedTipsLocal({
        profile,
        moodEntries,
        symptomEntries,
        week,
      })
    );
  }, [week]);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const refreshDebounced = useCallback(
    (opts?: { silent?: boolean }) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        void refresh(opts).finally(() => {
          if (!opts?.silent) setLoading(false);
        });
      }, 600);
    },
    [refresh]
  );

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  return { tips, loading, refresh, refreshDebounced };
}
