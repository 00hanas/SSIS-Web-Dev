"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SwapVertSharp as SortIcon } from "@mui/icons-material"
import { EditNoteSharp as EditIcon } from '@mui/icons-material'
import { DeleteOutlineSharp as DeleteIcon } from '@mui/icons-material'


export type Student = {
    studentID: string
    firstName: string
    lastName: string
    programCode: string
    yearLevel: 1 | 2 | 3 | 4 | 5
    gender: "Female" | "Male"
}

export const StudentColumns = (
  setEditDialog: (student: Student) => void,
  setDeleteDialog: (student: Student) => void,
  sortBy: "studentID" | "firstName" | "lastName" | "programCode" | "yearLevel" | "gender",
  sortOrder: "asc" | "desc",
  setSortBy: (key: "studentID" | "firstName" | "lastName" | "programCode" | "yearLevel" | "gender") => void,
  setSortOrder: (order: "asc" | "desc") => void
): ColumnDef<Student>[] => [
    {
        accessorKey: "studentID",
        size:150,
        header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            if (sortBy === "studentID") {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
            } else {
              setSortBy("studentID")
              setSortOrder("asc")
            }
          }}
        >
          Student ID
          <SortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    },
    {
        accessorKey: "firstName",
        header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            if (sortBy === "firstName") {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
            } else {
              setSortBy("firstName")
              setSortOrder("asc")
            }
          }}
        >
          First Name
          <SortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    },
    {
        accessorKey: "lastName",
        header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            if (sortBy === "lastName") {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
            } else {
              setSortBy("lastName")
              setSortOrder("asc")
            }
          }}
        >
          Last Name
          <SortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    },
    {
        accessorKey: "programCode",
        header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            if (sortBy === "programCode") {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
            } else {
              setSortBy("programCode")
              setSortOrder("asc")
            }
          }}
        >
          Program Code
          <SortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const value = row.getValue("programCode")
        return value === "N/A"
          ? <span className="text-muted-foreground italic">N/A</span>
          : value
      }
    },
    {
        accessorKey: "yearLevel",
        header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            if (sortBy === "yearLevel") {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
            } else {
              setSortBy("yearLevel")
              setSortOrder("asc")
            }
          }}
        >
          Year Level
          <SortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    },
    {   
        accessorKey: "gender",
        header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            if (sortBy === "gender") {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
            } else {
              setSortBy("gender")
              setSortOrder("asc")
            }
          }}
        >
          Gender
          <SortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    },
    {
    id: "actions",
    size: 100,
    cell: ({ row }) => {
      const student = row.original
 
      return (
        <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-5 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Button
              variant="ghost"
              className="w-full flex justify-between"
              onClick={() => setEditDialog(student)}
            >
              <span>Edit</span>
              <EditIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              className="w-full flex justify-between"
              onClick={() => setDeleteDialog(student)}
            >
              <span>Delete</span>
              <DeleteIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      )
    },
  },
]