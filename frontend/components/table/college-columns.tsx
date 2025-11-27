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
        onClick={() => {
          if (sortBy === "collegeCode") {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          } else {
            setSortBy("collegeCode")
            setSortOrder("asc")
          }
        }}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        College Code
        {sortBy === "collegeCode" ? (
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
    enableSorting: true,
    cell: ({ getValue }) => getValue() ?? "—",
  },
  {
    accessorKey: "collegeName",
    header: () => (
      <Button
        onClick={() => {
          if (sortBy === "collegeName") {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          } else {
            setSortBy("collegeName")
            setSortOrder("asc")
          }
        }}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        College Name
        {sortBy === "collegeName" ? (
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
    enableSorting: true,
    cell: ({ getValue }) => getValue() ?? "—",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const college = row.original
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
                onClick={() => setEditDialog(college)}
              >
                Edit
                <EditIcon className="text-muted-foreground h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="flex w-full cursor-pointer justify-between"
                onClick={() => setDeleteDialog(college)}
              >
                Delete
                <DeleteIcon className="text-muted-foreground h-4 w-4" />
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
