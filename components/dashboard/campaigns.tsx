"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  DollarSign,
  Users,
  MousePointerClick,
} from "lucide-react";

type Campaign = {
  id: string;
  name: string;
  channel: string;
  status: "active" | "paused" | "completed";
  budget: number;
  spent: number;
  clicks: number;
  leads: number;
  revenue: number;
  startDate: string;
  endDate?: string;
  cpa: number;
  roas: number;
};

const mockCampaigns: Campaign[] = [
  {
    id: "camp_1",
    name: "Q1 Enterprise Lead Gen",
    channel: "Google Ads",
    status: "active",
    budget: 25000,
    spent: 18750,
    clicks: 3456,
    leads: 234,
    revenue: 185000,
    startDate: "2025-01-01",
    cpa: 80.13,
    roas: 9.87,
  },
  {
    id: "camp_2",
    name: "LinkedIn Decision Maker Campaign",
    channel: "LinkedIn",
    status: "active",
    budget: 15000,
    spent: 11200,
    clicks: 1234,
    leads: 89,
    revenue: 125000,
    startDate: "2025-01-05",
    cpa: 125.84,
    roas: 11.16,
  },
  {
    id: "camp_3",
    name: "Retargeting - Website Visitors",
    channel: "Facebook",
    status: "active",
    budget: 8000,
    spent: 6800,
    clicks: 4567,
    leads: 167,
    revenue: 45000,
    startDate: "2025-01-10",
    cpa: 40.72,
    roas: 6.62,
  },
  {
    id: "camp_4",
    name: "Content Syndication - Whitepaper",
    channel: "Content",
    status: "active",
    budget: 5000,
    spent: 4200,
    clicks: 2890,
    leads: 312,
    revenue: 78000,
    startDate: "2024-12-15",
    cpa: 13.46,
    roas: 18.57,
  },
  {
    id: "camp_5",
    name: "Email Nurture - Q4 Leads",
    channel: "Email",
    status: "completed",
    budget: 2000,
    spent: 2000,
    clicks: 5678,
    leads: 456,
    revenue: 145000,
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    cpa: 4.39,
    roas: 72.5,
  },
  {
    id: "camp_6",
    name: "Holiday Promotion",
    channel: "Google Ads",
    status: "completed",
    budget: 10000,
    spent: 10000,
    clicks: 6789,
    leads: 289,
    revenue: 98000,
    startDate: "2024-12-15",
    endDate: "2024-12-31",
    cpa: 34.60,
    roas: 9.8,
  },
  {
    id: "camp_7",
    name: "Webinar Promotion - February",
    channel: "Events",
    status: "paused",
    budget: 6000,
    spent: 3200,
    clicks: 890,
    leads: 98,
    revenue: 0,
    startDate: "2025-01-20",
    cpa: 32.65,
    roas: 0,
  },
];

export function Campaigns() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredCampaigns = mockCampaigns.filter(
    (c) => selectedStatus === "all" || c.status === selectedStatus
  );

  const totalBudget = filteredCampaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = filteredCampaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalLeads = filteredCampaigns.reduce((sum, c) => sum + c.leads, 0);
  const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0);

  const getStatusBadge = (status: Campaign["status"]) => {
    const variants = {
      active: "success",
      paused: "warning",
      completed: "secondary",
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getStatusIcon = (status: Campaign["status"]) => {
    if (status === "active") return <Play className="h-4 w-4 text-green-600" />;
    if (status === "paused") return <Pause className="h-4 w-4 text-yellow-600" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Total Budget
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(totalBudget)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formatCurrency(totalSpent)} spent
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Total Leads
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {formatNumber(totalLeads)}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +12.5% vs last period
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Total Revenue
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(totalRevenue)}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {((totalRevenue / totalSpent - 1) * 100).toFixed(1)}% ROI
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Active Campaigns
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {mockCampaigns.filter((c) => c.status === "active").length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {mockCampaigns.filter((c) => c.status === "paused").length} paused
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                <MousePointerClick className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Campaigns</CardTitle>
              <CardDescription>
                Manage and track your marketing campaigns
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status Filter */}
          <div className="flex gap-2 mb-6">
            {["all", "active", "paused", "completed"].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {/* Campaigns Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(campaign.status)}
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          {campaign.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{campaign.channel}</Badge>
                        {getStatusBadge(campaign.status)}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Budget</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Leads
                      </div>
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {formatNumber(campaign.leads)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Revenue
                      </div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(campaign.revenue)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        CPA
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrency(campaign.cpa)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        ROAS
                      </div>
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {campaign.roas.toFixed(2)}x
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
