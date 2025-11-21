"use client";

import { StatCard } from "./stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { mockSummaryStats, mockMonthlyTrend } from "@/lib/mock-data";
import { calculateROI } from "@/lib/utils";

export function ExecutiveSummary() {
  const totalROI = calculateROI(
    mockSummaryStats.totalRevenue,
    mockSummaryStats.totalSpend
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={mockSummaryStats.totalRevenue}
          format="currency"
          change={12.5}
          changeLabel="vs last month"
          icon={<DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        />
        <StatCard
          title="Marketing Spend"
          value={mockSummaryStats.totalSpend}
          format="currency"
          change={5.2}
          changeLabel="vs last month"
          icon={<TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
        />
        <StatCard
          title="Total Leads"
          value={mockSummaryStats.totalLeads}
          format="number"
          change={18.3}
          changeLabel="vs last month"
          icon={<Users className="h-6 w-6 text-green-600 dark:text-green-400" />}
        />
        <StatCard
          title="Overall ROI"
          value={totalROI}
          format="percent"
          change={7.1}
          changeLabel="vs last month"
          icon={<Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
        />
      </div>

      {/* Revenue & Spend Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Spend Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockMonthlyTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    "",
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSpend)"
                  name="Spend"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Lead Generation Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Generation Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockMonthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: "#64748b" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "#64748b" }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [value.toLocaleString(), "Leads"]}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
