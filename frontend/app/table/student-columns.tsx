"use client"

import { ColumnDef } from "@tanstack/react-table"

export type College = {
    id: string
    fname: string
    lname: string
    pcode: string
    ylevel: "1st" | "2nd" | "3rd" | "4th" | "5th"
    gender: "Female" | "Male"
}

export const studentColumns: ColumnDef<College>[] = [
    {
        accessorKey: "id",
        header: "Student ID",
    },
    {
        accessorKey: "fname",
        header: "First Name",
    },
    {
        accessorKey: "lname",
        header: "Last Name",
    },
    {
        accessorKey: "pcode",
        header: "Program Code",
    },
    {
        accessorKey: "ylevel",
        header: "Year Level",
    },
    {   
        accessorKey: "gender",
        header: "Gender",
    },
]