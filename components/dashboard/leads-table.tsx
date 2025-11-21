"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockLeads, mockChannels, type Lead } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Mail,
  Phone,
} from "lucide-react";

// Generate more mock leads for the table
function generateMockLeads(): Lead[] {
  const companies = [
    "Acme Corp", "TechStart Inc", "Global Solutions", "Innovation Labs",
    "Digital Dynamics", "Cloud Systems", "Data Pros", "Smart Analytics",
    "Future Tech", "Growth Partners", "Scale Ventures", "Nexus Group",
    "Vertex Solutions", "Apex Industries", "Prime Systems", "Elite Corp"
  ];

  const statuses: Lead["status"][] = [
    "new", "contacted", "qualified", "opportunity", "closed_won", "closed_lost"
  ];

  const sources = mockChannels.map(c => c.source);

  const leads: Lead[] = [];

  for (let i = 0; i < 50; i++) {
    const company = companies[i % companies.length];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const value = status === "closed_won"
      ? Math.floor(Math.random() * 50000) + 10000
      : status === "opportunity"
      ? Math.floor(Math.random() * 40000) + 5000
      : 0;

    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60));

    leads.push({
      id: `lead_${i + 1}`,
      email: `contact${i + 1}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
      company: `${company} ${i > 15 ? Math.floor(i / 4) : ''}`.trim(),
      status,
      value,
      createdDate: createdDate.toISOString(),
      closedDate: status.includes("closed") ? new Date(createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      firstTouch: {
        source,
        campaign: `Q1_Campaign_${Math.floor(Math.random() * 5) + 1}`,
        timestamp: createdDate.toISOString(),
      },
      lastTouch: {
        source,
        campaign: `Q1_Campaign_${Math.floor(Math.random() * 5) + 1}`,
        timestamp: createdDate.toISOString(),
      },
      touchpoints: [],
    });
  }

  return leads;
}

const allLeads = generateMockLeads();

export function LeadsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  // Filter leads
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      const matchesSearch =
        searchQuery === "" ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Paginate
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * leadsPerPage,
    currentPage * leadsPerPage
  );

  const getStatusBadge = (status: Lead["status"]) => {
    const variants = {
      new: "secondary",
      contacted: "secondary",
      qualified: "warning",
      opportunity: "warning",
      closed_won: "success",
      closed_lost: "destructive",
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.replace(/_/g, " ").toUpperCase()}
      </Badge>
    );
  };

  const totalValue = filteredLeads
    .filter((l) => l.status === "closed_won")
    .reduce((sum, l) => sum + l.value, 0);

  const conversionRate = (
    (filteredLeads.filter((l) => l.status === "closed_won").length /
      filteredLeads.length) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              Total Leads
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {formatNumber(filteredLeads.length)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              Closed Won
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {filteredLeads.filter((l) => l.status === "closed_won").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              Total Value
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalValue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              Conv. Rate
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {conversionRate}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Leads</CardTitle>
              <CardDescription>
                Manage and track all your leads in one place
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by company or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="opportunity">Opportunity</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    Company
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    First Touch
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    Value
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    Created
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {lead.company}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Mail className="h-3 w-3" />
                        <span className="text-xs">{lead.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(lead.status)}</td>
                    <td className="py-3 px-4">
                      <span className="text-slate-600 dark:text-slate-400 capitalize text-xs">
                        {lead.firstTouch.source.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {lead.value > 0 ? (
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(lead.value)}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {new Date(lead.createdDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing {(currentPage - 1) * leadsPerPage + 1} to{" "}
              {Math.min(currentPage * leadsPerPage, filteredLeads.length)} of{" "}
              {filteredLeads.length} leads
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
