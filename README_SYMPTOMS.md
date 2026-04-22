Symptom Tracking — Manual Testing & Integration Notes
==================================================

Purpose
-------
This document describes the new symptom-tracking features added to the app: persisted symptom entries, daily check UI, chart visualization, scheduled reminders, and basic detection rules that prompt the user to contact a provider.

Key files
---------
- [src/store/useSymptomsStore.ts](src/store/useSymptomsStore.ts) — persisted Zustand store for symptom entries
- [src/components/SymptomsCheck.tsx](src/components/SymptomsCheck.tsx) — modal to record daily symptoms
- [src/components/SymptomsChart.tsx](src/components/SymptomsChart.tsx) — 14-day chart visualization
- [src/services/notifications.ts](src/services/notifications.ts) — permission + scheduling helpers
- [src/services/symptomRules.ts](src/services/symptomRules.ts) — simple detection rules returning alerts
- [src/components/DoctorAlert.tsx](src/components/DoctorAlert.tsx) — actionable alert modal
- [src/components/SymptomsSettings.tsx](src/components/SymptomsSettings.tsx) — set daily reminder time (HH:MM)
- [src/services/storage.ts](src/services/storage.ts) — new storage keys/getters/setters
- [src/constants/index.ts](src/constants/index.ts) — added storage keys and brand colors
- [App.tsx](App.tsx) — hydrates symptoms on start, requests notification permission, schedules reminder, displays alerts

Manual test checklist
---------------------
1. Start the app using Expo (simulator/device):

   ```bash
   npm install
   npm run start
   ```

2. Grant notifications permission when prompted (on a real device). The app will schedule a daily reminder at the stored time (default 09:00).

3. Open the app and go to Reminders > press "Daily Symptom Check" to open the `SymptomsCheck` modal; record symptoms (nausea, headache, dizziness) and save.

4. Verify that the entry persists across app restarts: entries are stored under key `@wunally/symptom_entries` (see AsyncStorage / `src/services/storage.ts`).

5. Visit Profile > Symptom Settings to change the reminder time (enter `HH:MM` 24-hour). After saving, a daily scheduled notification will be set to that time.

6. Check `Profile` to view the Symptoms chart (14-day window). New entries should update the chart.

7. Trigger rule alerts: the app evaluates simple rules on entries change — e.g., 4+ occurrences in 7 days or 6+ in 14 days per symptom. When a rule fires you will see the `DoctorAlert` modal with options to call/message (linking to device dialer/SMS).

Notes & implementation details
------------------------------
- Notifications use `expo-notifications`. On simulators notifications may be limited; test on a physical device.
- Reminder time is stored at key `@wunally/symptom_reminder_time` as `HH:MM` (24-hour). The app reads this value at startup and schedules the daily notification.
- Detection rules are intentionally simple and deterministic (see `src/services/symptomRules.ts`). Tune thresholds to clinical requirements before production.
- Brand colors updated to peach/white in `src/theme/colors.ts`. Use `colors.peach` / `colors.background` for new UI.
- The data model (`SymptomEntry`) is minimal: ISO `date`, boolean flags per symptom, optional notes. Extend as needed (severity, timestamps, provider messages).

Next steps (suggested)
----------------------
- Add unit tests for `evaluateSymptomRules` and the store hydrate/persist logic.
- Add an in-app history/list screen to review past entries and edit/delete entries.
- Add analytics / export (PDF or CSV) for clinician review.

If you want, I can:
- Add unit tests and a small test harness, or
- Add the history screen and edit/delete support next.
