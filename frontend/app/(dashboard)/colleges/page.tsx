"use client"

import { CardDemographic } from "@/components/cards"
import { CollegeColumns, College } from "../../table/college-columns"
import { DataTable } from "../../table/data-table"
import { AddCollegeDialog } from "./add-dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchSharp as SearchIcon } from '@mui/icons-material'
import { useEffect, useState } from "react"
import { fetchColleges } from "@/lib/college-api"
import { fetchPrograms } from "@/lib/program-api"
import { fetchStudents } from "@/lib/student-api"

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalColleges, setTotalColleges] = useState(0)
  const [totalPrograms, setTotalPrograms] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [search, setSearch] = useState("")
  const [searchBy, setSearchBy] = useState<"all" | "collegeCode" | "collegeName">("all")

  useEffect(() => {
      const loadPrograms = async () => {
        try {
          const data = await fetchColleges(page)
          setColleges(data.colleges)
          setTotalPages(data.pages)
          setTotalColleges(data.total)
        } catch (error) {
          console.error("Failed to load colleges:", error)
        }
      }
      loadPrograms()
    }, [page])

    useEffect(() => {
      const loadPrograms = async () => {
        try {
          const data = await fetchPrograms(page) 
          setTotalPrograms(data.total)
        } catch (error) {
          console.error("Failed to load programs:", error)
        }
      }
      loadPrograms()
    }, [])

    useEffect(() => {
      const loadPrograms = async () => {
        try {
          const data = await fetchStudents(page) 
          setTotalStudents(data.total)
        } catch (error) {
          console.error("Failed to load students:", error)
        }
      }
      loadPrograms()
    }, [])



   const filteredData = colleges.filter((college) => {
    if (searchBy === "all") {
      return Object.values(college)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    }

    const keyMap = {
      collegeCode: "collegeCode",
      collegeName: "collegeName"
    }

    const key = keyMap[searchBy]
    const value = college[key as keyof College]
    return value?.toString().toLowerCase().includes(search.toLowerCase())
  })
  return (
    <div className="container mx-auto py-1">
      <CardDemographic colleges={totalColleges} programs={totalPrograms} students={totalStudents} />

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
            onValueChange={(value) => setSearchBy(value as "all" | "collegeCode" | "collegeName")}
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

        <AddCollegeDialog />
          </div>

        <DataTable 
          columns={CollegeColumns} 
          data={filteredData}
          page={page}
          totalPages={totalPages}
          setPage={setPage} 
        />
      </div>
    </div>
  )
}

