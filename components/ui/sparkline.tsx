"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

type SparklineProps = {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
};

export function Sparkline({ data, color = "#3b82f6", height = 40, className = "" }: SparklineProps) {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <div className={className} style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
