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

export type Program = {
  programCode: string
  programName: string
  collegeCode: string
}

export const ProgramColumns = (
  setEditDialog: (program: Program) => void,
  setDeleteDialog: (program: Program) => void,
  sortBy: "programCode" | "programName" | "collegeCode",
  sortOrder: "asc" | "desc",
  setSortBy: (key: "programCode" | "programName" | "collegeCode") => void,
  setSortOrder: (order: "asc" | "desc") => void
): ColumnDef<Program>[] => [
  {
    accessorKey: "programCode",
    size: 150,
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
    cell: ({ getValue }) => getValue() ?? "—",
  },
  {
    accessorKey: "programName",
    size: 500,
    header: () => (
      <Button
        onClick={() => {
          if (sortBy === "programName") {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          } else {
            setSortBy("programName")
            setSortOrder("asc")
          }
        }}
        className="text-foreground cursor-pointer bg-transparent hover:bg-transparent"
      >
        Program Name
        {sortBy === "programName" ? (
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
    accessorKey: "collegeCode",
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
    cell: ({ row }) => {
      const value = row.getValue("collegeCode")
      return value === "N/A" ? (
        <span className="text-muted-foreground italic">N/A</span>
      ) : (
        value
      )
    },
  },
  {
    id: "actions",
    size: 100,
    cell: ({ row }) => {
      const program = row.original

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
                onClick={() => setEditDialog(program)}
              >
                <span>Edit</span>
                <EditIcon className="text-muted-foreground h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="flex w-full cursor-pointer justify-between"
                onClick={() => setDeleteDialog(program)}
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
