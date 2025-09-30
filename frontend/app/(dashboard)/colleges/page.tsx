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
import { EditCollegeDialog } from "./edit-dialog"
import { DeleteCollegeDialog } from "./delete-dialog"
import { useAuth } from "@/hooks/useAuth"

export default function CollegesPage() {
  const { authenticated, loading } = useAuth()
  const [colleges, setColleges] = useState<College[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [totalColleges, setTotalColleges] = useState(0)
  const [totalPrograms, setTotalPrograms] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [search, setSearch] = useState("")
  const [searchBy, setSearchBy] = useState<"all" | "collegeCode" | "collegeName">("all")
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [collegeToDelete, setCollegeToDelete] = useState<College | null>(null)
  const [sortBy, setSortBy] = useState<"collegeCode" | "collegeName">("collegeCode")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const openEditDialog = (college: College) => {
    setSelectedCollege(college)
  }

  const loadColleges = async () => {
    setIsLoading(true)
    try {
      const data = await fetchColleges(page, 15, search, searchBy, sortBy, sortOrder)
      setColleges(data.colleges)
      setTotalPages(data.pages)
      setTotalColleges(data.total)
    } catch (error) {
      console.error("Failed to load colleges:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadColleges()
    }, 300)
    return () => clearTimeout(timeout)
  }, [search, searchBy, page, sortBy, sortOrder])

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const data = await fetchPrograms(page, 15, "", "all", "programCode", "asc") 
        setTotalPrograms(data.total)
      } catch (error) {
        console.error("Failed to load programs:", error)
      }
    }
    loadPrograms()
    }, [])

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudents(page, 15, "", "all", "lastName", "asc") 
        setTotalStudents(data.total)
      } catch (error) {
        console.error("Failed to load students:", error)
      }
    }
    loadStudents()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!authenticated && !loading) {
    return <div className="text-center py-6 text-muted-foreground">Redirecting to login...</div>
  }

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
              <SelectItem value="collegeCode">College Code</SelectItem>
              <SelectItem value="collegeName">College Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AddCollegeDialog onCollegeAdded={loadColleges}/>
          </div>
        {isLoading ? (
          <div className="text-center py-6 text-muted-foreground">Loading colleges...</div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No data.</div>
        ) : (
          <div className="transition-opacity duration-300 opacity-100">
            <DataTable 
              columns={CollegeColumns(openEditDialog, setCollegeToDelete, sortBy, sortOrder, setSortBy, setSortOrder)} 
              data={colleges}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />

            {selectedCollege && (
              <EditCollegeDialog
                college={selectedCollege ?? { collegeCode: "", collegeName: "" }}
                onCollegeUpdated={() => {
                  loadColleges()
                  setSelectedCollege(null)
                }}
              />
            )}

            {collegeToDelete && (
              <DeleteCollegeDialog
                college={collegeToDelete}
                onCollegeDeleted={() => {
                  loadColleges()
                  setCollegeToDelete(null)
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

