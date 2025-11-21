"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";

type DateRange = {
  from: Date;
  to: Date;
};

type Preset = {
  label: string;
  getValue: () => DateRange;
};

const presets: Preset[] = [
  {
    label: "Last 7 days",
    getValue: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 7);
      return { from, to };
    },
  },
  {
    label: "Last 30 days",
    getValue: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 30);
      return { from, to };
    },
  },
  {
    label: "Last 90 days",
    getValue: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 90);
      return { from, to };
    },
  },
  {
    label: "This month",
    getValue: () => {
      const to = new Date();
      const from = new Date(to.getFullYear(), to.getMonth(), 1);
      return { from, to };
    },
  },
  {
    label: "Last month",
    getValue: () => {
      const to = new Date();
      to.setMonth(to.getMonth() - 1);
      const lastDay = new Date(to.getFullYear(), to.getMonth() + 1, 0);
      const from = new Date(to.getFullYear(), to.getMonth(), 1);
      return { from, to: lastDay };
    },
  },
  {
    label: "This quarter",
    getValue: () => {
      const to = new Date();
      const quarter = Math.floor(to.getMonth() / 3);
      const from = new Date(to.getFullYear(), quarter * 3, 1);
      return { from, to };
    },
  },
  {
    label: "This year",
    getValue: () => {
      const to = new Date();
      const from = new Date(to.getFullYear(), 0, 1);
      return { from, to };
    },
  },
];

type DateRangePickerProps = {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  className?: string;
};

export function DateRangePicker({ value, onChange, className = "" }: DateRangePickerProps) {
  const defaultRange = presets[1].getValue(); // Last 30 days
  const [selectedRange, setSelectedRange] = useState<DateRange>(value || defaultRange);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("Last 30 days");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const formatDateRange = (range: DateRange) => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    return `${formatDate(range.from)} - ${formatDate(range.to)}`;
  };

  const handlePresetClick = (preset: Preset) => {
    const range = preset.getValue();
    setSelectedRange(range);
    setSelectedPreset(preset.label);
    onChange?.(range);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        <span className="text-sm">{selectedPreset}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
          {/* Presets */}
          <div className="p-2">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 py-2">
              Quick Select
            </div>
            <div className="space-y-1">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedPreset === preset.label
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Range (placeholder for future implementation) */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-3">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-3 py-2 rounded text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Custom range...
            </button>
          </div>

          {/* Selected Range Display */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {formatDateRange(selectedRange)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
