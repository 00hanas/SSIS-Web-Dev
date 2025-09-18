"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditProgramDialog } from "../(dashboard)/programs/edit-dialog"
import { DeleteProgramDialog } from "../(dashboard)/programs/delete-confirmation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SwapVertSharp as SortIcon
} from '@mui/icons-material'

export type Program = {
    pcode: string
    name: string
    ccode: string
}

export const ProgramColumns: ColumnDef<Program>[] = [
    {
        accessorKey: "pcode",
        header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Program Code
          <SortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Program Name
          <SortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    },
    {
        accessorKey: "ccode",
        header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          College Code
          <SortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    },
    {
    id: "actions",
    cell: ({ row }) => {
      const program = row.original
 
      return (
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
            <EditProgramDialog program={program} />
            <DeleteProgramDialog program={program} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]