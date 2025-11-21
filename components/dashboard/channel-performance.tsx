"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockChannels } from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";

type SortField = "revenue" | "roi" | "spend" | "leads" | "roas";
type SortDirection = "asc" | "desc";

export function ChannelPerformance() {
  const [sortField, setSortField] = useState<SortField>("revenue");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedChannels = [...mockChannels].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    return sortDirection === "desc" ? bValue - aValue : aValue - bValue;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getROIBadge = (roi: number) => {
    if (roi >= 1000) return <Badge variant="success">Excellent</Badge>;
    if (roi >= 500) return <Badge variant="secondary">Good</Badge>;
    if (roi >= 0) return <Badge variant="warning">Fair</Badge>;
    return <Badge variant="destructive">Negative</Badge>;
  };

  const chartColors = [
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#06b6d4", // cyan
    "#ec4899", // pink
    "#6366f1", // indigo
  ];

  return (
    <div className="space-y-6">
      {/* Channel Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Channel</CardTitle>
          <CardDescription>
            Compare revenue performance across all marketing channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedChannels} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis
                  type="number"
                  className="text-xs"
                  tick={{ fill: "#64748b" }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  className="text-xs"
                  tick={{ fill: "#64748b" }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                  {sortedChannels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Channel Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Channel Performance Details</CardTitle>
          <CardDescription>
            Detailed breakdown of all marketing channel metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    Channel
                  </th>
                  <th
                    className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => handleSort("spend")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Spend
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => handleSort("leads")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Leads
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => handleSort("revenue")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Revenue
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => handleSort("roi")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      ROI
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => handleSort("roas")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      ROAS
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedChannels.map((channel, index) => (
                  <tr
                    key={channel.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: chartColors[index % chartColors.length] }}
                        />
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {channel.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                      {formatCurrency(channel.spend)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                      {formatNumber(channel.leads)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(channel.revenue)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={
                          channel.roi >= 1000
                            ? "text-green-600 dark:text-green-400 font-semibold"
                            : channel.roi >= 0
                            ? "text-slate-600 dark:text-slate-400"
                            : "text-red-600 dark:text-red-400 font-semibold"
                        }
                      >
                        {formatPercent(channel.roi)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                      {channel.roas.toFixed(2)}x
                    </td>
                    <td className="py-3 px-4 text-center">{getROIBadge(channel.roi)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top & Bottom Performers */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <TrendingUp className="h-5 w-5" />
              Top 3 Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedChannels.slice(0, 3).map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {channel.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatCurrency(channel.revenue)} revenue
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 dark:text-green-400">
                      {formatPercent(channel.roi)}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">ROI</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <TrendingDown className="h-5 w-5" />
              Consider Optimizing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedChannels.slice(-3).reverse().map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {channel.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatCurrency(channel.revenue)} revenue
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600 dark:text-red-400">
                      {formatPercent(channel.roi)}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">ROI</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
