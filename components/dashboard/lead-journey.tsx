"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockLeads, type Touchpoint } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  MousePointerClick,
  Eye,
  Mail,
  Phone,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
} from "lucide-react";

const touchpointIcons: Record<string, React.ReactNode> = {
  click: <MousePointerClick className="h-4 w-4" />,
  pageview: <Eye className="h-4 w-4" />,
  email_click: <Mail className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
  form_submit: <FileText className="h-4 w-4" />,
};

const touchpointColors: Record<string, string> = {
  click: "bg-blue-500",
  pageview: "bg-purple-500",
  email_click: "bg-green-500",
  call: "bg-orange-500",
  form_submit: "bg-red-500",
};

const touchpointLabels: Record<string, string> = {
  click: "Ad Click",
  pageview: "Page View",
  email_click: "Email Click",
  call: "Phone Call",
  form_submit: "Form Submitted",
};

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calculateTimeBetween(timestamp1: string, timestamp2: string): string {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  const diffMs = date2.getTime() - date1.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} later`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} later`;
  if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? "s" : ""} later`;
  return "moments later";
}

export function LeadJourney() {
  const [selectedLead] = useState(mockLeads[0]);

  const journeyDays = selectedLead.closedDate
    ? Math.floor(
        (new Date(selectedLead.closedDate).getTime() -
          new Date(selectedLead.firstTouch.timestamp).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Lead Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Lead Journey: {selectedLead.company}</CardTitle>
              <CardDescription className="mt-2">
                {selectedLead.email} • {selectedLead.touchpoints.length} touchpoints •{" "}
                {journeyDays} day journey
              </CardDescription>
            </div>
            <Badge
              variant={
                selectedLead.status === "closed_won"
                  ? "success"
                  : selectedLead.status === "closed_lost"
                  ? "destructive"
                  : "secondary"
              }
            >
              {selectedLead.status.replace(/_/g, " ").toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Deal Value</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(selectedLead.value)}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                <MousePointerClick className="h-4 w-4" />
                <span className="text-sm font-medium">First Touch</span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 capitalize">
                {selectedLead.firstTouch.source.replace(/_/g, " ")}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {selectedLead.firstTouch.campaign}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Last Touch</span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 capitalize">
                {selectedLead.lastTouch.source.replace(/_/g, " ")}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {selectedLead.lastTouch.campaign}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Journey Timeline</CardTitle>
          <CardDescription>
            Every touchpoint from first interaction to conversion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

            {/* Timeline items */}
            <div className="space-y-6">
              {selectedLead.touchpoints.map((touchpoint, index) => (
                <div key={touchpoint.id} className="relative pl-14">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-3.5 top-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 ${
                      touchpointColors[touchpoint.type]
                    }`}
                  />

                  {/* Time between touchpoints */}
                  {index > 0 && (
                    <div className="absolute left-16 -top-5 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {calculateTimeBetween(
                        selectedLead.touchpoints[index - 1].timestamp,
                        touchpoint.timestamp
                      )}
                    </div>
                  )}

                  {/* Touchpoint card */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-md ${touchpointColors[touchpoint.type]} text-white`}
                        >
                          {touchpointIcons[touchpoint.type]}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                            {touchpointLabels[touchpoint.type]}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                            {touchpoint.source.replace(/_/g, " ")}
                            {touchpoint.campaign && ` • ${touchpoint.campaign}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">{formatTimestamp(touchpoint.timestamp)}</span>
                      </div>
                    </div>
                    {touchpoint.url && (
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded truncate">
                        {touchpoint.url}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Conversion Event */}
              {selectedLead.status === "closed_won" && (
                <div className="relative pl-14">
                  <div className="absolute left-3.5 top-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 bg-green-500 animate-pulse" />

                  {selectedLead.closedDate && selectedLead.touchpoints.length > 0 && (
                    <div className="absolute left-16 -top-5 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {calculateTimeBetween(
                        selectedLead.touchpoints[selectedLead.touchpoints.length - 1].timestamp,
                        selectedLead.closedDate
                      )}
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-500 dark:border-green-600 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-md bg-green-500 text-white">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-green-900 dark:text-green-100">
                          Deal Closed Won! 🎉
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {formatCurrency(selectedLead.value)} revenue
                        </p>
                      </div>
                    </div>
                    {selectedLead.closedDate && (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>{formatTimestamp(selectedLead.closedDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Touchpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {selectedLead.touchpoints.length}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              interactions before conversion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Journey Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {journeyDays}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              days from first touch to close
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Unique Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {new Set(selectedLead.touchpoints.map((tp) => tp.source)).size}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              different marketing channels
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
