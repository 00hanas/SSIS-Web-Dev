"use client"

import {
  StudentColumns,
  Student,
} from "../../../components/table/student-columns"
import { DataTable } from "../../../components/table/data-table"
import { AddStudentDialog } from "../../../components/student-ui/add-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCallback, useEffect, useState } from "react"
import { EditStudentDialog } from "../../../components/student-ui/edit-dialog"
import { DeleteStudentDialog } from "../../../components/student-ui/delete-dialog"
import { useAuth } from "@/hooks/useAuth"
import { PageSkeleton } from "@/components/global/page-skeleton"
import { SearchInput } from "@/components/global/search-input"
import { Skeleton } from "@/components/ui/skeleton"
import { ViewStudentDialog } from "@/components/student-ui/view-dialog"
import { fetchStudentsFiltered } from "@/lib/api/student-api"
import {
  FilterDropdown,
  Filters,
} from "@/components/student-ui/filter-dropdown"
import { fetchProgramsForDropdown } from "@/lib/api/program-api"

export default function StudentsPage() {
  const { authenticated, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [filteredTotalStudents, setFilteredTotalStudents] = useState(0)
  const [viewSelectedStudent, setViewStudent] = useState<Student | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [search, setSearch] = useState("")
  const [searchBy, setSearchBy] = useState<
    | "all"
    | "studentID"
    | "firstName"
    | "lastName"
    | "programCode"
    | "yearLevel"
    | "gender"
  >("all")
  const [sortBy, setSortBy] = useState<
    | "studentID"
    | "firstName"
    | "lastName"
    | "programCode"
    | "yearLevel"
    | "gender"
  >("studentID")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [programCodes, setProgramCodes] = useState<string[]>([])
  const [filters, setFilters] = useState<Filters>({
    yearLevels: [],
    genders: [],
    programCodes: [],
  })

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student)
  }

  const openViewDialog = (student: Student) => {
    setViewStudent(student)
  }

  const fetchStudents = useCallback(async () => {
    setIsLoading(true)
    try {
      const transformedFilters = {
        programCode: filters.programCodes,
        gender: filters.genders,
        yearLevel: filters.yearLevels,
      }

      const data = await fetchStudentsFiltered(
        page,
        10,
        search,
        searchBy,
        sortBy,
        sortOrder,
        transformedFilters
      )
      setStudents(data.students)
      setTotalPages(data.pages)
      setFilteredTotalStudents(data.total)
    } catch (error) {
      console.error("Failed to load students:", error)
    } finally {
      setIsLoading(false)
    }
  }, [page, search, searchBy, sortBy, sortOrder, filters])

  const fetchProgramCodes = useCallback(async () => {
    setIsLoading(true)
    try {
      const codes = (await fetchProgramsForDropdown()).map((p) => p.programCode)
      setProgramCodes(codes)
    } catch (error) {
      console.error("Failed to fetch program codes:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authenticated) {
      fetchStudents()
      fetchProgramCodes()
    }
  }, [authenticated, fetchStudents, fetchProgramCodes])

  useEffect(() => {
    if (authenticated) {
      fetchStudents()
    }
  }, [filters])

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
        <h1 className="mb text-2xl font-semibold tracking-wide">Students</h1>
      </div>
      <div className="mb-4 flex">
        <div className="flex gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            total={filteredTotalStudents}
          />

          <Select
            value={searchBy}
            onValueChange={(val) =>
              setSearchBy(
                val as
                  | "all"
                  | "studentID"
                  | "firstName"
                  | "lastName"
                  | "programCode"
                  | "yearLevel"
                  | "gender"
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
              <SelectItem className="cursor-pointer" value="studentID">
                Student ID
              </SelectItem>
              <SelectItem className="cursor-pointer" value="firstName">
                First Name
              </SelectItem>
              <SelectItem className="cursor-pointer" value="lastName">
                Last Name
              </SelectItem>
              <SelectItem className="cursor-pointer" value="programCode">
                Program Code
              </SelectItem>
              <SelectItem className="cursor-pointer" value="yearLevel">
                Year Level
              </SelectItem>
              <SelectItem className="cursor-pointer" value="gender">
                Gender
              </SelectItem>
            </SelectContent>
          </Select>
          <FilterDropdown
            filters={filters}
            setFilters={(updater) => setFilters((prev) => updater(prev))}
            availableOptions={{
              yearLevels: [1, 2, 3, 4, 5],
              genders: ["Male", "Female"],
              programCodes: programCodes,
            }}
          />
        </div>
        <div className="ml-auto">
          <AddStudentDialog onStudentAdded={fetchStudents} />
        </div>
      </div>

      <div className="container">
        {isLoading ? (
          <Skeleton className="container mx-auto h-[600px] rounded-xl py-10" />
        ) : students.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center">No data.</div>
        ) : (
          <div className="mb-2 opacity-100 transition-opacity duration-300">
            <DataTable
              columns={StudentColumns(
                openViewDialog,
                openEditDialog,
                setStudentToDelete,
                sortBy,
                sortOrder,
                setSortBy,
                setSortOrder
              )}
              data={students}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />

            {viewSelectedStudent && (
              <ViewStudentDialog
                student={viewSelectedStudent}
                visible={true}
                onClose={() => setViewStudent(null)}
              />
            )}

            {selectedStudent && (
              <EditStudentDialog
                student={selectedStudent}
                visible={true}
                onClose={() => setSelectedStudent(null)}
                onStudentUpdated={() => {
                  fetchStudents()
                  setSelectedStudent(null)
                }}
              />
            )}

            {studentToDelete && (
              <DeleteStudentDialog
                student={studentToDelete}
                visible={true}
                onClose={() => setStudentToDelete(null)}
                onStudentDeleted={() => {
                  fetchStudents()
                  setStudentToDelete(null)
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
