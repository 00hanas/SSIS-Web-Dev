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
import { EditNoteSharp as EditIcon } from "@mui/icons-material"
import { DeleteOutlineSharp as DeleteIcon } from "@mui/icons-material"

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
  setDeleteDialog: (student: Student) => void
): ColumnDef<Student>[] => [
  {
    accessorKey: "studentID",
    size: 150,
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        Student ID
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </Button>
    ),
    cell: ({ getValue }) => getValue() ?? "—",
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        First Name
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </Button>
    ),
    cell: ({ getValue }) => getValue() ?? "—",
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        Last Name
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </Button>
    ),
    cell: ({ getValue }) => getValue() ?? "—",
  },
  {
    accessorKey: "programCode",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        Program Code
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("programCode")
      return value === "N/A" ? (
        <span className="text-muted-foreground italic">N/A</span>
      ) : (
        value
      )
    },
  },
  {
    accessorKey: "yearLevel",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        Year Level
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </Button>
    ),
    cell: ({ getValue }) => getValue() ?? "—",
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        Gender
        {column.getIsSorted() === "asc"}
        {column.getIsSorted() === "desc"}
      </Button>
    ),
    cell: ({ getValue }) => getValue() ?? "—",
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
              <Button variant="ghost" className="h-5 w-8 cursor-pointer p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                className="flex w-full cursor-pointer justify-between"
                onClick={() => setEditDialog(student)}
              >
                <span>Edit</span>
                <EditIcon className="text-muted-foreground h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="flex w-full cursor-pointer justify-between"
                onClick={() => setDeleteDialog(student)}
              >
                <span>Delete</span>
                <DeleteIcon className="text-muted-foreground h-4 w-4" />
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
