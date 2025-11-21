"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockLeads, calculateAttributionBreakdown, type AttributionModel } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const attributionModels: { id: AttributionModel; name: string; description: string }[] = [
  {
    id: "first_touch",
    name: "First Touch",
    description: "100% credit to the first marketing touchpoint",
  },
  {
    id: "last_touch",
    name: "Last Touch",
    description: "100% credit to the last touchpoint before conversion",
  },
  {
    id: "linear",
    name: "Linear",
    description: "Equal credit distributed across all touchpoints",
  },
  {
    id: "time_decay",
    name: "Time Decay",
    description: "More credit to recent touchpoints (7-day half-life)",
  },
  {
    id: "u_shaped",
    name: "U-Shaped",
    description: "40% first, 40% last, 20% middle touchpoints",
  },
];

export function AttributionModels() {
  const [selectedModel, setSelectedModel] = useState<AttributionModel>("linear");

  // Calculate attribution for each model
  const attributionData = attributionModels.map((model) => {
    const breakdown = calculateAttributionBreakdown(mockLeads[0], model.id);
    return {
      model: model.name,
      ...breakdown.channels.reduce((acc, channel) => {
        acc[channel.source] = channel.credit;
        return acc;
      }, {} as Record<string, number>),
    };
  });

  // Get unique sources
  const sources = Array.from(
    new Set(
      attributionModels.flatMap((model) =>
        calculateAttributionBreakdown(mockLeads[0], model.id).channels.map((c) => c.source)
      )
    )
  );

  // Prepare radar chart data
  const radarData = sources.map((source) => {
    const dataPoint: any = { source };
    attributionModels.forEach((model) => {
      const breakdown = calculateAttributionBreakdown(mockLeads[0], model.id);
      const channel = breakdown.channels.find((c) => c.source === source);
      dataPoint[model.name] = channel ? channel.percentage : 0;
    });
    return dataPoint;
  });

  // Get selected model breakdown
  const selectedBreakdown = calculateAttributionBreakdown(mockLeads[0], selectedModel);

  const sourceColors: Record<string, string> = {
    google_ads: "#3b82f6",
    email: "#10b981",
    organic: "#8b5cf6",
    linkedin: "#0077b5",
    facebook: "#1877f2",
    content: "#f59e0b",
    referral: "#ec4899",
    events: "#06b6d4",
  };

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Attribution Model Comparison</CardTitle>
          <CardDescription>
            See how different attribution models credit revenue to marketing channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {attributionModels.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-4 text-left rounded-lg border-2 transition-all hover:border-blue-400 ${
                  selectedModel === model.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {model.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {model.description}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Model Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>
            {attributionModels.find((m) => m.id === selectedModel)?.name} Attribution
          </CardTitle>
          <CardDescription>Revenue credit distribution for this model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedBreakdown.channels
              .sort((a, b) => b.credit - a.credit)
              .map((channel) => (
                <div key={channel.source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: sourceColors[channel.source] || "#64748b" }}
                      />
                      <span className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                        {channel.source.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {channel.percentage.toFixed(1)}%
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 min-w-[100px] text-right">
                        {formatCurrency(channel.credit)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${channel.percentage}%`,
                        backgroundColor: sourceColors[channel.source] || "#64748b",
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Model Comparison Chart</CardTitle>
          <CardDescription>Compare revenue attribution across all models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attributionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis
                  dataKey="model"
                  className="text-xs"
                  tick={{ fill: "#64748b" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "#64748b" }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [formatCurrency(value), ""]}
                />
                <Legend />
                {sources.map((source) => (
                  <Bar
                    key={source}
                    dataKey={source}
                    stackId="a"
                    fill={sourceColors[source] || "#64748b"}
                    name={source.replace(/_/g, " ")}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Attribution Model Radar</CardTitle>
          <CardDescription>
            Visualize how each model distributes credit by percentage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid className="stroke-slate-200 dark:stroke-slate-700" />
                <PolarAngleAxis
                  dataKey="source"
                  className="text-xs"
                  tick={{ fill: "#64748b" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  className="text-xs"
                  tick={{ fill: "#64748b" }}
                />
                <Radar
                  name="First Touch"
                  dataKey="First Touch"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Last Touch"
                  dataKey="Last Touch"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Linear"
                  dataKey="Linear"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Time Decay"
                  dataKey="Time Decay"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                />
                <Radar
                  name="U-Shaped"
                  dataKey="U-Shaped"
                  stroke="#ec4899"
                  fill="#ec4899"
                  fillOpacity={0.3}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
