"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { VerticalSeparator } from "@/components/global/separator"
import { Button } from "@/components/ui/button"
import { ThemeSelector } from "@/components/ui/theme-selector"
import { ModeToggle } from "@/components/global/mode-toggle"

export function AppHeader() {
  return (
    <header className="bg-card flex items-center justify-between border-b p-3">
      <div className="flex h-6 items-center gap-2">
        <SidebarTrigger className="cursor-pointer" />
        <VerticalSeparator />
        <h1 className="text-xl font-bold">Student Information System</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
          <a
            href="https://github.com/00hanas/SSIS-Web-Dev"
            rel="noopener noreferrer"
            target="_blank"
            className="dark:text-foreground"
          >
            GitHub
          </a>
        </Button>
        <ThemeSelector />
        <ModeToggle />
      </div>
    </header>
  )
}
