const MONTHS = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];
const MONTHS_SHORT = [
  "Jan","Feb","Mar","Apr","Mei","Jun",
  "Jul","Agu","Sep","Okt","Nov","Des",
];
const WEEKDAYS = [
  "Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu",
];
const WEEKDAYS_SHORT = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

export function formatCurrency(value: number): string {
  const rounded = Math.round(Math.abs(value));
  return "Rp" + new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(rounded);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value);
}

export function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS_SHORT[m-1]} ${y}`;
}

export function formatLongDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m-1]} ${y}`;
}

export function formatWeekdayLong(iso: string): string {
  return WEEKDAYS[parseISO(iso).getDay()];
}

export function formatWeekdayShort(iso: string): string {
  return WEEKDAYS_SHORT[parseISO(iso).getDay()];
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m-1, d);
}

export function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,"0");
  const d = String(date.getDate()).padStart(2,"0");
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return toISO(new Date());
}

export interface Week {
  start: string;
  end: string;
  days: string[];
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (d.getDay()+6)%7;
  d.setDate(d.getDate()-offset);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate()+n);
  return d;
}

export function buildWeek(anchor: Date): Week {
  const start = startOfWeek(anchor);
  const days: string[] = [];
  for (let i=0;i<7;i++) days.push(toISO(addDays(start,i)));
  return { start: days[0], end: days[6], days };
}

export function addWeeks(week: Week, n: number): Week {
  return buildWeek(addDays(parseISO(week.start), n*7));
}

export function weekLabel(week: Week): string {
  const s = parseISO(week.start);
  const e = parseISO(week.end);
  const sMon = MONTHS_SHORT[s.getMonth()];
  const eMon = MONTHS_SHORT[e.getMonth()];
  if (s.getFullYear()===e.getFullYear() && s.getMonth()===e.getMonth()) {
    return `${s.getDate()} - ${e.getDate()} ${sMon} ${s.getFullYear()}`;
  }
  return `${s.getDate()} ${sMon} ${s.getFullYear()} - ${e.getDate()} ${eMon} ${e.getFullYear()}`;
}

export function isInWeek(iso: string, week: Week): boolean {
  return iso >= week.start && iso <= week.end;
}
