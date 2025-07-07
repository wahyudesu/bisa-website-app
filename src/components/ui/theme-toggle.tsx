"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Toggle } from "@/components/ui/toggle"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      <Toggle
        variant="outline"
        className="group data-[state=on]:hover:bg-muted size-9 data-[state=on]:bg-transparent"
        pressed={theme === "dark"}
        onPressedChange={() =>
          setTheme(theme === "dark" ? "light" : "dark")
        }
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {/* Show moon icon when in light mode (to switch to dark) */}
        <MoonIcon
          size={16}
          className="shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
          aria-hidden="true"
        />
        {/* Show sun icon when in dark mode (to switch to light) */}
        <SunIcon
          size={16}
          className="absolute shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
          aria-hidden="true"
        />
      </Toggle>
    </div>
  )
}
