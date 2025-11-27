"use client"

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
import { useCallback, useEffect, useState } from "react"
import { EditProgramDialog } from "@/components/program-ui/edit-dialog"
import { DeleteProgramDialog } from "@/components/program-ui/delete-dialog"
import { useAuth } from "@/hooks/useAuth"
import { PageSkeleton } from "@/components/global/page-skeleton"
import { SearchInput } from "@/components/global/search-input"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchProgramsFiltered } from "@/lib/api/program-api"

export default function ProgramsPage() {
  const { authenticated, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])
  const [filteredTotalPrograms, setFilteredTotalPrograms] = useState(0)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null)
  const [search, setSearch] = useState("")
  const [searchBy, setSearchBy] = useState<
    "all" | "programCode" | "programName" | "collegeCode"
  >("all")
  const [sortBy, setSortBy] = useState<
    "programCode" | "programName" | "collegeCode"
  >("programCode")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const openEditDialog = (program: Program) => {
    setSelectedProgram(program)
  }

  const fetchPrograms = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchProgramsFiltered(
        page,
        15,
        search,
        searchBy,
        sortBy,
        sortOrder
      )
      setPrograms(data.programs)
      setTotalPages(data.pages)
      setFilteredTotalPrograms(data.total)
    } catch (error) {
      console.error("Failed to load programs:", error)
    } finally {
      setIsLoading(false)
    }
  }, [page, search, searchBy, sortBy, sortOrder])

  useEffect(() => {
    if (authenticated) {
      fetchPrograms()
    }
  }, [authenticated, fetchPrograms])

  if (loading) {
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
      <div className="container mb-2">
        <h1 className="mb text-2xl font-semibold tracking-wide">Programs</h1>
      </div>
      <div className="mb-4 flex">
        <div className="flex gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            total={filteredTotalPrograms}
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
          <AddProgramDialog onProgramAdded={fetchPrograms} />
        </div>
      </div>

      <div className="container">
        {isLoading ? (
          <Skeleton className="container mx-auto h-[600px] rounded-xl py-10" />
        ) : programs.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center">No data.</div>
        ) : (
          <div className="mb-2 opacity-100 transition-opacity duration-300">
            <DataTable
              columns={ProgramColumns(
                openEditDialog,
                setProgramToDelete,
                sortBy,
                sortOrder,
                setSortBy,
                setSortOrder
              )}
              data={programs}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />

            {selectedProgram && (
              <EditProgramDialog
                program={selectedProgram}
                visible={true}
                onClose={() => setSelectedProgram(null)}
                onProgramUpdated={() => {
                  fetchPrograms()
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
                  fetchPrograms()
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
