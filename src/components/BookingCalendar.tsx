"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { Card } from "@/components/ui/Card";
import { BookSlotButton } from "@/components/BookSlotButton";

export interface CalendarSlot {
  id: string;
  /** "YYYY-MM-DD" — kept as a plain string throughout so nothing here
   * gets tripped up by the browser's local timezone shifting a date by a
   * day (see parseDateOnly below). */
  date: string;
  /** "HH:MM:SS" from Postgres `time` */
  time: string;
  locationName: string;
  priceCents: number;
  spotsLeft: number;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseDateOnly(s: string): { y: number; m: number; d: number } {
  const [y, m, d] = s.split("-").map(Number);
  return { y, m, d };
}

function todayYmd(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function formatTime(time: string): string {
  const [hStr, min] = time.split(":");
  const h = Number(hStr);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${min} ${period}`;
}

function formatDateLong(date: string): string {
  const { y, m, d } = parseDateOnly(date);
  // A UTC-anchored Date built from the exact y/m/d never drifts to a
  // different calendar day when formatted, unlike new Date(date) or any
  // local-timezone construction.
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Replaces the old plain location dropdown for the assessment product:
 * students now see only the dates and locations Scott has actually
 * published to assessment_slots (see /instructor/schedule), so they
 * can't land on a booking he can't realistically get to. Groups the
 * slots this page fetched by calendar date and renders a month grid;
 * clicking a highlighted day reveals that day's location(s), price and a
 * Book button per slot (a day can have more than one location/time).
 */
export function BookingCalendar({ productSlug, slots }: { productSlug: string; slots: CalendarSlot[] }) {
  const today = todayYmd();
  const upcoming = useMemo(
    () => slots.filter((s) => s.date >= today).sort((a, b) => a.date.localeCompare(b.date)),
    [slots, today]
  );

  const slotsByDate = useMemo(() => {
    const map = new Map<string, CalendarSlot[]>();
    for (const slot of upcoming) {
      const existing = map.get(slot.date);
      if (existing) existing.push(slot);
      else map.set(slot.date, [slot]);
    }
    return map;
  }, [upcoming]);

  const firstAvailable = upcoming[0]?.date ?? today;
  const initial = parseDateOnly(firstAvailable);

  const [viewYear, setViewYear] = useState(initial.y);
  const [viewMonth, setViewMonth] = useState(initial.m); // 1-12
  const [selectedDate, setSelectedDate] = useState<string | null>(upcoming.length > 0 ? firstAvailable : null);

  function goToMonth(deltaMonths: number) {
    let m = viewMonth + deltaMonths;
    let y = viewYear;
    while (m > 12) {
      m -= 12;
      y += 1;
    }
    while (m < 1) {
      m += 12;
      y -= 1;
    }
    setViewYear(y);
    setViewMonth(m);
  }

  const daysInMonth = new Date(Date.UTC(viewYear, viewMonth, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(viewYear, viewMonth - 1, 1)).getUTCDay();

  const cells: Array<{ day: number; date: string } | null> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({ day, date });
  }

  const selectedSlots = selectedDate ? (slotsByDate.get(selectedDate) ?? []) : [];

  if (upcoming.length === 0) {
    return (
      <Card className="text-center text-sm text-slate-500">
        No assessment dates are open for booking yet — check back soon, or get in touch if you need
        one sooner.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            className="rounded-md px-2 py-1 text-sm font-medium text-wcmt-navy hover:bg-slate-100"
            aria-label="Previous month"
          >
            ‹
          </button>
          <p className="font-heading font-semibold text-wcmt-navy">
            {MONTH_LABELS[viewMonth - 1]} {viewYear}
          </p>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            className="rounded-md px-2 py-1 text-sm font-medium text-wcmt-navy hover:bg-slate-100"
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            if (!cell) return <div key={`blank-${i}`} />;
            const daySlots = slotsByDate.get(cell.date);
            const hasAvailability = daySlots?.some((s) => s.spotsLeft > 0);
            const isPast = cell.date < today;
            const isSelected = cell.date === selectedDate;

            return (
              <button
                key={cell.date}
                type="button"
                disabled={!daySlots || isPast}
                onClick={() => setSelectedDate(cell.date)}
                className={clsx(
                  "flex h-11 flex-col items-center justify-center rounded-md text-sm transition-colors",
                  isPast && "text-slate-300",
                  !isPast && !daySlots && "text-slate-300",
                  !isPast && daySlots && !isSelected && "font-medium text-wcmt-navy hover:bg-slate-100",
                  isSelected && "bg-wcmt-navy font-semibold text-white"
                )}
              >
                {cell.day}
                {daySlots && (
                  <span
                    className={clsx(
                      "mt-0.5 h-1.5 w-1.5 rounded-full",
                      hasAvailability ? (isSelected ? "bg-white" : "bg-wcmt-orange") : "bg-slate-300"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {selectedDate && (
        <div className="space-y-3">
          <h2 className="font-heading font-semibold text-wcmt-navy">{formatDateLong(selectedDate)}</h2>
          {selectedSlots.length === 0 && (
            <p className="text-sm text-slate-500">No dates open this day — pick a highlighted day above.</p>
          )}
          {selectedSlots.map((slot) => {
            const full = slot.spotsLeft <= 0;
            return (
              <Card key={slot.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-heading font-semibold text-wcmt-navy">
                    {formatTime(slot.time)} · {slot.locationName}
                  </p>
                  <p className="text-sm text-slate-500">
                    ${(slot.priceCents / 100).toFixed(2)} ·{" "}
                    {full ? "Fully booked" : `${slot.spotsLeft} spot${slot.spotsLeft === 1 ? "" : "s"} left`}
                  </p>
                </div>
                <BookSlotButton productSlug={productSlug} slotId={slot.id} disabled={full}>
                  {full ? "Full" : "Book This Date"}
                </BookSlotButton>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
