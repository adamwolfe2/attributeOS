"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, AlertCircle, Target, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { mockMonthlyTrend } from "@/lib/mock-data";

type ForecastData = {
  month: string;
  revenue: number;
  leads: number;
  isProjected: boolean;
  revenueMin?: number;
  revenueMax?: number;
};

// Simple linear regression for forecasting
function linearRegression(data: number[]): { slope: number; intercept: number } {
  const n = data.length;
  const sumX = data.reduce((sum, _, i) => sum + i, 0);
  const sumY = data.reduce((sum, val) => sum + val, 0);
  const sumXY = data.reduce((sum, val, i) => sum + i * val, 0);
  const sumXX = data.reduce((sum, _, i) => sum + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

function generateForecast(historicalData: typeof mockMonthlyTrend, monthsAhead: number): ForecastData[] {
  const revenueValues = historicalData.map(d => d.revenue);
  const leadValues = historicalData.map(d => d.leads);

  const revenueRegression = linearRegression(revenueValues);
  const leadRegression = linearRegression(leadValues);

  // Combine historical and projected data
  const combinedData: ForecastData[] = historicalData.map((d, i) => ({
    month: d.month,
    revenue: d.revenue,
    leads: d.leads,
    isProjected: false,
  }));

  const futureMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  for (let i = 0; i < monthsAhead; i++) {
    const index = historicalData.length + i;
    const projectedRevenue = revenueRegression.slope * index + revenueRegression.intercept;
    const projectedLeads = leadRegression.slope * index + leadRegression.intercept;

    // Calculate confidence interval (±10% for demonstration)
    const revenueMargin = projectedRevenue * 0.1;

    combinedData.push({
      month: futureMonths[i] || `M${i + 1}`,
      revenue: Math.round(projectedRevenue),
      leads: Math.round(projectedLeads),
      isProjected: true,
      revenueMin: Math.round(projectedRevenue - revenueMargin),
      revenueMax: Math.round(projectedRevenue + revenueMargin),
    });
  }

  return combinedData;
}

export function Forecast() {
  const forecastData = generateForecast(mockMonthlyTrend, 6);
  const historicalCount = mockMonthlyTrend.length;
  const projectedData = forecastData.slice(historicalCount);

  // Calculate growth rates
  const lastHistorical = mockMonthlyTrend[mockMonthlyTrend.length - 1];
  const lastProjected = projectedData[projectedData.length - 1];
  const revenueGrowth = ((lastProjected.revenue - lastHistorical.revenue) / lastHistorical.revenue) * 100;
  const leadGrowth = ((lastProjected.leads - lastHistorical.leads) / lastHistorical.leads) * 100;

  return (
    <div className="space-y-6">
      {/* Forecast Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div className="text-sm text-slate-500 dark:text-slate-400">
                6-Month Revenue Projection
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(lastProjected.revenue)}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                +{revenueGrowth.toFixed(1)}%
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Projected Total Leads
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {formatNumber(lastProjected.leads)}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                +{leadGrowth.toFixed(1)}%
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Forecast Confidence
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              90%
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Based on 6 months historical data
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Forecast</CardTitle>
          <CardDescription>
            Historical data and 6-month projection with confidence interval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <defs>
                  <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis
                  dataKey="month"
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
                  formatter={(value: number, name: string) => {
                    if (name === "revenueMin" || name === "revenueMax") return null;
                    return [formatCurrency(value), name === "revenue" ? "Revenue" : ""];
                  }}
                  labelFormatter={(label: string) => label}
                />
                <Legend />
                <ReferenceLine
                  x={mockMonthlyTrend[mockMonthlyTrend.length - 1].month}
                  stroke="#64748b"
                  strokeDasharray="3 3"
                  label={{ value: "Forecast Start", position: "top", fill: "#64748b" }}
                />

                {/* Confidence interval area */}
                <Line
                  type="monotone"
                  dataKey="revenueMax"
                  stroke="none"
                  fill="url(#confidenceGradient)"
                  fillOpacity={0.3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="revenueMin"
                  stroke="none"
                  fill="url(#confidenceGradient)"
                  fillOpacity={0.3}
                  dot={false}
                />

                {/* Main revenue line */}
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    const isProjected = (payload as ForecastData).isProjected;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={isProjected ? "#93c5fd" : "#3b82f6"}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    );
                  }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Lead Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Generation Forecast</CardTitle>
          <CardDescription>
            Projected lead volume for the next 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: "#64748b" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "#64748b" }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [formatNumber(value), "Leads"]}
                  labelFormatter={(label: string) => label}
                />
                <ReferenceLine
                  x={mockMonthlyTrend[mockMonthlyTrend.length - 1].month}
                  stroke="#64748b"
                  strokeDasharray="3 3"
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    const isProjected = (payload as ForecastData).isProjected;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={isProjected ? "#86efac" : "#10b981"}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Forecast Insights</CardTitle>
          <CardDescription>AI-powered recommendations based on projections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Strong Growth Trajectory
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Based on current trends, you're on track to reach {formatCurrency(lastProjected.revenue)} in revenue
                    by {lastProjected.month}. This represents a {revenueGrowth.toFixed(1)}% increase from current levels.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div className="flex gap-3">
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                    Lead Volume Increasing
                  </h4>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    Projected lead generation shows steady growth to {formatNumber(lastProjected.leads)} leads.
                    Ensure your sales team has capacity to handle the increased volume.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                    Forecast Assumptions
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Projections assume current marketing spend and conversion rates remain consistent.
                    Actual results may vary based on market conditions and strategy changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
