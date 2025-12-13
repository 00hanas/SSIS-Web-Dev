import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ListFilterPlus } from "lucide-react"

export type Filters = {
  yearLevels: number[]
  genders: string[]
  programCodes: string[]
}

type FilterDropdownProps = {
  filters: Filters
  setFilters: (updater: (prev: Filters) => Filters) => void
  availableOptions: {
    yearLevels: number[]
    genders: string[]
    programCodes: string[]
  }
}

export function FilterDropdown({
  filters,
  setFilters,
  availableOptions,
}: FilterDropdownProps) {
  const [programSearch, setProgramSearch] = useState("")

  const toggleFilter = <K extends keyof Filters>(
    key: K,
    value: Filters[K][number]
  ) => {
    setFilters((prev) => {
      const current = prev[key] as Filters[K]
      const exists = (current as (string | number)[]).includes(value)
      return {
        ...prev,
        [key]: exists
          ? (current.filter((v) => v !== value) as Filters[K])
          : ([...current, value] as Filters[K]),
      }
    })
  }

  const clearAll = () =>
    setFilters(() => ({ yearLevels: [], genders: [], programCodes: [] }))

  const hasAnyFilter =
    filters.yearLevels.length > 0 ||
    filters.genders.length > 0 ||
    filters.programCodes.length > 0

  const filteredPrograms = availableOptions.programCodes.filter((p) =>
    p.toLowerCase().includes(programSearch.toLowerCase())
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px]">
          <ListFilterPlus />
          {hasAnyFilter ? "Filters Applied" : "Add Filters"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[200px] space-y-3 p-3">
        {/* Active Filters */}
        <DropdownMenuLabel>Active Filters</DropdownMenuLabel>
        <div className="flex flex-wrap gap-2">
          {filters.yearLevels.map((y) => (
            <Badge
              key={`year-${y}`}
              className="cursor-pointer"
              onClick={() => toggleFilter("yearLevels", y)}
            >
              Year Level: {y} ✕
            </Badge>
          ))}
          {filters.genders.map((g) => (
            <Badge
              key={`gender-${g}`}
              className="cursor-pointer"
              onClick={() => toggleFilter("genders", g)}
            >
              Gender: {g} ✕
            </Badge>
          ))}
          {filters.programCodes.map((p) => (
            <Badge
              key={`prog-${p}`}
              className="cursor-pointer"
              onClick={() => toggleFilter("programCodes", p)}
            >
              Program: {p} ✕
            </Badge>
          ))}
          {!hasAnyFilter && (
            <span className="text-muted-foreground text-sm">
              No filters applied
            </span>
          )}
        </div>

        {hasAnyFilter && (
          <div>
            <Button
              variant="ghost"
              className="w-full text-red-500"
              onClick={clearAll}
            >
              Clear all filters
            </Button>
          </div>
        )}

        <DropdownMenuSeparator />

        {/* Gender Section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Gender
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full p-2">
            {availableOptions.genders.map((g) => (
              <div key={g} className="flex w-full items-center space-x-2">
                <Checkbox
                  id={`gender-${g}`}
                  checked={filters.genders.includes(g)}
                  onCheckedChange={() => toggleFilter("genders", g)}
                />
                <label htmlFor={`gender-${g}`} className="w-full text-sm">
                  {g}
                </label>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Year Level Section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Year Level
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2">
            {availableOptions.yearLevels.map((y) => (
              <div key={y} className="flex w-full items-center space-x-2">
                <Checkbox
                  id={`year-${y}`}
                  checked={filters.yearLevels.includes(y)}
                  onCheckedChange={() => toggleFilter("yearLevels", y)}
                />
                <label htmlFor={`year-${y}`} className="text-sm">
                  {y}
                </label>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Program Code
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full space-y-2 p-2">
            <Input
              placeholder="Search programs..."
              value={programSearch}
              onChange={(e) => setProgramSearch(e.target.value)}
            />
            <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
              {filteredPrograms.map((p) => (
                <div key={p} className="flex w-full items-center space-x-2">
                  <Checkbox
                    id={`prog-${p}`}
                    checked={filters.programCodes.includes(p)}
                    onCheckedChange={() => toggleFilter("programCodes", p)}
                  />
                  <label htmlFor={`prog-${p}`} className="w-full text-sm">
                    {p}
                  </label>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
