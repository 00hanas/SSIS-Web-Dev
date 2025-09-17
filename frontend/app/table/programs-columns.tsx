"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Program = {
    pcode: string
    name: string
    ccode: string
}

export const programColumns: ColumnDef<Program>[] = [
    {
        accessorKey: "pcode",
        header: "Program Code",
    },
    {
        accessorKey: "name",
        header: "Program Name",
    },
    {
        accessorKey: "ccode",
        header: "College Code",
    },
]