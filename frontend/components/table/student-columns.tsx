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
import { EditNoteSharp as EditIcon } from "@mui/icons-material"
import {
  DeleteOutlineSharp as DeleteIcon,
  UnfoldMore as UnsortIcon,
  KeyboardArrowUp as SortAsc,
  KeyboardArrowDown as SortDesc,
} from "@mui/icons-material"
import { PersonPin as PersonIcon } from "@mui/icons-material"
import Image from "next/image"

export type Student = {
  studentID: string
  firstName: string
  lastName: string
  programCode: string
  yearLevel: number
  gender: "Female" | "Male"
  photoUrl?: string
}

export const StudentColumns = (
  setViewDialog: (student: Student) => void,
  setEditDialog: (student: Student) => void,
  setDeleteDialog: (student: Student) => void,
  sortBy:
    | "studentID"
    | "firstName"
    | "lastName"
    | "yearLevel"
    | "gender"
    | "programCode",
  sortOrder: "asc" | "desc",
  setSortBy: (
    key:
      | "studentID"
      | "firstName"
      | "lastName"
      | "yearLevel"
      | "gender"
      | "programCode"
  ) => void,
  setSortOrder: (order: "asc" | "desc") => void
): ColumnDef<Student>[] => [
  {
    accessorKey: "photoUrl",
    size: 60,
    header: "Photo",
    cell: ({ row }) => {
      console.log("Row data:", row.original)
      const photoUrl = row.original.photoUrl
      const name = `${row.original.firstName} ${row.original.lastName}`

      return photoUrl ? (
        <Image
          src={photoUrl}
          alt={name}
          width={40}
          height={40}
          className="!h-10 !w-10 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs">
          N/A
        </div>
      )
    },
  },
  {
    accessorKey: "studentID",
    size: 150,
    header: () => (
      <Button
        onClick={() => {
          if (sortBy === "studentID") {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          } else {
            setSortBy("studentID")
            setSortOrder("asc")
          }
        }}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        Student ID
        {sortBy === "studentID" ? (
          sortOrder === "asc" ? (
            <SortAsc className="text-primary ml-2 h-4 w-4" />
          ) : (
            <SortDesc className="text-primary ml-2 h-4 w-4" />
          )
        ) : (
          <UnsortIcon className="text-primary ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ getValue }) => getValue() ?? "—",
  },
  {
    accessorKey: "firstName",
    header: () => (
      <Button
        onClick={() => {
          if (sortBy === "firstName") {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          } else {
            setSortBy("firstName")
            setSortOrder("asc")
          }
        }}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        First Name
        {sortBy === "firstName" ? (
          sortOrder === "asc" ? (
            <SortAsc className="text-primary ml-2 h-4 w-4" />
          ) : (
            <SortDesc className="text-primary ml-2 h-4 w-4" />
          )
        ) : (
          <UnsortIcon className="text-primary ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ getValue }) => getValue() ?? "—",
  },
  {
    accessorKey: "lastName",
    header: () => (
      <Button
        onClick={() => {
          if (sortBy === "lastName") {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          } else {
            setSortBy("lastName")
            setSortOrder("asc")
          }
        }}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        Last Name
        {sortBy === "lastName" ? (
          sortOrder === "asc" ? (
            <SortAsc className="text-primary ml-2 h-4 w-4" />
          ) : (
            <SortDesc className="text-primary ml-2 h-4 w-4" />
          )
        ) : (
          <UnsortIcon className="text-primary ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ getValue }) => getValue() ?? "—",
  },
  {
    accessorKey: "programCode",
    header: () => (
      <Button
        onClick={() => {
          if (sortBy === "programCode") {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          } else {
            setSortBy("programCode")
            setSortOrder("asc")
          }
        }}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        Program Code
        {sortBy === "programCode" ? (
          sortOrder === "asc" ? (
            <SortAsc className="text-primary ml-2 h-4 w-4" />
          ) : (
            <SortDesc className="text-primary ml-2 h-4 w-4" />
          )
        ) : (
          <UnsortIcon className="text-primary ml-2 h-4 w-4" />
        )}
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
    header: () => (
      <Button
        onClick={() => {
          if (sortBy === "yearLevel") {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          } else {
            setSortBy("yearLevel")
            setSortOrder("asc")
          }
        }}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        Year Level
        {sortBy === "yearLevel" ? (
          sortOrder === "asc" ? (
            <SortAsc className="text-primary ml-2 h-4 w-4" />
          ) : (
            <SortDesc className="text-primary ml-2 h-4 w-4" />
          )
        ) : (
          <UnsortIcon className="text-primary ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ getValue }) => getValue() ?? "—",
  },
  {
    accessorKey: "gender",
    header: () => (
      <Button
        onClick={() => {
          if (sortBy === "gender") {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          } else {
            setSortBy("gender")
            setSortOrder("asc")
          }
        }}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        Gender
        {sortBy === "gender" ? (
          sortOrder === "asc" ? (
            <SortAsc className="text-primary ml-2 h-4 w-4" />
          ) : (
            <SortDesc className="text-primary ml-2 h-4 w-4" />
          )
        ) : (
          <UnsortIcon className="text-primary ml-2 h-4 w-4" />
        )}
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
                onClick={() => setViewDialog(student)}
              >
                <span>View</span>
                <PersonIcon className="text-muted-foreground h-4 w-4 justify-end" />
              </Button>
              <DropdownMenuSeparator className="mr-2 ml-2" />
              <Button
                variant="ghost"
                className="flex w-full cursor-pointer justify-between"
                onClick={() => setEditDialog(student)}
              >
                <span>Edit</span>
                <EditIcon className="text-muted-foreground ml-auto h-4 w-4 justify-end" />
              </Button>
              <Button
                variant="ghost"
                className="flex w-full cursor-pointer justify-between"
                onClick={() => setDeleteDialog(student)}
              >
                <span>Delete</span>
                <DeleteIcon className="text-muted-foreground h-4 w-4 justify-end" />
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
