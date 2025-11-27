"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themes = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
const storageKey = "custom-theme"

export function ThemeSelector() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored && themes.includes(stored)) {
      setSelectedTheme(stored)
      document.documentElement.classList.add(`theme-${stored}`)
    }
  }, [])

  const applyTheme = (theme: string) => {
    document.documentElement.classList.remove(
      ...themes.map((t) => `theme-${t}`)
    )
    document.documentElement.classList.add(`theme-${theme}`)
    localStorage.setItem(storageKey, theme)
    setSelectedTheme(theme)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="ghost" size="sm">
          Theme:{" "}
          {selectedTheme
            ? selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)
            : "Default"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme}
            className={`cursor-pointer ${selectedTheme === theme ? "font-bold" : ""}`}
            onClick={() => applyTheme(theme)}
          >
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
