"use client"

import { CardDemographic } from "@/components/cards"
import { ProgramColumns, Program } from "../table/programs-columns"
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

export const mockData: Program[] = [
  { pcode: "BSCS", name: "Bachelor of Science in Computer Science", ccode: "CCS" },
  { pcode: "BSIT", name: "Bachelor of Science in Information Technology", ccode: "CCS" },
  { pcode: "BSECE", name: "Bachelor of Science in Electronics Engineering", ccode: "COE" },
  { pcode: "BSEE", name: "Bachelor of Science in Electrical Engineering", ccode: "COE" },
  { pcode: "BSN", name: "Bachelor of Science in Nursing", ccode: "CON" },
  { pcode: "BSPharm", name: "Bachelor of Science in Pharmacy", ccode: "CHS" },
  { pcode: "BSEd", name: "Bachelor of Secondary Education", ccode: "CED" },
  { pcode: "BEEd", name: "Bachelor of Elementary Education", ccode: "CED" },
  { pcode: "BFA", name: "Bachelor of Fine Arts", ccode: "CFAD" },
  { pcode: "BArch", name: "Bachelor of Architecture", ccode: "CARCH" },
  { pcode: "LLB", name: "Bachelor of Laws", ccode: "CLAW" },
  { pcode: "BSAgri", name: "Bachelor of Science in Agriculture", ccode: "CAGR" },
  { pcode: "DVM", name: "Doctor of Veterinary Medicine", ccode: "CVET" },
  { pcode: "BSES", name: "Bachelor of Science in Environmental Science", ccode: "CENV" },
  { pcode: "BSIndTech", name: "Bachelor of Science in Industrial Technology", ccode: "CIT" },
  { pcode: "BAHum", name: "Bachelor of Arts in Humanities", ccode: "CHUM" },
  { pcode: "BAComm", name: "Bachelor of Arts in Mass Communication", ccode: "CMASS" },
  { pcode: "MD", name: "Doctor of Medicine", ccode: "CMED" },
  { pcode: "BMUS", name: "Bachelor of Music", ccode: "CMUS" },
  { pcode: "BPEd", name: "Bachelor of Physical Education", ccode: "CPHY" },
  { pcode: "BSPsy", name: "Bachelor of Science in Psychology", ccode: "CPSY" },
  { pcode: "BSW", name: "Bachelor of Science in Social Work", ccode: "CSOC" },
  { pcode: "BPolSci", name: "Bachelor of Political Science", ccode: "CPOL" },
  { pcode: "BAJour", name: "Bachelor of Arts in Journalism", ccode: "CJOUR" },
  { pcode: "BSIS", name: "Bachelor of Science in Information Systems", ccode: "CIS" },
  { pcode: "BSMarE", name: "Bachelor of Science in Marine Engineering", ccode: "CMAR" },
  { pcode: "BSMarBio", name: "Bachelor of Science in Marine Biology", ccode: "CAS" },
  { pcode: "BSMath", name: "Bachelor of Science in Mathematics", ccode: "CAS" },
  { pcode: "BSChem", name: "Bachelor of Science in Chemistry", ccode: "CAS" },
]

export default function ProgramsPage() {
  const [search, setSearch] = useState("")
  const [searchBy, setSearchBy] = useState<"all" | "pcode" | "name" | "ccode">("all")

   const filteredData = mockData.filter((program) => {
    if (searchBy === "all") {
      return Object.values(program)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    }
    return program[searchBy].toLowerCase().includes(search.toLowerCase())
  })
  return (
    <div className="container mx-auto py-1">
      <CardDemographic colleges={5} programs={12} students={300} />

      <div>
        <div className="flex items-center justify-between mb-4 mt-6">
          <div>
            <h2 className="text-2xl font-bold">Programs</h2>
            <p className="text-muted-foreground">
              Here’s the list of programs.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <div className="relative max-w-sm">
                <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Search programs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                />
                </div>
          <Select
            value={searchBy}
            onValueChange={(value) => setSearchBy(value as "all" | "pcode" | "name" | "ccode")}
            >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Search by</SelectItem>
              <SelectItem value="pcode">Program Code</SelectItem>
              <SelectItem value="name">Program Name</SelectItem>
              <SelectItem value="ccode">College Code</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
            variant="default"
            size="sm"
            onClick={() => console.log("Add Program")}
          >
            Add Program
          </Button>
          </div>

        <DataTable columns={ProgramColumns} data={filteredData} />
      </div>
    </div>
  )
}