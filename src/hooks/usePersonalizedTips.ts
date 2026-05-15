import { useCallback, useEffect, useState } from 'react';
import { fetchPersonalizedTips, type PersonalizedTip } from '../services/api/tips';
import { hasAccessToken } from '../services/api/session';
import { getPersonalizedTipsLocal } from '../utils/personalizedTips';
import { useProfileStore } from '../store/useProfileStore';
import { useMoodStore } from '../store/useMoodStore';
import { useSymptomsStore } from '../store/useSymptomsStore';

export function usePersonalizedTips(week: number) {
  const profile = useProfileStore((s) => s.profile);
  const moodEntries = useMoodStore((s) => s.entries);
  const symptomEntries = useSymptomsStore((s) => s.entries);
  const [tips, setTips] = useState<PersonalizedTip[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (await hasAccessToken()) {
        const res = await fetchPersonalizedTips(week);
        setTips(res.tips);
        return;
      }
    } catch (error) {
      console.warn('Personalized tips API failed, using local fallback:', error);
    }
    setTips(
      getPersonalizedTipsLocal({
        profile,
        moodEntries,
        symptomEntries,
        week,
      })
    );
  }, [week, profile, moodEntries, symptomEntries]);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  return { tips, loading, refresh };
}
