"use client"

import { CardDemographic } from "@/components/dashboard-ui/cards"
import { ProgramColumns, Program } from "@/components/table/program-columns"
import { DataTable } from "@/components/table/data-table"
import { AddProgramDialog } from "@/components/program-ui/add-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { EditProgramDialog } from "@/components/program-ui/edit-dialog"
import { DeleteProgramDialog } from "@/components/program-ui/delete-dialog"
import { useAuth } from "@/hooks/useAuth"
import { loadColleges, loadPrograms, loadStudents } from "@/lib/loaders"
import { PageSkeleton } from "@/components/global/page-skeleton"
import { SearchInput } from "@/components/college-ui/search-input"
import Skeleton from "@mui/material/Skeleton"
import { SortingState } from "@tanstack/react-table"

export default function ProgramsPage() {
  const { authenticated, loading } = useAuth()
  const [initialLoading, setInitialLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])
  const [totalColleges, setTotalColleges] = useState(0)
  const [totalPrograms, setTotalPrograms] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null)
  const [searchBy, setSearchBy] = useState<
    "all" | "programCode" | "programName" | "collegeCode"
  >("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])

  const openEditDialog = (program: Program) => {
    setSelectedProgram(program)
  }

  useEffect(() => {
    const fetchProgramsData = async () => {
      try {
        const { programs, total } = await loadPrograms()
        setPrograms(programs)
        setTotalPrograms(total)
      } catch (error) {
        console.error("Failed to load programs:", error)
      } finally {
        setInitialLoading(false)
      }
    }
    fetchProgramsData()
  }, [])

  useEffect(() => {
    const fetchCollegesData = async () => {
      try {
        const { total } = await loadColleges()
        setTotalColleges(total)
      } catch (error) {
        console.error("Failed to load colleges:", error)
      }
    }
    fetchCollegesData()
  }, [])

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const { total } = await loadStudents()
        setTotalStudents(total)
      } catch (error) {
        console.error("Failed to load students:", error)
      }
    }
    fetchStudentsData()
  }, [])

  const refreshPrograms = async () => {
    setIsLoading(true)
    try {
      const { programs, total } = await loadPrograms()
      setPrograms(programs)
      setTotalPrograms(total)
    } catch (error) {
      console.error("Failed to refresh programs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPrograms = programs.filter((program) => {
    const term = searchTerm.toLowerCase()
    if (!term) return true

    if (searchBy === "programCode") {
      return program.programCode.toLowerCase().includes(term)
    }
    if (searchBy === "programName") {
      return program.programName.toLowerCase().includes(term)
    }
    if (searchBy === "collegeCode") {
      return program.collegeCode.toLowerCase().includes(term)
    }
    return (
      program.programCode.toLowerCase().includes(term) ||
      program.programName.toLowerCase().includes(term) ||
      program.collegeCode.toLowerCase().includes(term)
    )
  })

  if (loading || initialLoading) {
    return <PageSkeleton />
  }
  if (!authenticated && !loading) {
    return (
      <div className="text-muted-foreground py-6 text-center">
        Redirecting to login...
      </div>
    )
  }

  return (
    <div className="container w-full justify-center px-6">
      <CardDemographic
        colleges={totalColleges}
        programs={totalPrograms}
        students={totalStudents}
      />

      <div className="container mt-5 mb-2 flex flex-col">
        <h1 className="mb text-2xl font-semibold tracking-wide">Programs</h1>
        <p className="mb tracking-wide">Here&apos;s the list of programs.</p>
      </div>

      <div className="mb-4 flex">
        <div className="flex gap-2">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            total={filteredPrograms.length}
          />

          <Select
            value={searchBy}
            onValueChange={(val) =>
              setSearchBy(
                val as "all" | "programCode" | "programName" | "collegeCode"
              )
            }
          >
            <SelectTrigger className="w-[150px] cursor-pointer">
              <SelectValue placeholder="Search By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="all">
                Search By
              </SelectItem>
              <SelectItem className="cursor-pointer" value="programCode">
                Program Code
              </SelectItem>
              <SelectItem className="cursor-pointer" value="programName">
                Program Name
              </SelectItem>
              <SelectItem className="cursor-pointer" value="collegeCode">
                College Code
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="ml-auto">
          <AddProgramDialog onProgramAdded={refreshPrograms} />
        </div>
      </div>

      <div className="container">
        {isLoading ? (
          <Skeleton className="container mx-auto h-[300px] rounded-xl py-10" />
        ) : programs.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center">No data.</div>
        ) : (
          <div className="mb-2 opacity-100 transition-opacity duration-300">
            <DataTable
              columns={ProgramColumns(openEditDialog, setProgramToDelete)}
              data={filteredPrograms}
              sorting={sorting}
              setSorting={setSorting}
            />

            {selectedProgram && (
              <EditProgramDialog
                program={selectedProgram}
                visible={true}
                onClose={() => setSelectedProgram(null)}
                onProgramUpdated={() => {
                  refreshPrograms()
                  setSelectedProgram(null)
                }}
              />
            )}

            {programToDelete && (
              <DeleteProgramDialog
                program={programToDelete}
                visible={true}
                onClose={() => setProgramToDelete(null)}
                onProgramDeleted={() => {
                  refreshPrograms()
                  setProgramToDelete(null)
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
