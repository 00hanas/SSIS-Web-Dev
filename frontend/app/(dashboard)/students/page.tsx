"use client"

import { CardDemographic } from "@/components/cards"
import { StudentColumns, Student } from "../../table/student-columns"
import { DataTable } from "../../table/data-table"
import { AddStudentDialog } from "./add-dialog"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchSharp as SearchIcon } from '@mui/icons-material'

//to be replaced with actual data fetching logic
export const mockStudents: Student[] = [
  { id: "2023-0001", fname: "Juan", lname: "Dela Cruz", pcode: "BSCS", ylevel: 1, gender: "Male" },
  { id: "2023-0002", fname: "Maria", lname: "Santos", pcode: "BSCS", ylevel: 1, gender: "Female" },
  { id: "2023-0003", fname: "Pedro", lname: "Reyes", pcode: "BSIT", ylevel: 2, gender: "Male" },
  { id: "2023-0004", fname: "Ana", lname: "Torres", pcode: "BSIT", ylevel: 2, gender: "Female" },
  { id: "2023-0005", fname: "Mark", lname: "Lopez", pcode: "BSEE", ylevel: 3, gender: "Male" },
  { id: "2023-0006", fname: "Jenny", lname: "Garcia", pcode: "BSEE", ylevel: 3, gender: "Female" },
  { id: "2023-0007", fname: "Carlo", lname: "Ramos", pcode: "BSN", ylevel: 4, gender: "Male" },
  { id: "2023-0008", fname: "Sophia", lname: "Navarro", pcode: "BSN", ylevel: 4, gender: "Female" },
  { id: "2023-0009", fname: "Luis", lname: "Fernandez", pcode: "BSEd", ylevel: 1, gender: "Male" },
  { id: "2023-0010", fname: "Clara", lname: "Domingo", pcode: "BSEd", ylevel: 2, gender: "Female" },
  { id: "2023-0011", fname: "Miguel", lname: "Aguilar", pcode: "BEEd", ylevel: 3, gender: "Male" },
  { id: "2023-0012", fname: "Angela", lname: "Morales", pcode: "BEEd", ylevel: 4, gender: "Female" },
  { id: "2023-0013", fname: "Paolo", lname: "Castro", pcode: "BSAgri", ylevel: 2, gender: "Male" },
  { id: "2023-0014", fname: "Celine", lname: "Roxas", pcode: "BSAgri", ylevel: 3, gender: "Female" },
  { id: "2023-0015", fname: "Diego", lname: "Cortez", pcode: "DVM", ylevel: 5, gender: "Male" },
  { id: "2023-0016", fname: "Isabella", lname: "Velasquez", pcode: "DVM", ylevel: 5, gender: "Female" },
  { id: "2023-0017", fname: "Enrique", lname: "Martinez", pcode: "BSArch", ylevel: 4, gender: "Male" },
  { id: "2023-0018", fname: "Valerie", lname: "Jimenez", pcode: "BSArch", ylevel: 3, gender: "Female" },
  { id: "2023-0019", fname: "Adrian", lname: "Soriano", pcode: "BSIS", ylevel: 2, gender: "Male" },
  { id: "2023-0020", fname: "Patricia", lname: "Cruz", pcode: "BSIS", ylevel: 1, gender: "Female" },
  { id: "2023-0021", fname: "Javier", lname: "Bautista", pcode: "BSMarE", ylevel: 4, gender: "Male" },
  { id: "2023-0022", fname: "Nicole", lname: "Aquino", pcode: "BSMarE", ylevel: 4, gender: "Female" },
  { id: "2023-0023", fname: "Francis", lname: "Villanueva", pcode: "BSPsy", ylevel: 3, gender: "Male" },
  { id: "2023-0024", fname: "Ella", lname: "Mendoza", pcode: "BSPsy", ylevel: 3, gender: "Female" },
  { id: "2023-0025", fname: "Gabriel", lname: "Rivera", pcode: "BSPharm", ylevel: 2, gender: "Male" },
  { id: "2023-0026", fname: "Monica", lname: "Flores", pcode: "BSPharm", ylevel: 2, gender: "Female" },
  { id: "2023-0027", fname: "Victor", lname: "Del Rosario", pcode: "BSComm", ylevel: 1, gender: "Male" },
  { id: "2023-0028", fname: "Hannah", lname: "Salazar", pcode: "BSComm", ylevel: 1, gender: "Female" },
  { id: "2023-0029", fname: "Samuel", lname: "Galang", pcode: "BSMath", ylevel: 2, gender: "Male" },
  { id: "2023-0030", fname: "Katrina", lname: "Reyes", pcode: "BSMath", ylevel: 2, gender: "Female" },
]


export default function StudentsPage() {
  const [search, setSearch] = useState("")
  const [searchBy, setSearchBy] = useState<"all" | "id" | "fname" | "lname" | "pcode" | "ylevel" | "gender">("all")

   const filteredData = mockStudents.filter((student) => {
    if (searchBy === "all") {
      return Object.values(student)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    }

    const value = student[searchBy]
    return value.toString().toLowerCase().includes(search.toLowerCase())
  })
  return (
    <div className="container mx-auto py-1">
      <CardDemographic colleges={5} programs={12} students={300} />

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
            onValueChange={(value) => setSearchBy(value as "all" | "id" | "fname" | "lname" | "pcode" | "ylevel" | "gender")}
            >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Search by</SelectItem>
              <SelectItem value="id">Student ID</SelectItem>
              <SelectItem value="fname">First Name</SelectItem>
              <SelectItem value="lname">Last Name</SelectItem>
              <SelectItem value="pcode">Program Code</SelectItem>
              <SelectItem value="ylevel">Year Level</SelectItem>
              <SelectItem value="gender">Gender</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AddStudentDialog />
          </div>

        <DataTable columns={StudentColumns} data={filteredData} />
      </div>
    </div>
  )
}

