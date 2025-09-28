"use client"

import { CardDemographic } from "@/components/cards"
import { StudentColumns, Student } from "../../table/student-columns"
import { DataTable } from "../../table/data-table"
import { AddStudentDialog } from "./add-dialog"
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
import { fetchStudents } from "@/lib/student-api"
import { fetchPrograms } from "@/lib/program-api"
import { fetchColleges } from "@/lib/college-api"
import { EditStudentDialog } from "./edit-dialog"
import { DeleteStudentDialog } from "./delete-dialog"


export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [totalColleges, setTotalColleges] = useState(0)
  const [totalPrograms, setTotalPrograms] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [search, setSearch] = useState("")
  const [searchBy, setSearchBy] = useState<"all" | "studentID" | "firstName" | "lastName" | "programCode" | "yearLevel" | "gender">("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [sortBy, setSortBy] = useState<"studentID" | "firstName" | "lastName" | "programCode" | "yearLevel" | "gender">("lastName")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student)
  }

  const loadStudents = async () => {
    setIsLoading(true)
    try {
      const data = await fetchStudents(page, 15, search, searchBy, sortBy, sortOrder)
      setStudents(data.students)
      setTotalPages(data.pages)
      setTotalStudents(data.total)
    } catch (error) {
      console.error("Failed to load students:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [page])

  useEffect(() => {
    loadStudents()
  }, [search, searchBy])

  useEffect(() => {
    loadStudents()
  }, [sortBy, sortOrder])

  useEffect(() => {
    const loadColleges = async () => {
      try {
        const data = await fetchColleges() 
        setTotalColleges(data.total)
      } catch (error) {
        console.error("Failed to load colleges:", error)
      }
    }
    loadColleges()
  }, [])

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const data = await fetchPrograms() 
        setTotalPrograms(data.total)
      } catch (error) {
        console.error("Failed to load programs:", error)
      }
    }
    loadPrograms()
  }, [])

  return (
    <div className="container mx-auto py-1">
      <CardDemographic colleges={totalColleges} programs={totalPrograms} students={totalStudents} />

      <div>
        <div className="flex items-center justify-between mb-4 mt-6">
          <div>
            <h2 className="text-2xl font-bold">Students</h2>
            <p className="text-muted-foreground">
              Here’s the list of students.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="relative max-w-sm">
              <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={searchBy}
              onValueChange={(value) => setSearchBy(value as typeof searchBy)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Search by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Search by</SelectItem>
                <SelectItem value="studentID">Student ID</SelectItem>
                <SelectItem value="firstName">First Name</SelectItem>
                <SelectItem value="lastName">Last Name</SelectItem>
                <SelectItem value="programCode">Program Code</SelectItem>
                <SelectItem value="yearLevel">Year Level</SelectItem>
                <SelectItem value="gender">Gender</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AddStudentDialog onStudentAdded={loadStudents} />
        </div>
          {isLoading ? (
            <div className="text-center py-6 text-muted-foreground">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No data.</div>
          ) : (
            <div className="transition-opacity duration-300 opacity-100">
              <DataTable 
                columns={StudentColumns(openEditDialog, setStudentToDelete, sortBy, sortOrder, setSortBy, setSortOrder)} 
                data={students}
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />

              {selectedStudent && (
                <EditStudentDialog
                  student={selectedStudent ?? { studentID: "", firstName: "", lastName: "", programCode: "", yearLevel: "", gender: "" }}
                  onStudentUpdated={() => {
                    loadStudents()
                    setSelectedStudent(null)
                  }}
                />
              )}

              {studentToDelete && (
                <DeleteStudentDialog
                  student={studentToDelete}
                  onStudentDeleted={() => {
                    loadStudents()
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
