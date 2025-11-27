"use client"

import { CollegeColumns, College } from "@/components/table/college-columns"
import { DataTable } from "@/components/table/data-table"
import { AddCollegeDialog } from "@/components/college-ui/add-dialog"
import { useCallback, useEffect, useState } from "react"
import { EditCollegeDialog } from "@/components/college-ui/edit-dialog"
import { DeleteCollegeDialog } from "@/components/college-ui/delete-dialog"
import { useAuth } from "@/hooks/useAuth"
import { PageSkeleton } from "@/components/global/page-skeleton"
import { SearchInput } from "@/components/global/search-input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchCollegesFiltered } from "@/lib/api/college-api"

export default function CollegesPage() {
  const { authenticated, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [colleges, setColleges] = useState<College[]>([])
  const [filteredTotalColleges, setFilteredTotalColleges] = useState(0)
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [collegeToDelete, setCollegeToDelete] = useState<College | null>(null)
  const [search, setSearch] = useState("")
  const [searchBy, setSearchBy] = useState<
    "all" | "collegeCode" | "collegeName"
  >("all")
  const [sortBy, setSortBy] = useState<"collegeCode" | "collegeName">(
    "collegeCode"
  )
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const openEditDialog = (college: College) => {
    setSelectedCollege(college)
  }

  const fetchColleges = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchCollegesFiltered(
        page,
        15,
        search,
        searchBy,
        sortBy,
        sortOrder
      )
      setColleges(data.colleges)
      setTotalPages(data.pages)
      setFilteredTotalColleges(data.total)
    } catch (error) {
      console.error("Failed to load colleges:", error)
    } finally {
      setIsLoading(false)
    }
  }, [page, search, searchBy, sortBy, sortOrder])

  useEffect(() => {
    if (authenticated) {
      fetchColleges()
    }
  }, [authenticated, fetchColleges])

  useEffect(() => {
    if (authenticated) {
      fetchColleges()
    }
  }, [authenticated, fetchColleges])

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
        <h1 className="mb text-2xl font-semibold tracking-wide">Colleges</h1>
      </div>
      <div className="mb-4 flex">
        <div className="flex gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            total={filteredTotalColleges}
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
          <AddCollegeDialog onCollegeAdded={fetchColleges} />
        </div>
      </div>

      <div className="container">
        {isLoading ? (
          <Skeleton className="container mx-auto h-[600px] rounded-xl py-10" />
        ) : colleges.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center">No data.</div>
        ) : (
          <div>
            <div className="mb-2 opacity-100 transition-opacity duration-300">
              <DataTable
                columns={CollegeColumns(
                  openEditDialog,
                  setCollegeToDelete,
                  sortBy,
                  sortOrder,
                  setSortBy,
                  setSortOrder
                )}
                data={colleges}
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />

              {selectedCollege && (
                <EditCollegeDialog
                  college={selectedCollege}
                  visible={true}
                  onClose={() => setSelectedCollege(null)}
                  onCollegeUpdated={() => {
                    fetchColleges()
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
                    fetchColleges()
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
