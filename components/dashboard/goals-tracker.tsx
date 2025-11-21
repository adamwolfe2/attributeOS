"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle2 } from "lucide-react";

type Goal = {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: "currency" | "number" | "percent";
  period: string;
  status: "on-track" | "at-risk" | "achieved" | "behind";
  trend: number;
};

const mockGoals: Goal[] = [
  {
    id: "1",
    name: "Monthly Revenue",
    target: 800000,
    current: 723000,
    unit: "currency",
    period: "December 2025",
    status: "on-track",
    trend: 12.5,
  },
  {
    id: "2",
    name: "Lead Generation",
    target: 2500,
    current: 2381,
    unit: "number",
    period: "December 2025",
    status: "on-track",
    trend: 8.3,
  },
  {
    id: "3",
    name: "Conversion Rate",
    target: 8.0,
    current: 6.8,
    unit: "percent",
    period: "December 2025",
    status: "at-risk",
    trend: -0.5,
  },
  {
    id: "4",
    name: "Marketing ROI",
    target: 1200,
    current: 1456,
    unit: "percent",
    period: "Q4 2025",
    status: "achieved",
    trend: 15.2,
  },
  {
    id: "5",
    name: "Cost Per Lead",
    target: 50,
    current: 62,
    unit: "currency",
    period: "December 2025",
    status: "behind",
    trend: -8.5,
  },
  {
    id: "6",
    name: "Pipeline Value",
    target: 2000000,
    current: 1850000,
    unit: "currency",
    period: "Q4 2025",
    status: "on-track",
    trend: 22.1,
  },
];

export function GoalsTracker() {
  const getStatusBadge = (status: Goal["status"]) => {
    const config = {
      "on-track": { variant: "success" as const, label: "On Track", icon: CheckCircle2 },
      "at-risk": { variant: "warning" as const, label: "At Risk", icon: AlertTriangle },
      achieved: { variant: "success" as const, label: "Achieved", icon: CheckCircle2 },
      behind: { variant: "destructive" as const, label: "Behind", icon: AlertTriangle },
    };
    const { variant, label, icon: Icon } = config[status];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const formatValue = (value: number, unit: Goal["unit"]) => {
    if (unit === "currency") return formatCurrency(value);
    if (unit === "percent") return `${value.toFixed(1)}%`;
    return formatNumber(value);
  };

  const getProgressColor = (status: Goal["status"]) => {
    switch (status) {
      case "achieved":
        return "bg-green-600";
      case "on-track":
        return "bg-blue-600";
      case "at-risk":
        return "bg-yellow-600";
      case "behind":
        return "bg-red-600";
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Goals Achieved</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {mockGoals.filter((g) => g.status === "achieved").length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              of {mockGoals.length} total goals
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">On Track</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {mockGoals.filter((g) => g.status === "on-track").length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">goals progressing well</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">At Risk</div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {mockGoals.filter((g) => g.status === "at-risk").length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">need attention</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Behind</div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {mockGoals.filter((g) => g.status === "behind").length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">require action</div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Goals</CardTitle>
          <CardDescription>Track progress towards your business objectives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockGoals.map((goal) => {
              const progress = calculateProgress(goal.current, goal.target);
              const isPositiveTrend = goal.trend > 0;

              return (
                <div key={goal.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="h-5 w-5 text-slate-400" />
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          {goal.name}
                        </h4>
                        {getStatusBadge(goal.status)}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 ml-8">
                        {goal.period}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-slate-500 dark:text-slate-400">Progress</div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {progress.toFixed(0)}%
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {isPositiveTrend ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            isPositiveTrend
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {isPositiveTrend ? "+" : ""}
                          {goal.trend.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="ml-8">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">
                        Current: {formatValue(goal.current, goal.unit)}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        Target: {formatValue(goal.target, goal.unit)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                          goal.status
                        )}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
          <CardDescription>AI-powered suggestions to achieve your goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                    Great Progress on Marketing ROI
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    You've exceeded your Q4 ROI target by 21%. Consider reallocating budget from
                    underperforming channels to maximize returns.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                    Conversion Rate Needs Attention
                  </h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Current conversion rate is 15% below target. Focus on lead qualification and
                    nurture campaigns to improve conversion quality.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                    Cost Per Lead Above Target
                  </h4>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    CPL is $12 above target. Review Facebook and LinkedIn campaigns for optimization
                    opportunities. Consider pausing low-performing ad sets.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Pipeline Growth Opportunity
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    You're 92.5% towards your pipeline target. Increase outbound efforts in the next
                    2 weeks to hit your Q4 goal.
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
