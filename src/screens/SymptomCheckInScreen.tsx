import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { ScreenContainer, SymptomCheckInOfflineLayout } from '../components';
import { useSymptomsStore } from '../store/useSymptomsStore';
import { useContentStore } from '../store/useContentStore';
import type { RootStackParamList } from '../navigation/types';
import type { CheckInTabId } from '../components/checkin/CheckInCategoryTabs';

type Route = RouteProp<RootStackParamList, 'SymptomCheckIn'>;

export function SymptomCheckInScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const category = route.params.symptomCategory as CheckInTabId;
  const title = route.params.title;
  const showExtras = route.params.showExtras ?? false;
  const symptoms = useContentStore((st) => st.getSymptoms(category));
  const hydrateContent = useContentStore((st) => st.hydrate);
  const addEntry = useSymptomsStore((st) => st.addEntry);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [noneToday, setNoneToday] = useState(false);
  const [notes, setNotes] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [painLevel, setPainLevel] = useState('');
  const [foodNote, setFoodNote] = useState('');

  useEffect(() => {
    hydrateContent();
  }, [hydrateContent]);

  const toggle = (k: string) => {
    setNoneToday(false);
    setSelected((p) => ({ ...p, [k]: !p[k] }));
  };

  const selectNoneToday = () => {
    setNoneToday((prev) => {
      if (prev) {
        return false;
      }
      setSelected({});
      return true;
    });
  };

  const buildPayload = () => ({
    symptoms: selected,
    category,
    notes: notes.trim() || undefined,
    sleepHours: Number.isFinite(Number(sleepHours.trim()))
      ? Number(sleepHours.trim())
      : undefined,
    painLevel: Number.isFinite(Number(painLevel.trim()))
      ? Number(painLevel.trim())
      : undefined,
    foodNote: foodNote.trim() || undefined,
  });

  const handleSave = async () => {
    const anySelected = Object.values(selected).some(Boolean);
    if (!anySelected && !noneToday && !showExtras) {
      Alert.alert('No symptoms selected', 'Please select at least one symptom or tap "None today".');
      return;
    }
    try {
      if (noneToday) {
        await addEntry({ symptoms: {}, category });
      } else {
        await addEntry(buildPayload());
      }
      Alert.alert('Saved', 'Your check-in was saved.');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not save your check-in. Please try again.');
    }
  };

  const isWarning = category === 'warning_signs';

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <SymptomCheckInOfflineLayout
        title={title}
        category={category}
        symptoms={symptoms}
        selected={selected}
        onToggle={toggle}
        onNoneToday={selectNoneToday}
        onSave={handleSave}
        noneSelected={noneToday}
        showExtras={showExtras}
        notes={notes}
        onNotesChange={setNotes}
        sleepHours={sleepHours}
        onSleepHoursChange={setSleepHours}
        painLevel={painLevel}
        onPainLevelChange={setPainLevel}
        foodNote={foodNote}
        onFoodNoteChange={setFoodNote}
        isWarning={isWarning}
      />
    </ScreenContainer>
  );
}
