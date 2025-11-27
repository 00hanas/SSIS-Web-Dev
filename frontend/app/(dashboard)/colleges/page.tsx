"use client"

import { CardDemographic } from "@/components/dashboard-ui/cards"
import { CollegeColumns, College } from "@/components/table/college-columns"
import { DataTable } from "@/components/table/data-table"
import { AddCollegeDialog } from "@/components/college-ui/add-dialog"
import { useEffect, useState } from "react"
import { EditCollegeDialog } from "@/components/college-ui/edit-dialog"
import { DeleteCollegeDialog } from "@/components/college-ui/delete-dialog"
import { useAuth } from "@/hooks/useAuth"
import { PageSkeleton } from "@/components/global/page-skeleton"
import { SearchInput } from "@/components/college-ui/search-input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { loadColleges, loadPrograms, loadStudents } from "@/lib/loaders"
import { SortingState } from "@tanstack/react-table"

export default function CollegesPage() {
  const { authenticated, loading } = useAuth()
  const [initialLoading, setInitialLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [colleges, setColleges] = useState<College[]>([])
  const [totalColleges, setTotalColleges] = useState(0)
  const [totalPrograms, setTotalPrograms] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [collegeToDelete, setCollegeToDelete] = useState<College | null>(null)
  const [searchBy, setSearchBy] = useState<
    "all" | "collegeCode" | "collegeName"
  >("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])

  const openEditDialog = (college: College) => {
    setSelectedCollege(college)
  }

  useEffect(() => {
    const fetchCollegesData = async () => {
      try {
        const { colleges, total } = await loadColleges()
        setColleges(colleges)
        setTotalColleges(total)
      } catch (error) {
        console.error("Failed to load colleges:", error)
      } finally {
        setInitialLoading(false)
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

  const refreshColleges = async () => {
    setIsLoading(true)
    try {
      const { colleges, total } = await loadColleges()
      setColleges(colleges)
      setTotalColleges(total)
    } catch (error) {
      console.error("Failed to refresh colleges:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredColleges = colleges.filter((college) => {
    const term = searchTerm.toLowerCase()
    if (!term) return true

    if (searchBy === "collegeCode") {
      return college.collegeCode.toLowerCase().includes(term)
    }
    if (searchBy === "collegeName") {
      return college.collegeName.toLowerCase().includes(term)
    }
    return (
      college.collegeCode.toLowerCase().includes(term) ||
      college.collegeName.toLowerCase().includes(term)
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
        <h1 className="mb text-2xl font-semibold tracking-wide">Colleges</h1>
        <p className="mb tracking-wide">Here&apos;s the list of colleges.</p>
      </div>
      <div className="mb-4 flex">
        <div className="flex gap-2">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            total={filteredColleges.length}
          />

          <Select
            value={searchBy}
            onValueChange={(val) =>
              setSearchBy(val as "all" | "collegeCode" | "collegeName")
            }
          >
            <SelectTrigger className="w-[150px] cursor-pointer">
              <SelectValue placeholder="Search By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="all">
                Search By
              </SelectItem>
              <SelectItem className="cursor-pointer" value="collegeCode">
                College Code
              </SelectItem>
              <SelectItem className="cursor-pointer" value="collegeName">
                College Name
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="ml-auto">
          <AddCollegeDialog onCollegeAdded={refreshColleges} />
        </div>
      </div>

      <div className="container">
        {isLoading ? (
          <Skeleton className="container mx-auto h-[300px] rounded-xl py-10" />
        ) : colleges.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center">No data.</div>
        ) : (
          <div>
            <div className="mb-2 opacity-100 transition-opacity duration-300">
              <DataTable
                columns={CollegeColumns(openEditDialog, setCollegeToDelete)}
                data={filteredColleges}
                sorting={sorting}
                setSorting={setSorting}
              />

              {selectedCollege && (
                <EditCollegeDialog
                  college={selectedCollege}
                  visible={true}
                  onClose={() => setSelectedCollege(null)}
                  onCollegeUpdated={() => {
                    refreshColleges()
                    setSelectedCollege(null)
                  }}
                />
              )}

              {collegeToDelete && (
                <DeleteCollegeDialog
                  college={collegeToDelete}
                  visible={true}
                  onClose={() => setCollegeToDelete(null)}
                  onCollegeDeleted={() => {
                    refreshColleges()
                    setCollegeToDelete(null)
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
