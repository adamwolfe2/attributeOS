"use client";

import { useState } from "react";
import { ExecutiveSummary } from "@/components/dashboard/executive-summary";
import { ChannelPerformance } from "@/components/dashboard/channel-performance";
import { AttributionModels } from "@/components/dashboard/attribution-models";
import { LeadJourney } from "@/components/dashboard/lead-journey";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { Campaigns } from "@/components/dashboard/campaigns";
import { Integrations } from "@/components/dashboard/integrations";
import { GoalsTracker } from "@/components/dashboard/goals-tracker";
import { ConversionFunnel } from "@/components/dashboard/conversion-funnel";
import { Forecast } from "@/components/dashboard/forecast";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLoading } from "@/hooks/use-loading";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationsDropdown } from "@/components/header/notifications-dropdown";
import { UserMenu } from "@/components/header/user-menu";
import {
  LayoutDashboard,
  BarChart3,
  GitBranch,
  Route,
  Settings,
  Bell,
  User,
  Calendar,
  Download,
  Users,
  Target,
  Zap,
  Trophy,
  Filter,
  TrendingUp,
} from "lucide-react";

type Tab = "overview" | "channels" | "campaigns" | "leads" | "goals" | "integrations" | "attribution" | "journey" | "funnel" | "forecast";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const isLoading = useLoading(800);

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: LayoutDashboard },
    { id: "channels" as Tab, label: "Channels", icon: BarChart3 },
    { id: "campaigns" as Tab, label: "Campaigns", icon: Target },
    { id: "leads" as Tab, label: "All Leads", icon: Users },
    { id: "funnel" as Tab, label: "Conversion Funnel", icon: Filter },
    { id: "forecast" as Tab, label: "Forecast", icon: TrendingUp },
    { id: "goals" as Tab, label: "Goals", icon: Trophy },
    { id: "integrations" as Tab, label: "Integrations", icon: Zap },
    { id: "attribution" as Tab, label: "Attribution", icon: GitBranch },
    { id: "journey" as Tab, label: "Lead Journey", icon: Route },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 shadow-sm">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                AttributeOS
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lead Attribution Platform
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Select className="w-[180px]" defaultValue="last30">
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="custom">Custom range</option>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <div className="flex items-center gap-2 ml-2">
              <ThemeToggle />
              <NotificationsDropdown />
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Stats Sidebar */}
          <div className="p-4 mt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Active Campaigns</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">24</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tracking Links</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">1,247</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Conv. Rate</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">6.8%</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {activeTab === "overview" &&
                  "Get a high-level view of your marketing performance and ROI"}
                {activeTab === "channels" &&
                  "Analyze performance across all marketing channels"}
                {activeTab === "campaigns" &&
                  "Manage and track your marketing campaigns"}
                {activeTab === "leads" &&
                  "View, search, and manage all leads in your pipeline"}
                {activeTab === "funnel" &&
                  "Visualize conversion rates and drop-offs at each stage of your sales pipeline"}
                {activeTab === "forecast" &&
                  "AI-powered predictions and projections for revenue and lead generation"}
                {activeTab === "goals" &&
                  "Track progress towards your business objectives and KPIs"}
                {activeTab === "integrations" &&
                  "Monitor and manage your connected services and data syncs"}
                {activeTab === "attribution" &&
                  "Compare different attribution models to understand channel value"}
                {activeTab === "journey" &&
                  "Track individual lead journeys from first touch to conversion"}
              </p>
            </div>

            {/* Tab Content */}
            {isLoading ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <Skeleton className="h-4 w-24 mb-4" />
                      <Skeleton className="h-8 w-32 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <Skeleton className="h-[350px] w-full" />
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                {activeTab === "overview" && <ExecutiveSummary />}
                {activeTab === "channels" && <ChannelPerformance />}
                {activeTab === "campaigns" && <Campaigns />}
                {activeTab === "leads" && <LeadsTable />}
                {activeTab === "funnel" && <ConversionFunnel />}
                {activeTab === "forecast" && <Forecast />}
                {activeTab === "goals" && <GoalsTracker />}
                {activeTab === "integrations" && <Integrations />}
                {activeTab === "attribution" && <AttributionModels />}
                {activeTab === "journey" && <LeadJourney />}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <p>© 2025 AttributeOS. All rights reserved.</p>
          <p>
            Proving ROI with mathematical certainty • Last synced:{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </footer>
    </div>
  );
}
