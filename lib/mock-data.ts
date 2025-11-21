export type AttributionModel = "first_touch" | "last_touch" | "linear" | "time_decay" | "u_shaped";

export type Channel = {
  id: string;
  name: string;
  source: string;
  spend: number;
  leads: number;
  revenue: number;
  roi: number;
  roas: number;
  conversions: number;
};

export type Touchpoint = {
  id: string;
  type: "click" | "pageview" | "email_click" | "call" | "form_submit";
  timestamp: string;
  source: string;
  medium?: string;
  campaign?: string;
  url?: string;
};

export type Lead = {
  id: string;
  email: string;
  company: string;
  status: "new" | "contacted" | "qualified" | "opportunity" | "closed_won" | "closed_lost";
  value: number;
  createdDate: string;
  closedDate?: string;
  touchpoints: Touchpoint[];
  firstTouch: {
    source: string;
    campaign: string;
    timestamp: string;
  };
  lastTouch: {
    source: string;
    campaign: string;
    timestamp: string;
  };
};

export type AttributionBreakdown = {
  model: AttributionModel;
  channels: {
    source: string;
    credit: number;
    percentage: number;
  }[];
};

// Mock Channels Data
export const mockChannels: Channel[] = [
  {
    id: "1",
    name: "Google Ads",
    source: "google_ads",
    spend: 15000,
    leads: 234,
    revenue: 185000,
    roi: 1133,
    roas: 12.33,
    conversions: 23,
  },
  {
    id: "2",
    name: "LinkedIn Ads",
    source: "linkedin",
    spend: 8500,
    leads: 89,
    revenue: 125000,
    roi: 1370,
    roas: 14.71,
    conversions: 18,
  },
  {
    id: "3",
    name: "Organic Search",
    source: "organic",
    spend: 2000,
    leads: 456,
    revenue: 98000,
    roi: 4800,
    roas: 49.0,
    conversions: 15,
  },
  {
    id: "4",
    name: "Email Marketing",
    source: "email",
    spend: 1200,
    leads: 678,
    revenue: 145000,
    roi: 11983,
    roas: 120.83,
    conversions: 28,
  },
  {
    id: "5",
    name: "Content Marketing",
    source: "content",
    spend: 3500,
    leads: 312,
    revenue: 78000,
    roi: 2129,
    roas: 22.29,
    conversions: 12,
  },
  {
    id: "6",
    name: "Referral",
    source: "referral",
    spend: 500,
    leads: 145,
    revenue: 92000,
    roi: 18300,
    roas: 184.0,
    conversions: 14,
  },
  {
    id: "7",
    name: "Facebook Ads",
    source: "facebook",
    spend: 6000,
    leads: 167,
    revenue: 45000,
    roi: 650,
    roas: 7.5,
    conversions: 8,
  },
  {
    id: "8",
    name: "Events & Webinars",
    source: "events",
    spend: 5000,
    leads: 98,
    revenue: 156000,
    roi: 3020,
    roas: 31.2,
    conversions: 19,
  },
];

