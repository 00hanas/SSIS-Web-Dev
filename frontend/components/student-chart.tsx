"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { fetchStudentsByProgram } from "@/lib/student-api"
import { fetchProgramsForDropdown } from "@/lib/program-api"
import { Student } from "@/app/table/student-columns"

type Program = {
    programCode: string
    programName: string
}

export default function StudentChart() {
    const [programs, setPrograms] = useState<Program[]>([])
    const [program, setProgram] = useState("all")
    const [students, setStudents] = useState<Student[]>([])

  // Load programs for dropdown
    useEffect(() => {
        const loadPrograms = async () => {
        try {
            const data = await fetchProgramsForDropdown()
            setPrograms(data)
        } catch (err) {
            console.error("Failed to load programs:", err)
        }
        }
        loadPrograms()
    }, [])

  // Load students when program changes
    useEffect(() => {
        const loadStudents = async () => {
        try {
            const data = await fetchStudentsByProgram(program)
            setStudents(data)
        } catch (err) {
            console.error("Failed to load students:", err)
        }
        }
        loadStudents()
    }, [program])

    return (
    <Card className="rounded-2xl h-[400px] w-68">
        <CardHeader className="flex flex-row items-center justify-between gap-5">
            <CardTitle className="text-lg font-bold">Students</CardTitle>
            <Select onValueChange={(val) => setProgram(val)} defaultValue="all">
            <SelectTrigger className="w-[100px] text-xs">
                <SelectValue placeholder="Select Program" />
            </SelectTrigger>
            <SelectContent >
                <SelectItem className="text-xs" value="all">All</SelectItem>
                {programs.map((p) => (
                <SelectItem className="text-xs" key={p.programCode} value={p.programCode}>
                    {p.programCode}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </CardHeader>

        <CardContent className="h-[340px] overflow-y-auto">
            {students.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students found.</p>
            ) : (
            <ul className="space-y-2">
                {students.map((s) => (
                <li
                    key={s.studentID}
                    className="
                    flex items-center gap-3 p-3
                    rounded-lg
                    bg-muted/30 dark:bg-muted/10
                    hover:bg-accent/40 dark:hover:bg-accent/40 transition
                    "
                >
                        <img
                            src={"/student-icon.jpg"} 
                            alt={`${s.firstName} ${s.lastName}`}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    <div className="flex flex-col">
                    <span className="font-medium">
                        {s.firstName} {s.lastName}
                    </span>
                    <span className="text-xs text-accent dark:text-accent/70">
                        Year Level: {s.yearLevel}
                    </span>
                    </div>
                </li>
                ))}
            </ul>
            )}
        </CardContent>
        </Card>
    )
    }