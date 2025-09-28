"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Delete, MoreHorizontal } from "lucide-react"
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

export type College = {
  collegeCode: string
  collegeName: string
}

export const CollegeColumns = (
  setEditDialog: (college: College) => void,
  setDeleteDialog: (college: College) => void,
  sortBy: "collegeCode" | "collegeName",
  sortOrder: "asc" | "desc",
  setSortBy: (key: "collegeCode" | "collegeName") => void,
  setSortOrder: (order: "asc" | "desc") => void
): ColumnDef<College>[] => [
  {
    accessorKey: "collegeCode",
    size: 150,
    header: () => (
      <Button
        variant="ghost"
        onClick={() => {
          if (sortBy === "collegeCode") {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          } else {
            setSortBy("collegeCode")
            setSortOrder("asc")
          }
        }}
      >
        College Code
        <SortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ getValue }) => getValue() ?? "—",
  },
  {
    accessorKey: "collegeName",
    header: () => (
      <Button
        variant="ghost"
        onClick={() => {
          if (sortBy === "collegeName") {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          } else {
            setSortBy("collegeName")
            setSortOrder("asc")
          }
        }}
      >
        College Name
        <SortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ getValue }) => getValue() ?? "—",
  },
  {
    id: "actions",
    size:100,
    cell: ({ row }) => {
      const college = row.original
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
              onClick={() => setEditDialog(college)}
            >
              <span>Edit</span>
              <EditIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              className="w-full flex justify-between"
              onClick={() => setDeleteDialog(college)}
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
