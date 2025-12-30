"use client"

import { Wallet, LayoutDashboard, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Cat } from "@phosphor-icons/react"
import { useTheme } from "@/components/theme-provider"

interface NavigationProps {
  activeTab: "dashboard" | "tracker"
  onTabChange: (tab: "dashboard" | "tracker") => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="text-2xl">
              <Cat weight="duotone" color="#1c398e" />
            </div>
            <h1 className="font-bold text-xl text-blue-900 hidden sm:block">Pocky Life</h1>
            <h1 className="font-bold text-xl text-blue-900 sm:hidden">Pocky</h1>
          </div>

          <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
            <Button
              variant="ghost"
              onClick={() => onTabChange("dashboard")}
              className={`
                gap-2
                rounded-xl
                px-2 sm:px-4
                text-xs sm:text-sm
                text-blue-900 dark:text-white
                hover:bg-blue-200 dark:hover:bg-blue-800
                ${activeTab === "dashboard" ? "bg-blue-200 dark:bg-blue-800" : ""}
              `}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => onTabChange("tracker")}
              className={`
                gap-2
                rounded-xl
                px-2 sm:px-4
                text-xs sm:text-sm
                text-blue-900 dark:text-white
                hover:bg-blue-200 dark:hover:bg-blue-800
                ${activeTab === "tracker" ? "bg-blue-200 dark:bg-blue-800" : ""}
              `}
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Tracker</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="
                rounded-xl
                text-blue-900 dark:text-white
                hover:bg-blue-200 dark:hover:bg-blue-800
              "
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}