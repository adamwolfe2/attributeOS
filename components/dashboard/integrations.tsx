"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  ExternalLink,
  Activity,
  Clock,
} from "lucide-react";

type IntegrationStatus = "connected" | "error" | "warning" | "disconnected";

type Integration = {
  id: string;
  name: string;
  type: "crm" | "analytics" | "ads" | "email" | "phone";
  status: IntegrationStatus;
  lastSync?: string;
  syncFrequency: string;
  recordsSynced?: number;
  errors?: string[];
  icon: string;
};

const mockIntegrations: Integration[] = [
  {
    id: "sf",
    name: "Salesforce",
    type: "crm",
    status: "connected",
    lastSync: "2 minutes ago",
    syncFrequency: "Every 15 minutes",
    recordsSynced: 1247,
    icon: "☁️",
  },
  {
    id: "hs",
    name: "HubSpot",
    type: "crm",
    status: "connected",
    lastSync: "5 minutes ago",
    syncFrequency: "Every 15 minutes",
    recordsSynced: 892,
    icon: "🟠",
  },
  {
    id: "gads",
    name: "Google Ads",
    type: "ads",
    status: "connected",
    lastSync: "1 minute ago",
    syncFrequency: "Every 5 minutes",
    recordsSynced: 3456,
    icon: "🔍",
  },
  {
    id: "fb",
    name: "Facebook Ads",
    type: "ads",
    status: "warning",
    lastSync: "2 hours ago",
    syncFrequency: "Every 5 minutes",
    recordsSynced: 1234,
    errors: ["Rate limit reached - retrying in 30 minutes"],
    icon: "📘",
  },
  {
    id: "linkedin",
    name: "LinkedIn Ads",
    type: "ads",
    status: "connected",
    lastSync: "3 minutes ago",
    syncFrequency: "Every 10 minutes",
    recordsSynced: 567,
    icon: "💼",
  },
  {
    id: "twilio",
    name: "Twilio",
    type: "phone",
    status: "connected",
    lastSync: "30 seconds ago",
    syncFrequency: "Real-time",
    recordsSynced: 89,
    icon: "📞",
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    type: "email",
    status: "error",
    lastSync: "6 hours ago",
    syncFrequency: "Every 5 minutes",
    errors: ["Authentication failed - API key expired"],
    icon: "📧",
  },
  {
    id: "ga",
    name: "Google Analytics",
    type: "analytics",
    status: "connected",
    lastSync: "1 minute ago",
    syncFrequency: "Every 10 minutes",
    recordsSynced: 8934,
    icon: "📊",
  },
];

export function Integrations() {
  const getStatusIcon = (status: IntegrationStatus) => {
    switch (status) {
      case "connected":
        return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case "disconnected":
        return <XCircle className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: IntegrationStatus) => {
    const variants: Record<IntegrationStatus, "success" | "destructive" | "warning" | "secondary"> = {
      connected: "success",
      error: "destructive",
      warning: "warning",
      disconnected: "secondary",
    };

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const statusCounts = {
    connected: mockIntegrations.filter((i) => i.status === "connected").length,
    error: mockIntegrations.filter((i) => i.status === "error").length,
    warning: mockIntegrations.filter((i) => i.status === "warning").length,
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Total Integrations
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {mockIntegrations.length}
                </div>
              </div>
              <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Connected
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {statusCounts.connected}
                </div>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Warnings
                </div>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {statusCounts.warning}
                </div>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Errors
                </div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {statusCounts.error}
                </div>
              </div>
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Integrations</CardTitle>
              <CardDescription>
                Monitor and manage your connected services
              </CardDescription>
            </div>
            <Button>
              <ExternalLink className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{integration.icon}</div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {integration.name}
                        </h3>
                        {getStatusBadge(integration.status)}
                        {getStatusIcon(integration.status)}
                      </div>

                      <div className="grid gap-3 md:grid-cols-3 text-sm">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last Sync
                          </div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {integration.lastSync || "Never"}
                          </div>
                        </div>

                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-1">
                            Sync Frequency
                          </div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {integration.syncFrequency}
                          </div>
                        </div>

                        {integration.recordsSynced !== undefined && (
                          <div>
                            <div className="text-slate-500 dark:text-slate-400 mb-1">
                              Records Synced
                            </div>
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                              {integration.recordsSynced.toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>

                      {integration.errors && integration.errors.length > 0 && (
                        <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                          {integration.errors.map((error, idx) => (
                            <div
                              key={idx}
                              className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2"
                            >
                              <AlertCircle className="h-4 w-4 flex-shrink-0" />
                              {error}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync Now
                      </Button>
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sync Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sync Activity</CardTitle>
          <CardDescription>Last 10 synchronization events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { integration: "Google Ads", action: "Synced 234 clicks", time: "1 min ago", status: "success" },
              { integration: "Salesforce", action: "Synced 12 new leads", time: "2 min ago", status: "success" },
              { integration: "HubSpot", action: "Updated 45 contacts", time: "5 min ago", status: "success" },
              { integration: "Facebook Ads", action: "Rate limit reached", time: "2 hours ago", status: "warning" },
              { integration: "LinkedIn Ads", action: "Synced 67 impressions", time: "3 min ago", status: "success" },
              { integration: "SendGrid", action: "Auth failed", time: "6 hours ago", status: "error" },
            ].map((event, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {event.status === "success" && (
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                )}
                {event.status === "warning" && (
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                )}
                {event.status === "error" && (
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {event.integration}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {event.action}
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {event.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
