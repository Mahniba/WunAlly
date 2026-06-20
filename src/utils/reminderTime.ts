/** Parse display times like "10:30 AM" or "14:00" into 24h clock parts. */
export function parseReminderTime(time: string): { hour: number; minute: number } | null {
  const trimmed = time.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (
    lower.includes('throughout') ||
    lower.includes('afternoon') ||
    lower.includes('morning') ||
    lower === 'all day'
  ) {
    return null;
  }

  const ampm = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let hour = parseInt(ampm[1], 10);
    const minute = parseInt(ampm[2], 10);
    const isPm = ampm[3].toUpperCase() === 'PM';
    if (hour === 12) hour = isPm ? 12 : 0;
    else if (isPm) hour += 12;
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    return { hour, minute };
  }

  const h24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (h24) {
    const hour = parseInt(h24[1], 10);
    const minute = parseInt(h24[2], 10);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    return { hour, minute };
  }

  return null;
}

export function formatReminderDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildTriggerDate(isoDate: string | undefined, hour: number, minute: number): Date {
  const base = isoDate ? new Date(`${isoDate}T00:00:00`) : new Date();
  const trigger = new Date(base);
  trigger.setHours(hour, minute, 0, 0);
  if (!isoDate && trigger.getTime() <= Date.now()) {
    trigger.setDate(trigger.getDate() + 1);
  }
  return trigger;
}
