"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { cn, formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { Sparkline } from "@/components/ui/sparkline";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  format?: "currency" | "number" | "percent" | "text";
  sparklineData?: number[];
  sparklineColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  format = "text",
  sparklineData,
  sparklineColor,
}: StatCardProps) {
  const formattedValue =
    format === "currency"
      ? formatCurrency(Number(value))
      : format === "number"
      ? formatNumber(Number(value))
      : format === "percent"
      ? formatPercent(Number(value))
      : value;

  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-3xl font-bold tracking-tight">
                {formattedValue}
              </h3>
            </div>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {isPositive && (
                  <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                )}
                {isNegative && (
                  <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    isPositive && "text-green-600 dark:text-green-400",
                    isNegative && "text-red-600 dark:text-red-400",
                    !isPositive && !isNegative && "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {formatPercent(change)}
                </span>
                {changeLabel && (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {changeLabel}
                  </span>
                )}
              </div>
            )}
            {sparklineData && sparklineData.length > 0 && (
              <div className="mt-4">
                <Sparkline
                  data={sparklineData}
                  color={sparklineColor || "#3b82f6"}
                  height={32}
                />
              </div>
            )}
          </div>
          {icon && (
            <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
