"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { mockMonthlyTrend, mockChannels } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, ArrowUpDown, BarChart3, LineChart as LineChartIcon, Activity } from "lucide-react";

type MetricType = "revenue" | "spend" | "leads" | "roi" | "roas" | "conversions";
type ChartType = "line" | "bar" | "radar";

type Metric = {
  id: MetricType;
  label: string;
  color: string;
  format: "currency" | "number" | "percent";
};

const availableMetrics: Metric[] = [
  { id: "revenue", label: "Revenue", color: "#3b82f6", format: "currency" },
  { id: "spend", label: "Spend", color: "#ef4444", format: "currency" },
  { id: "leads", label: "Leads", color: "#10b981", format: "number" },
  { id: "roi", label: "ROI", color: "#f59e0b", format: "percent" },
  { id: "roas", label: "ROAS", color: "#8b5cf6", format: "number" },
  { id: "conversions", label: "Conversions", color: "#ec4899", format: "number" },
];

export function MetricsComparison() {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(["revenue", "spend", "leads"]);
  const [chartType, setChartType] = useState<ChartType>("line");

  const toggleMetric = (metricId: MetricType) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metricId));
    } else {
      if (selectedMetrics.length < 4) {
        setSelectedMetrics([...selectedMetrics, metricId]);
      }
    }
  };

  // Calculate derived metrics
  const enhancedData = mockMonthlyTrend.map((d) => ({
    ...d,
    roi: ((d.revenue - d.spend) / d.spend) * 100,
    roas: d.revenue / d.spend,
    conversions: Math.round(d.leads * 0.065), // Assuming 6.5% conversion rate
  }));

  // Prepare comparison stats
  const comparisonStats = selectedMetrics.map((metricId) => {
    const metric = availableMetrics.find((m) => m.id === metricId)!;
    const currentValue = enhancedData[enhancedData.length - 1][metricId];
    const previousValue = enhancedData[enhancedData.length - 2][metricId];
    const change = ((currentValue - previousValue) / previousValue) * 100;

    return {
      metric,
      current: currentValue,
      previous: previousValue,
      change,
    };
  });

  // Prepare radar chart data
  const latestData = enhancedData[enhancedData.length - 1];
  const radarData = selectedMetrics.map((metricId) => {
    const metric = availableMetrics.find((m) => m.id === metricId)!;
    const value = latestData[metricId];

    // Normalize values to 0-100 scale for radar chart
    const maxValues = {
      revenue: 1000000,
      spend: 50000,
      leads: 3000,
      roi: 2000,
      roas: 20,
      conversions: 200,
    };

    const normalized = (value / maxValues[metricId]) * 100;

    return {
      metric: metric.label,
      value: Math.min(normalized, 100),
      fullValue: value,
    };
  });

  const formatValue = (value: number, format: "currency" | "number" | "percent") => {
    if (format === "currency") return formatCurrency(value);
    if (format === "percent") return formatPercent(value);
    return formatNumber(value);
  };

  return (
    <div className="space-y-6">
      {/* Metric Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Metrics to Compare</CardTitle>
          <CardDescription>Choose up to 4 metrics for comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableMetrics.map((metric) => {
              const isSelected = selectedMetrics.includes(metric.id);
              return (
                <button
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  disabled={!isSelected && selectedMetrics.length >= 4}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                  } ${!isSelected && selectedMetrics.length >= 4 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: metric.color }}
                    />
                    <span className="font-medium">{metric.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {comparisonStats.map(({ metric, current, change }) => (
          <Card key={metric.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: metric.color }}
                />
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {metric.label}
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatValue(current, metric.format)}
              </div>
              <div className="flex items-center gap-1 mt-2">
                {change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    change > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {change > 0 ? "+" : ""}
                  {change.toFixed(1)}%
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Type Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Metrics Comparison Chart</CardTitle>
              <CardDescription>Visualize trends across selected metrics</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={chartType === "line" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("line")}
              >
                <LineChartIcon className="h-4 w-4 mr-2" />
                Line
              </Button>
              <Button
                variant={chartType === "bar" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("bar")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Bar
              </Button>
              <Button
                variant={chartType === "radar" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("radar")}
              >
                <Activity className="h-4 w-4 mr-2" />
                Radar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            {chartType === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enhancedData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "#64748b" }} />
                  <YAxis className="text-xs" tick={{ fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  {selectedMetrics.map((metricId) => {
                    const metric = availableMetrics.find((m) => m.id === metricId)!;
                    return (
                      <Line
                        key={metricId}
                        type="monotone"
                        dataKey={metricId}
                        stroke={metric.color}
                        strokeWidth={3}
                        dot={{ fill: metric.color, r: 4 }}
                        name={metric.label}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            )}

            {chartType === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enhancedData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "#64748b" }} />
                  <YAxis className="text-xs" tick={{ fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  {selectedMetrics.map((metricId) => {
                    const metric = availableMetrics.find((m) => m.id === metricId)!;
                    return (
                      <Bar
                        key={metricId}
                        dataKey={metricId}
                        fill={metric.color}
                        name={metric.label}
                      />
                    );
                  })}
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartType === "radar" && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#64748b" }} />
                  <Radar
                    name="Current Performance"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string, props: any) => {
                      const metricData = radarData.find((d) => d.metric === props.payload.metric);
                      if (metricData) {
                        return [formatNumber(metricData.fullValue), "Value"];
                      }
                      return [value.toFixed(1) + "%", "Normalized"];
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>AI-powered analysis of your metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comparisonStats.map(({ metric, change }) => {
              const isPositive = change > 0;
              const intensity = Math.abs(change) > 15 ? "strong" : Math.abs(change) > 5 ? "moderate" : "slight";

              return (
                <div
                  key={metric.id}
                  className={`p-4 rounded-lg border ${
                    isPositive
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        isPositive
                          ? "bg-green-100 dark:bg-green-900/40"
                          : "bg-red-100 dark:bg-red-900/40"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className={`h-5 w-5 text-green-600 dark:text-green-400`} />
                      ) : (
                        <TrendingDown className={`h-5 w-5 text-red-600 dark:text-red-400`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-semibold mb-1 ${
                          isPositive
                            ? "text-green-900 dark:text-green-100"
                            : "text-red-900 dark:text-red-100"
                        }`}
                      >
                        {metric.label} shows {intensity} {isPositive ? "growth" : "decline"}
                      </h4>
                      <p
                        className={`text-sm ${
                          isPositive
                            ? "text-green-800 dark:text-green-200"
                            : "text-red-800 dark:text-red-200"
                        }`}
                      >
                        {metric.label} {isPositive ? "increased" : "decreased"} by{" "}
                        {Math.abs(change).toFixed(1)}% compared to the previous period.
                        {intensity === "strong" &&
                          ` This is a significant ${isPositive ? "improvement" : "concern"} that requires attention.`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
