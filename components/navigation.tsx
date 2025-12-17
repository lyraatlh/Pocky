"use client"

import { Wallet, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Cat } from "@phosphor-icons/react";

interface NavigationProps {
  activeTab: "dashboard" | "tracker"
  onTabChange: (tab: "dashboard" | "tracker") => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="text-2xl">
              <Cat weight="duotone" color="#1c398e" />
            </div>
            <h1 className="font-bold text-xl text-blue-900">Pocky Life</h1>
          </div>

          <div className="flex gap-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              onClick={() => onTabChange("dashboard")}
              className="gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "tracker" ? "default" : "ghost"}
              onClick={() => onTabChange("tracker")}
              className="gap-2"
            >
              <Wallet className="w-4 h-4" />
              Expense Tracker
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
