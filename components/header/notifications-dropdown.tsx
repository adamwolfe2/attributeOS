"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Bell, CheckCircle2, AlertCircle, Info, TrendingUp, X } from "lucide-react";

type Notification = {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "New Lead Converted",
    message: "Acme Corp closed as won - $25,000 deal",
    time: "5 min ago",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Salesforce Sync Complete",
    message: "12 new leads synced successfully",
    time: "15 min ago",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Facebook Ads Rate Limit",
    message: "Sync delayed - retrying in 30 minutes",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "success",
    title: "Campaign Budget Alert",
    message: "Q1 Enterprise campaign reached 75% of budget",
    time: "4 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "info",
    title: "Weekly Report Ready",
    message: "Your weekly attribution report is available",
    time: "1 day ago",
    read: true,
  },
];

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <DropdownMenu>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </Button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between px-3 py-2">
                <DropdownMenuLabel className="p-0">
                  Notifications ({unreadCount} new)
                </DropdownMenuLabel>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <DropdownMenuSeparator />

              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                      !notification.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-blue-600 dark:text-blue-400 font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </>
        )}
      </div>
    </DropdownMenu>
  );
}
