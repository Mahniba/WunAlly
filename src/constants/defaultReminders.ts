import type { Reminder } from '../types';

/** Shown when user has no reminders yet. Not saved to store until they add/toggle. */
export const defaultRemindersDisplay: (Reminder & { iconType?: 'doctor' | 'vitamins' | 'general' })[] = [
  { id: 'd1', title: "Doctor's Appointment", time: '10:30 AM', completed: true, iconType: 'doctor' },
  { id: 'd2', title: 'Take Prenatal Vitamins', time: '8:00 AM', completed: true, iconType: 'vitamins' },
  { id: 'd3', title: 'Drink enough water', time: 'Throughout day', completed: false, iconType: 'general' },
  { id: 'd4', title: 'Kick count / movement check', time: '9:00 PM', completed: false, iconType: 'general' },
  { id: 'd5', title: 'Rest or light walk', time: 'Afternoon', completed: false, iconType: 'general' },
];
