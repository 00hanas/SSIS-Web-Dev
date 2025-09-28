"use client"

import { CardDemographic } from "@/components/cards"
import { ProgramColumns, Program } from "../../table/programs-columns"
import { DataTable } from "../../table/data-table"
import { AddProgramDialog } from "./add-dialog"
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
import { EditProgramDialog } from "./edit-dialog"
import { DeleteProgramDialog } from "./delete-dialog"

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [totalColleges, setTotalColleges] = useState(0)
  const [totalPrograms, setTotalPrograms] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [search, setSearch] = useState("")
  const [searchBy, setSearchBy] = useState<"all" | "programCode" | "programName" | "collegeCode">("all")
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null)

  const openEditDialog = (program: Program) => {
    setSelectedProgram(program)
  }

  const loadPrograms = async () => {
    setIsLoading(true)
      try {
        const data = await fetchPrograms(page)
        setPrograms(data.programs)
        setTotalPages(data.pages)
        setTotalPrograms(data.total)
      } catch (error) {
        console.error("Failed to load programs:", error)
      } finally {
        setIsLoading(false)
      }
    }
  
  useEffect(() => {
    loadPrograms()
  }, [page])

  useEffect(() => {
      const loadColleges = async () => {
        try {
          const data = await fetchColleges(page) 
          setTotalColleges(data.total)
        } catch (error) {
          console.error("Failed to load colleges:", error)
        }
      }
      loadColleges()
    }, [])

    useEffect(() => {
      const loadStudents = async () => {
        try {
          const data = await fetchStudents(page) 
          setTotalStudents(data.total)
        } catch (error) {
          console.error("Failed to load students:", error)
        }
      }
      loadStudents()
    }, [])

  return (
    <div className="container mx-auto py-1">
      <CardDemographic colleges={totalColleges} programs={totalPrograms} students={totalStudents} />

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
            onValueChange={(value) => setSearchBy(value as "all" | "programCode" | "programName" | "collegeCode")}
            >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Search by</SelectItem>
              <SelectItem value="programCode">Program Code</SelectItem>
              <SelectItem value="programName">Program Name</SelectItem>
              <SelectItem value="collegeCode">College Code</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AddProgramDialog onProgramAdded={loadPrograms}/>
        </div>
          {isLoading ? (
            <div className="text-center py-6 text-muted-foreground">Loading programs...</div>
          ) : programs.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">Loading programs...</div>
          ) : (
            (() => {
              const filteredData = programs.filter((program) => {
                if (searchBy === "all") {
                  return Object.values(program)
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase())
                }

                const keyMap = {
                  programCode: "programCode",
                  programName: "programName",
                  collegeCode: "collegeCode",
                }

                const key = keyMap[searchBy]
                const value = program[key as keyof Program]
                return value?.toString().toLowerCase().includes(search.toLowerCase())
              })

              return (
                <div className="transition-opacity duration-300 opacity-100">
                  <DataTable 
                    columns={ProgramColumns(openEditDialog, setProgramToDelete)} 
                    data={filteredData}
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                  />
  
                  {selectedProgram && (
                    <EditProgramDialog
                      program={selectedProgram ?? { programCode: "", programName: "", collegeCode: "" }}
                      onProgramUpdated={() => {
                        loadPrograms()
                        setSelectedProgram(null)
                      }}
                    />
                  )}

                  {programToDelete && (
                    <DeleteProgramDialog
                      program={programToDelete}
                      onProgramDeleted={() => {
                        loadPrograms()
                        setProgramToDelete(null)
                      }}
                    />
                  )}
                </div>
              )
            })()
          )}
      </div>
    </div>
  )
}