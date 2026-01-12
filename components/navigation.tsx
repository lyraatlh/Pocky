"use client"

import { useState } from "react"
import { Wallet, LayoutDashboard, Moon, Sun, BookOpen, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Cat } from "@phosphor-icons/react"
import { useTheme } from "@/components/theme-provider"

interface NavigationProps {
  activeTab: "dashboard" | "tracker" | "reading"
  onTabChange: (tab: "dashboard" | "tracker" | "reading") => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleTabChange = (tab: "dashboard" | "tracker" | "reading") => {
    onTabChange(tab)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-blue-200 dark:border-blue-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-2xl">
              <Cat weight="duotone" color={theme === "light" ? "#1c398e" : "#93c5fd"} />
            </div>
            <h1 className="font-bold text-lg sm:text-xl text-blue-900 dark:text-white">Pocky</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2 items-center">
            <Button
              variant="ghost"
              onClick={() => handleTabChange("dashboard")}
              className={`gap-2 rounded-lg px-4 text-blue-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors ${
                activeTab === "dashboard" ? "bg-blue-100 dark:bg-blue-900" : ""
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleTabChange("tracker")}
              className={`gap-2 rounded-lg px-4 text-blue-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors ${
                activeTab === "tracker" ? "bg-blue-100 dark:bg-blue-900" : ""
              }`}
            >
              <Wallet className="w-4 h-4" />
              Tracker
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleTabChange("reading")}
              className={`gap-2 rounded-lg px-4 text-blue-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors ${
                activeTab === "reading" ? "bg-blue-100 dark:bg-blue-900" : ""
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Reading
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg text-blue-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors ml-2"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg text-blue-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg text-blue-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Button
              variant="ghost"
              onClick={() => handleTabChange("dashboard")}
              className={`w-full justify-start gap-2 rounded-lg px-4 py-2 text-blue-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors ${
                activeTab === "dashboard" ? "bg-blue-100 dark:bg-blue-900" : ""
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleTabChange("tracker")}
              className={`w-full justify-start gap-2 rounded-lg px-4 py-2 text-blue-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors ${
                activeTab === "tracker" ? "bg-blue-100 dark:bg-blue-900" : ""
              }`}
            >
              <Wallet className="w-4 h-4" />
              Tracker
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleTabChange("reading")}
              className={`w-full justify-start gap-2 rounded-lg px-4 py-2 text-blue-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors ${
                activeTab === "reading" ? "bg-blue-100 dark:bg-blue-900" : ""
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Reading Time
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}