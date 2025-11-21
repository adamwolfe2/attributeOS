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
import {
  User,
  Settings,
  CreditCard,
  Users,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          <User className="h-5 w-5" />
        </Button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    John Doe
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    john@company.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setIsOpen(false)}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setIsOpen(false)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setIsOpen(false)}>
                <CreditCard className="h-4 w-4 mr-2" />
                Billing
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setIsOpen(false)}>
                <Users className="h-4 w-4 mr-2" />
                Team
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setIsOpen(false)}>
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setIsOpen(false)}
                className="text-red-600 dark:text-red-400"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </>
        )}
      </div>
    </DropdownMenu>
  );
}
