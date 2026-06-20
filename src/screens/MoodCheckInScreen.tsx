import React, { useEffect } from 'react';
import { ScreenContainer, OfflineMoodCheckIn } from '../components';
import { useContentStore } from '../store/useContentStore';

export function MoodCheckInScreen() {
  const hydrateContent = useContentStore((st) => st.hydrate);

  useEffect(() => {
    hydrateContent();
  }, [hydrateContent]);

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <OfflineMoodCheckIn />
    </ScreenContainer>
  );
}
