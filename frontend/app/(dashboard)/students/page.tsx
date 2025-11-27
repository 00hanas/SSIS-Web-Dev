"use client"

import { CardDemographic } from "@/components/dashboard-ui/cards"
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
import { useEffect, useState } from "react"
import { EditStudentDialog } from "../../../components/student-ui/edit-dialog"
import { DeleteStudentDialog } from "../../../components/student-ui/delete-dialog"
import { useAuth } from "@/hooks/useAuth"
import { SortingState } from "@tanstack/react-table"
import { loadColleges, loadPrograms, loadStudents } from "@/lib/loaders"
import { PageSkeleton } from "@/components/global/page-skeleton"
import { SearchInput } from "@/components/college-ui/search-input"
import { Skeleton } from "@/components/ui/skeleton"
import { ViewStudentDialog } from "@/components/student-ui/view-dialog"

export default function StudentsPage() {
  const { authenticated, loading } = useAuth()
  const [initialLoading, setInitialLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [totalColleges, setTotalColleges] = useState(0)
  const [totalPrograms, setTotalPrograms] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [viewSelectedStudent, setViewStudent] = useState<Student | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [searchBy, setSearchBy] = useState<
    | "all"
    | "studentID"
    | "firstName"
    | "lastName"
    | "programCode"
    | "yearLevel"
    | "gender"
  >("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student)
  }

  const openViewDialog = (student: Student) => {
    setViewStudent(student)
  }

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const { students, total } = await loadStudents()
        setStudents(students)
        setTotalStudents(total)
      } catch (error) {
        console.error("Failed to load students:", error)
      } finally {
        setInitialLoading(false)
      }
    }
    fetchStudentsData()
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
    const fetchProgramsData = async () => {
      try {
        const { total } = await loadPrograms()
        setTotalPrograms(total)
      } catch (error) {
        console.error("Failed to load programs:", error)
      }
    }
    fetchProgramsData()
  }, [])

  const refreshStudents = async () => {
    setIsLoading(true)
    try {
      const { students, total } = await loadStudents()
      setStudents(students)
      setTotalStudents(total)
    } catch (error) {
      console.error("Failed to refresh students:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStudents = students.filter((student) => {
    const term = searchTerm.toLowerCase()
    if (!term) return true

    if (searchBy === "studentID") {
      return student.studentID.toLowerCase().includes(term)
    }
    if (searchBy === "firstName") {
      return student.firstName.toLowerCase().includes(term)
    }
    if (searchBy === "lastName") {
      return student.lastName.toLowerCase().includes(term)
    }
    if (searchBy === "programCode") {
      return student.programCode.toLowerCase().includes(term)
    }
    if (searchBy === "yearLevel") {
      return student.yearLevel.toString().includes(term)
    }
    if (searchBy === "gender") {
      return student.gender.toLowerCase().includes(term)
    }
    return (
      student.studentID.toLowerCase().includes(term) ||
      student.firstName.toLowerCase().includes(term) ||
      student.lastName.toLowerCase().includes(term) ||
      student.programCode.toLowerCase().includes(term) ||
      student.yearLevel.toString().includes(term) ||
      student.gender.toLowerCase().includes(term)
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
        <h1 className="mb text-2xl font-semibold tracking-wide">Students</h1>
        <p className="mb tracking-wide">Here&apos;s the list of students.</p>
      </div>

      <div className="mb-4 flex">
        <div className="flex gap-2">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            total={filteredStudents.length}
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
        </div>
        <div className="ml-auto">
          <AddStudentDialog onStudentAdded={refreshStudents} />
        </div>
      </div>

      <div className="container">
        {isLoading ? (
          <Skeleton className="container mx-auto h-[300px] rounded-xl py-10" />
        ) : students.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center">No data.</div>
        ) : (
          <div className="mb-2 opacity-100 transition-opacity duration-300">
            <DataTable
              columns={StudentColumns(
                openViewDialog,
                openEditDialog,
                setStudentToDelete
              )}
              data={filteredStudents}
              sorting={sorting}
              setSorting={setSorting}
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
                  refreshStudents()
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
                  refreshStudents()
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
