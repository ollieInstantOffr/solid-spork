"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

function daysInMonth(month: number, year: number) {
  if (!month || !year) return 31;
  return new Date(year, month, 0).getDate();
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1929 }, (_, i) => currentYear - 10 - i);

// ── Reusable custom dropdown ─────────────────────────────────────────────────

interface DropdownProps {
  label: string;
  placeholder: string;
  value: number | null;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
}

function Dropdown({ label, placeholder, value, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Scroll selected option into view on open
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>("[data-selected='true']");
    if (el) el.scrollIntoView({ block: "center" });
  }, [open]);

  const selectedLabel = value != null ? options.find((o) => o.value === value)?.label : null;

  function pick(val: number) {
    onChange(val);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <p
        className="text-[10px] font-bold uppercase tracking-wide mb-1.5"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </p>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
        style={{
          background: open ? "var(--card)" : "var(--secondary)",
          border: `1.5px solid ${open ? "var(--primary)" : "var(--border)"}`,
          boxShadow: open ? "0 0 0 3px rgba(196,96,122,0.12)" : "none",
          color: selectedLabel ? "var(--foreground)" : "var(--muted-foreground)",
        }}
      >
        <span className="truncate">{selectedLabel ?? placeholder}</span>
        <span
          className="text-[11px] shrink-0 transition-transform duration-200"
          style={{
            color: "var(--muted-foreground)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 z-50 mt-1.5 rounded-xl overflow-y-auto py-1"
          style={{
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(196,96,122,0.08)",
            maxHeight: "200px",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border) transparent",
          }}
        >
          {options.map((opt) => {
            const selected = opt.value === value;
            const isHovered = hovered === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                data-selected={selected}
                onMouseEnter={() => setHovered(opt.value)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => pick(opt.value)}
                className="w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors"
                style={{
                  background: selected
                    ? "var(--primary)"
                    : isHovered
                    ? "var(--secondary)"
                    : "transparent",
                  color: selected ? "white" : "var(--foreground)",
                  fontWeight: selected ? 600 : 400,
                }}
              >
                <span>{opt.label}</span>
                {selected && <span className="text-xs opacity-80">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── BirthdatePicker ──────────────────────────────────────────────────────────

interface Props {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (value: string) => void;
}

function parseValue(v: string): { day: number | null; month: number | null; year: number | null } {
  if (!v) return { day: null, month: null, year: null };
  const parts = v.split("-").map(Number);
  return {
    year: parts[0] || null,
    month: parts[1] || null,
    day: parts[2] || null,
  };
}

export function BirthdatePicker({ value, onChange }: Props) {
  const initial = parseValue(value);
  const [day, setDay] = useState<number | null>(initial.day);
  const [month, setMonth] = useState<number | null>(initial.month);
  const [year, setYear] = useState<number | null>(initial.year);

  const emit = useCallback(
    (d: number | null, m: number | null, y: number | null) => {
      if (!d || !m || !y) return;
      const clampedDay = Math.min(d, daysInMonth(m, y));
      onChange(
        `${y}-${String(m).padStart(2, "0")}-${String(clampedDay).padStart(2, "0")}`
      );
    },
    [onChange]
  );

  function handleDay(d: number) {
    setDay(d);
    emit(d, month, year);
  }
  function handleMonth(m: number) {
    setMonth(m);
    // clamp day if needed
    const newDay = day && year ? Math.min(day, daysInMonth(m, year)) : day;
    if (newDay !== day) setDay(newDay);
    emit(newDay, m, year);
  }
  function handleYear(y: number) {
    setYear(y);
    const newDay = day && month ? Math.min(day, daysInMonth(month, y)) : day;
    if (newDay !== day) setDay(newDay);
    emit(newDay, month, y);
  }

  const maxDays = daysInMonth(month ?? 1, year ?? 2000);
  const dayOptions = Array.from({ length: maxDays }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));
  const monthOptions = MONTHS.map((m, i) => ({ value: i + 1, label: m }));
  const yearOptions = YEARS.map((y) => ({ value: y, label: String(y) }));

  const allSet = day && month && year;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <Dropdown
          label="Day"
          placeholder="Day"
          value={day}
          options={dayOptions}
          onChange={handleDay}
        />
        <Dropdown
          label="Month"
          placeholder="Month"
          value={month}
          options={monthOptions}
          onChange={handleMonth}
        />
        <Dropdown
          label="Year"
          placeholder="Year"
          value={year}
          options={yearOptions}
          onChange={handleYear}
        />
      </div>

      {/* Completion hint */}
      {!allSet && (day || month || year) && (
        <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
          {!day && "Pick a day · "}
          {!month && "Pick a month · "}
          {!year && "Pick a year"}
        </p>
      )}
    </div>
  );
}