// Mock Leads Data
export const mockLeads: Lead[] = [
  {
    id: "lead_1",
    email: "john.smith@acmecorp.com",
    company: "Acme Corp",
    status: "closed_won",
    value: 25000,
    createdDate: "2025-01-10T10:30:00Z",
    closedDate: "2025-01-20T15:45:00Z",
    firstTouch: {
      source: "google_ads",
      campaign: "Q1_Enterprise",
      timestamp: "2025-01-05T14:20:00Z",
    },
    lastTouch: {
      source: "email",
      campaign: "nurture_sequence",
      timestamp: "2025-01-18T09:15:00Z",
    },
    touchpoints: [
      {
        id: "tp_1",
        type: "click",
        timestamp: "2025-01-05T14:20:00Z",
        source: "google_ads",
        medium: "cpc",
        campaign: "Q1_Enterprise",
        url: "https://example.com/demo",
      },
      {
        id: "tp_2",
        type: "pageview",
        timestamp: "2025-01-05T14:21:30Z",
        source: "google_ads",
        url: "https://example.com/demo",
      },
      {
        id: "tp_3",
        type: "pageview",
        timestamp: "2025-01-05T14:25:00Z",
        source: "google_ads",
        url: "https://example.com/pricing",
      },
      {
        id: "tp_4",
        type: "form_submit",
        timestamp: "2025-01-05T14:28:00Z",
        source: "google_ads",
        campaign: "Q1_Enterprise",
      },
      {
        id: "tp_5",
        type: "email_click",
        timestamp: "2025-01-08T09:30:00Z",
        source: "email",
        campaign: "welcome_series",
        url: "https://example.com/features",
      },
      {
        id: "tp_6",
        type: "pageview",
        timestamp: "2025-01-08T09:31:00Z",
        source: "email",
        url: "https://example.com/features",
      },
      {
        id: "tp_7",
        type: "call",
        timestamp: "2025-01-12T11:00:00Z",
        source: "organic",
      },
      {
        id: "tp_8",
        type: "email_click",
        timestamp: "2025-01-15T14:20:00Z",
        source: "email",
        campaign: "nurture_sequence",
        url: "https://example.com/case-studies",
      },
      {
        id: "tp_9",
        type: "pageview",
        timestamp: "2025-01-15T14:22:00Z",
        source: "email",
        url: "https://example.com/case-studies",
      },
      {
        id: "tp_10",
        type: "email_click",
        timestamp: "2025-01-18T09:15:00Z",
        source: "email",
        campaign: "nurture_sequence",
        url: "https://example.com/book-demo",
      },
    ],
  },
];

