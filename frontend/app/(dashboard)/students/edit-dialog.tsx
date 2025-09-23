"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditNoteSharp as EditIcon } from '@mui/icons-material'

import { fetchProgramsForDropdown } from "@/lib/program-api"
import { Program } from "../../table/programs-columns"

type EditStudentDialogProps = {
    student: {
        studentID: string
        firstName: string
        lastName: string
        programCode: string
        yearLevel: number
        gender: string
    }
}

export function EditStudentDialog( {student}: EditStudentDialogProps) {
    const [programs, setPrograms] = useState<Program[]>([])
    const [studentID, setId] = useState(student.studentID)
    const [firstName, setFname] = useState(student.firstName)
    const [lastName, setLname] = useState(student.lastName)
    const [programCode, setPcode] = useState(student.programCode)
    const [yearLevel, setYlevel] = useState(student.yearLevel)
    const [gender, setGender] = useState(student.gender)

    useEffect(() => {
        const loadPrograms = async () => {
          try {
            const data = await fetchProgramsForDropdown()
            setPrograms(data)
          } catch (error) {
            console.error("Failed to load colleges:", error)
          }
        }
        loadPrograms()
      }, [])

    const handleEditStudent = () => {
        console.log("Student ID:", studentID)
        console.log("First Name:", firstName)
        console.log("Last Name:", lastName)
        console.log("Program Code:", programCode)
        console.log("Year Level:", yearLevel)
        console.log("Gender:", gender)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full flex justify-between">
                    <span>Edit</span>
                    <EditIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Student</DialogTitle>
                    <DialogDescription>
                        Update the fields below to modify this student.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="studentID">Student ID</Label>
                        <Input
                            id="studentID"
                            value={studentID}
                            onChange={(e) => setId(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFname(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLname(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="programCode">Program</Label>
                        <Select value={programCode} onValueChange={setPcode}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {programs.map((program) => (
                                    <SelectItem key={program.programCode} value={program.programCode}>
                                        {program.programName} ({program.programCode})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="yearLevel">Year Level</Label>
                        <Select
                            value={yearLevel.toString()}
                            onValueChange={(val) => setYlevel(Number(val))}
                        >
                            <SelectTrigger>
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>

                    <div className="grid gap-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={gender} onValueChange={setGender}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Male">Male</SelectItem>
                                </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleEditStudent}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    )
}