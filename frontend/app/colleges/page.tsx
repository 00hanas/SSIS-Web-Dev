"use client"

import { CardDemographic } from "@/components/cards"
import { CollegeColumns, College } from "../table/college-columns"
import { DataTable } from "../table/data-table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchSharp as SearchIcon } from '@mui/icons-material'

const mockData: College[] = [
  // Mock college data
    { ccode: "CCS", name: "College of Computer Studies" },
    { ccode: "CAS", name: "College of Arts and Sciences" },
    { ccode: "CBA", name: "College of Business Administration" },
    { ccode: "COE", name: "College of Engineering" },
    { ccode: "CON", name: "College of Nursing" },
    { ccode: "CHS", name: "College of Health Sciences" },
    { ccode: "CED", name: "College of Education" },
    { ccode: "CFAD", name: "College of Fine Arts and Design" },
    { ccode: "CARCH", name: "College of Architecture" },
    { ccode: "CLAW", name: "College of Law" },
    { ccode: "CAGR", name: "College of Agriculture" },
    { ccode: "CVET", name: "College of Veterinary Medicine" },
    { ccode: "CENV", name: "College of Environmental Science" },
    { ccode: "CIT", name: "College of Industrial Technology" },
    { ccode: "CHUM", name: "College of Humanities" },
    { ccode: "CMASS", name: "College of Mass Communication" },
    { ccode: "CMED", name: "College of Medicine" },
    { ccode: "CMUS", name: "College of Music" },
    { ccode: "CPHY", name: "College of Physical Education" },
    { ccode: "CPSY", name: "College of Psychology" },
    { ccode: "CSOC", name: "College of Social Work" },
    { ccode: "CPOL", name: "College of Political Science" },
    { ccode: "CJOUR", name: "College of Journalism" },
    { ccode: "CIS", name: "College of Information Systems" },
    { ccode: "CMAR", name: "College of Maritime Studies" },
]

export default function CollegesPage() {
  const [search, setSearch] = useState("")
  const [searchBy, setSearchBy] = useState<"all" | "ccode" | "name">("all")

   const filteredData = mockData.filter((college) => {
    if (searchBy === "all") {
      return Object.values(college)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    }
    return college[searchBy].toLowerCase().includes(search.toLowerCase())
  })
  return (
    <div className="container mx-auto py-1">
      <CardDemographic colleges={5} programs={12} students={300} />

      <div>
        <div className="flex items-center justify-between mb-4 mt-6">
          <div>
            <h2 className="text-2xl font-bold">Colleges</h2>
            <p className="text-muted-foreground">
              Here’s the list of colleges.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <div className="relative max-w-sm">
                <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Search colleges..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8" 
                />
                </div>
          <Select
            value={searchBy}
            onValueChange={(value) => setSearchBy(value as "all" | "ccode" | "name")}
            >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Search by</SelectItem>
              <SelectItem value="ccode">College Code</SelectItem>
              <SelectItem value="name">College Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
            variant="default"
            size="sm"
            onClick={() => console.log("Add college")}
          >
            Add College
          </Button>
          </div>

        <DataTable columns={CollegeColumns} data={filteredData} />
      </div>
    </div>
  )
}