// Attribution Model Calculations
export function calculateAttributionBreakdown(
  lead: Lead,
  model: AttributionModel
): AttributionBreakdown {
  const touchpoints = lead.touchpoints;
  const revenue = lead.value;

  if (model === "first_touch") {
    return {
      model,
      channels: [
        {
          source: touchpoints[0].source,
          credit: revenue,
          percentage: 100,
        },
      ],
    };
  }

  if (model === "last_touch") {
    return {
      model,
      channels: [
        {
          source: touchpoints[touchpoints.length - 1].source,
          credit: revenue,
          percentage: 100,
        },
      ],
    };
  }

  if (model === "linear") {
    const uniqueSources = Array.from(new Set(touchpoints.map((tp) => tp.source)));
    const creditPerSource = revenue / uniqueSources.length;
    const percentagePerSource = 100 / uniqueSources.length;

    return {
      model,
      channels: uniqueSources.map((source) => ({
        source,
        credit: creditPerSource,
        percentage: percentagePerSource,
      })),
    };
  }

  if (model === "time_decay") {
    // More recent touchpoints get more credit
    const weights: number[] = [];
    let totalWeight = 0;

    const conversionTime = new Date(lead.closedDate || lead.createdDate).getTime();

    touchpoints.forEach((tp) => {
      const tpTime = new Date(tp.timestamp).getTime();
      const daysBeforeConversion = (conversionTime - tpTime) / (1000 * 60 * 60 * 24);
      const weight = Math.pow(2, -daysBeforeConversion / 7); // Half-life of 7 days
      weights.push(weight);
      totalWeight += weight;
    });

    const sourceCredits = new Map<string, { credit: number; percentage: number }>();

    touchpoints.forEach((tp, index) => {
      const credit = (weights[index] / totalWeight) * revenue;
      const percentage = (weights[index] / totalWeight) * 100;

      if (sourceCredits.has(tp.source)) {
        const existing = sourceCredits.get(tp.source)!;
        sourceCredits.set(tp.source, {
          credit: existing.credit + credit,
          percentage: existing.percentage + percentage,
        });
      } else {
        sourceCredits.set(tp.source, { credit, percentage });
      }
    });

    return {
      model,
      channels: Array.from(sourceCredits.entries()).map(([source, data]) => ({
        source,
        credit: data.credit,
        percentage: data.percentage,
      })),
    };
  }

  if (model === "u_shaped") {
    if (touchpoints.length === 1) {
      return {
        model,
        channels: [
          {
            source: touchpoints[0].source,
            credit: revenue,
            percentage: 100,
          },
        ],
      };
    }

    if (touchpoints.length === 2) {
      return {
        model,
        channels: [
          {
            source: touchpoints[0].source,
            credit: revenue * 0.5,
            percentage: 50,
          },
          {
            source: touchpoints[1].source,
            credit: revenue * 0.5,
            percentage: 50,
          },
        ],
      };
    }

    // 40% first, 40% last, 20% distributed to middle
    const sourceCredits = new Map<string, { credit: number; percentage: number }>();
    const middleCount = touchpoints.length - 2;
    const middleCreditEach = (revenue * 0.2) / middleCount;
    const middlePercentageEach = 20 / middleCount;

    // First touch
    const firstSource = touchpoints[0].source;
    sourceCredits.set(firstSource, { credit: revenue * 0.4, percentage: 40 });

    // Middle touches
    touchpoints.slice(1, -1).forEach((tp) => {
      if (sourceCredits.has(tp.source)) {
        const existing = sourceCredits.get(tp.source)!;
        sourceCredits.set(tp.source, {
          credit: existing.credit + middleCreditEach,
          percentage: existing.percentage + middlePercentageEach,
        });
      } else {
        sourceCredits.set(tp.source, {
          credit: middleCreditEach,
          percentage: middlePercentageEach,
        });
      }
    });

    // Last touch
    const lastSource = touchpoints[touchpoints.length - 1].source;
    if (sourceCredits.has(lastSource)) {
      const existing = sourceCredits.get(lastSource)!;
      sourceCredits.set(lastSource, {
        credit: existing.credit + revenue * 0.4,
        percentage: existing.percentage + 40,
      });
    } else {
      sourceCredits.set(lastSource, { credit: revenue * 0.4, percentage: 40 });
    }

    return {
      model,
      channels: Array.from(sourceCredits.entries()).map(([source, data]) => ({
        source,
        credit: data.credit,
        percentage: data.percentage,
      })),
    };
  }

  // Default to linear
  return calculateAttributionBreakdown(lead, "linear");
}

// Dashboard Summary Stats
export const mockSummaryStats = {
  totalLeads: mockChannels.reduce((sum, channel) => sum + channel.leads, 0),
  totalRevenue: mockChannels.reduce((sum, channel) => sum + channel.revenue, 0),
  totalSpend: mockChannels.reduce((sum, channel) => sum + channel.spend, 0),
  totalConversions: mockChannels.reduce((sum, channel) => sum + channel.conversions, 0),
};

mockSummaryStats.totalRevenue - mockSummaryStats.totalSpend;

export const mockMonthlyTrend = [
  { month: "Jul", revenue: 487000, spend: 28000, leads: 1456 },
  { month: "Aug", revenue: 523000, spend: 31000, leads: 1678 },
  { month: "Sep", revenue: 598000, spend: 34000, leads: 1892 },
  { month: "Oct", revenue: 645000, spend: 36500, leads: 2043 },
  { month: "Nov", revenue: 712000, spend: 39000, leads: 2234 },
  { month: "Dec", revenue: 723000, spend: 41700, leads: 2381 },
];

// Sparkline data for trends
export const sparklineData = {
  revenue: mockMonthlyTrend.map(d => d.revenue),
  spend: mockMonthlyTrend.map(d => d.spend),
  leads: mockMonthlyTrend.map(d => d.leads),
  roi: mockMonthlyTrend.map((d, i) => ((d.revenue - d.spend) / d.spend) * 100),
};
