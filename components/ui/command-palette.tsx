"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Search,
  LayoutDashboard,
  BarChart3,
  Target,
  Users,
  Filter,
  TrendingUp,
  Trophy,
  Zap,
  GitBranch,
  Route,
  Settings,
  FileDown,
  Bell,
  User,
  Calendar,
} from "lucide-react";

type Command = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  shortcut?: string;
  category: "navigation" | "actions" | "settings";
  action: () => void;
};

type CommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
};

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: "nav-overview",
      label: "Go to Overview",
      description: "Dashboard overview and KPIs",
      icon: <LayoutDashboard className="h-4 w-4" />,
      category: "navigation",
      action: () => {
        onNavigate("overview");
        onClose();
      },
    },
    {
      id: "nav-channels",
      label: "Go to Channels",
      description: "Marketing channel performance",
      icon: <BarChart3 className="h-4 w-4" />,
      category: "navigation",
      action: () => {
        onNavigate("channels");
        onClose();
      },
    },
    {
      id: "nav-campaigns",
      label: "Go to Campaigns",
      description: "Campaign management",
      icon: <Target className="h-4 w-4" />,
      category: "navigation",
      action: () => {
        onNavigate("campaigns");
        onClose();
      },
    },
    {
      id: "nav-leads",
      label: "Go to All Leads",
      description: "Lead database and pipeline",
      icon: <Users className="h-4 w-4" />,
      category: "navigation",
      action: () => {
        onNavigate("leads");
        onClose();
      },
    },
    {
      id: "nav-funnel",
      label: "Go to Conversion Funnel",
      description: "Pipeline stage analysis",
      icon: <Filter className="h-4 w-4" />,
      category: "navigation",
      action: () => {
        onNavigate("funnel");
        onClose();
      },
    },
    {
      id: "nav-forecast",
      label: "Go to Forecast",
      description: "Revenue and lead predictions",
      icon: <TrendingUp className="h-4 w-4" />,
      category: "navigation",
      action: () => {
        onNavigate("forecast");
        onClose();
      },
    },
    {
      id: "nav-goals",
      label: "Go to Goals",
      description: "Track KPIs and objectives",
      icon: <Trophy className="h-4 w-4" />,
      category: "navigation",
      action: () => {
        onNavigate("goals");
        onClose();
      },
    },
    {
      id: "nav-integrations",
      label: "Go to Integrations",
      description: "Connected services",
      icon: <Zap className="h-4 w-4" />,
      category: "navigation",
      action: () => {
        onNavigate("integrations");
        onClose();
      },
    },
    {
      id: "nav-attribution",
      label: "Go to Attribution",
      description: "Attribution model comparison",
      icon: <GitBranch className="h-4 w-4" />,
      category: "navigation",
      action: () => {
        onNavigate("attribution");
        onClose();
      },
    },
    {
      id: "nav-journey",
      label: "Go to Lead Journey",
      description: "Individual lead touchpoints",
      icon: <Route className="h-4 w-4" />,
      category: "navigation",
      action: () => {
        onNavigate("journey");
        onClose();
      },
    },
    {
      id: "action-export",
      label: "Export Data",
      description: "Download current view as CSV",
      icon: <FileDown className="h-4 w-4" />,
      shortcut: "⌘E",
      category: "actions",
      action: () => {
        // Export action would be implemented
        onClose();
      },
    },
    {
      id: "action-notifications",
      label: "View Notifications",
      description: "See all notifications",
      icon: <Bell className="h-4 w-4" />,
      category: "actions",
      action: () => {
        onClose();
      },
    },
    {
      id: "settings-account",
      label: "Account Settings",
      description: "Manage your account",
      icon: <User className="h-4 w-4" />,
      category: "settings",
      action: () => {
        onClose();
      },
    },
    {
      id: "settings-preferences",
      label: "Preferences",
      description: "App settings and preferences",
      icon: <Settings className="h-4 w-4" />,
      category: "settings",
      action: () => {
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(search.toLowerCase()) ||
    command.description.toLowerCase().includes(search.toLowerCase())
  );

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const categoryLabels = {
    navigation: "Navigation",
    actions: "Actions",
    settings: "Settings",
  };

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-2xl -translate-x-1/2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                />
                <kbd className="px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-700 rounded">
                  ESC
                </kbd>
              </div>

              {/* Commands List */}
              <div className="max-h-[400px] overflow-y-auto">
                {filteredCommands.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                    No commands found
                  </div>
                ) : (
                  <div className="py-2">
                    {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                      <div key={category}>
                        <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </div>
                        {categoryCommands.map((command, index) => {
                          const globalIndex = filteredCommands.indexOf(command);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <button
                              key={command.id}
                              onClick={command.action}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                isSelected
                                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                              }`}
                            >
                              <div
                                className={`flex items-center justify-center w-8 h-8 rounded ${
                                  isSelected
                                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                                }`}
                              >
                                {command.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{command.label}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                  {command.description}
                                </div>
                              </div>
                              {command.shortcut && (
                                <kbd className="px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-700 rounded">
                                  {command.shortcut}
                                </kbd>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      ↑↓
                    </kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      ↵
                    </kbd>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      ESC
                    </kbd>
                    <span>Close</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
