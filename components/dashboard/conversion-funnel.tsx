"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatPercent } from "@/lib/utils";
import { TrendingDown, Users, DollarSign } from "lucide-react";

type FunnelStage = {
  id: string;
  name: string;
  count: number;
  value: number;
  color: string;
};

const mockFunnelData: FunnelStage[] = [
  {
    id: "visitors",
    name: "Website Visitors",
    count: 45230,
    value: 0,
    color: "#3b82f6",
  },
  {
    id: "leads",
    name: "Marketing Qualified Leads",
    count: 3856,
    value: 0,
    color: "#8b5cf6",
  },
  {
    id: "sql",
    name: "Sales Qualified Leads",
    count: 1247,
    value: 0,
    color: "#10b981",
  },
  {
    id: "opportunities",
    name: "Opportunities",
    count: 583,
    value: 1850000,
    color: "#f59e0b",
  },
  {
    id: "customers",
    name: "Customers",
    count: 164,
    value: 723000,
    color: "#22c55e",
  },
];

export function ConversionFunnel() {
  const calculateConversionRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return (current / previous) * 100;
  };

  const calculateDropOff = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((previous - current) / previous) * 100;
  };

  const totalConversionRate = calculateConversionRate(
    mockFunnelData[mockFunnelData.length - 1].count,
    mockFunnelData[0].count
  );

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              Overall Conversion Rate
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {totalConversionRate.toFixed(2)}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Visitor to Customer
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              Active Opportunities
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {formatNumber(mockFunnelData[3].count)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ${formatNumber(mockFunnelData[3].value)} pipeline value
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              New Customers
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatNumber(mockFunnelData[4].count)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ${formatNumber(mockFunnelData[4].value)} closed revenue
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>
            Track leads through each stage of the sales pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockFunnelData.map((stage, index) => {
              const previousStage = index > 0 ? mockFunnelData[index - 1] : null;
              const conversionRate = previousStage
                ? calculateConversionRate(stage.count, previousStage.count)
                : 100;
              const dropOffRate = previousStage
                ? calculateDropOff(stage.count, previousStage.count)
                : 0;

              // Calculate width as percentage of first stage
              const widthPercent = (stage.count / mockFunnelData[0].count) * 100;

              return (
                <div key={stage.id} className="space-y-2">
                  {/* Stage Bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div
                        className="h-20 rounded-lg flex items-center justify-between px-6 transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          backgroundColor: stage.color,
                          width: `${Math.max(widthPercent, 15)}%`,
                        }}
                      >
                        <div className="text-white">
                          <div className="font-semibold text-lg">{stage.name}</div>
                          <div className="text-sm opacity-90">
                            {formatNumber(stage.count)} leads
                            {stage.value > 0 && ` • $${formatNumber(stage.value)}`}
                          </div>
                        </div>
                        {index > 0 && (
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            {conversionRate.toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats on the right */}
                    <div className="w-48 text-right">
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {formatNumber(stage.count)}
                      </div>
                      {previousStage && (
                        <div className="flex items-center justify-end gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <TrendingDown className="h-3 w-3 text-red-500" />
                          <span>{dropOffRate.toFixed(1)}% drop-off</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Connector */}
                  {index < mockFunnelData.length - 1 && (
                    <div className="flex items-center gap-2 ml-12">
                      <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-600" />
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {formatNumber(previousStage ? stage.count : mockFunnelData[0].count - mockFunnelData[1].count)} converted →
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stage Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Top of Funnel Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                    Visitor to MQL Conversion
                  </h4>
                  <Badge variant="secondary">
                    {calculateConversionRate(mockFunnelData[1].count, mockFunnelData[0].count).toFixed(2)}%
                  </Badge>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {formatNumber(mockFunnelData[1].count)} of {formatNumber(mockFunnelData[0].count)} visitors became marketing qualified leads.
                  Industry average: 2.5%
                </p>
              </div>

              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                    MQL to SQL Quality
                  </h4>
                  <Badge variant="secondary">
                    {calculateConversionRate(mockFunnelData[2].count, mockFunnelData[1].count).toFixed(2)}%
                  </Badge>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Lead qualification rate is strong. {formatNumber(mockFunnelData[2].count)} SQLs from {formatNumber(mockFunnelData[1].count)} MQLs.
                  Consider scaling top-funnel efforts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Bottom of Funnel Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100">
                    SQL to Opportunity
                  </h4>
                  <Badge variant="secondary">
                    {calculateConversionRate(mockFunnelData[3].count, mockFunnelData[2].count).toFixed(2)}%
                  </Badge>
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {formatNumber(mockFunnelData[3].count)} opportunities created from {formatNumber(mockFunnelData[2].count)} SQLs.
                  Pipeline value: ${formatNumber(mockFunnelData[3].value)}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-green-900 dark:text-green-100">
                    Win Rate
                  </h4>
                  <Badge variant="success">
                    {calculateConversionRate(mockFunnelData[4].count, mockFunnelData[3].count).toFixed(2)}%
                  </Badge>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Excellent close rate! {formatNumber(mockFunnelData[4].count)} customers from {formatNumber(mockFunnelData[3].count)} opportunities.
                  Closed revenue: ${formatNumber(mockFunnelData[4].value)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
