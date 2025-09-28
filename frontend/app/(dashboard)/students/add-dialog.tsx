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
import { Program } from "../../table/program-columns"
import { fetchProgramsForDropdown } from "@/lib/program-api"
import { Student } from "@/app/table/student-columns"
import { createStudent } from "@/lib/student-api"
import { EntityConfirmationDialog } from "@/components/entity-confirmation-dialog"

type AddStudentDialogProps = {
    onStudentAdded?: () => void
}

export function AddStudentDialog( { onStudentAdded }: AddStudentDialogProps) {
    const [addedStudent, setAddedStudent] = useState<Student | null>(null)
    const [programs, setPrograms] = useState<Program[]>([])
    const [studentID, setId] = useState("")
    const [firstName, setFname] = useState("")
    const [lastName, setLname] = useState("")
    const [programCode, setPcode] = useState("")
    const [yearLevel, setYlevel] = useState("")
    const [gender, setGender] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const loadPrograms = async () => {
          try {
            const data = await fetchProgramsForDropdown()
            setPrograms(data)
          } catch (error) {
            console.error("Failed to load programs:", error)
          }
        }
        loadPrograms()
      }, [])

    const handleAddStudent = async () => {
        const studentIdPattern = /^\d{4}-\d{4}$/
        if (
            !studentID.trim() ||
            !firstName.trim() ||
            !lastName.trim() ||
            !programCode.trim() ||
            !yearLevel.trim() ||
            !gender.trim()
            ) {
            setErrorMessage("Please fill in all fields.")
            return
            }

        if (!studentIdPattern.test(studentID.trim())) {
            setErrorMessage("Student ID must follow the format XXXX-XXXX using digits only.")
            return
        }

        try {
            const response = await createStudent(studentID, firstName, lastName, programCode, parseInt(yearLevel), gender)
            setAddedStudent(response.student)
            setId("")
            setFname("")
            setLname("")
            setPcode("")
            setYlevel("")
            setGender("")
            setErrorMessage("")
            setIsOpen(false)
            onStudentAdded?.()
        } catch (error: any) {
            if (error.message === "Student ID already exists") {
                setErrorMessage("Student ID already exists. Please use a different ID.")
            } else if (error.message === "Missing required fields") {
                setErrorMessage("Please fill in all fields.")
            } else {
                setErrorMessage("Something went wrong. Try again.")
            }
        }
    }

    const resetForm = () => {
        setId("")
        setFname("")
        setLname("")
        setPcode("")
        setYlevel("")
        setGender("")
        setErrorMessage("")
    }

    const handleDialogClose = () => {
        resetForm()
        setIsOpen(false)
    }

    return (
        <>
        <Dialog open={isOpen} onOpenChange={(open) => {
          if (!open) handleDialogClose()
          else setIsOpen(true)
        }}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    Add Student
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add a new Student</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a student.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="studentID">Student ID</Label>
                        <Input
                            id="studentID"
                            placeholder="e.g. 2023-0001"
                            value={studentID}
                            onChange={(e) => setId(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            placeholder="e.g. Juhanara"
                            value={firstName}
                            onChange={(e) => setFname(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            placeholder="e.g. Saluta"
                            value={lastName}
                            onChange={(e) => setLname(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="programCode">Program</Label>
                        <Select value={programCode} onValueChange={setPcode}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] overflow-y-auto">
                                {Array.isArray(programs) && programs.map((program) => (
                                    <SelectItem key={program.programCode} value={program.programCode}>
                                        {program.programName} ({program.programCode})
                                    </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="yearLevel">Year Level</Label>
                        <Select value={yearLevel} onValueChange={setYlevel}>
                            <SelectTrigger>
                            <SelectValue placeholder="Select year level" />
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
                                <SelectValue placeholder="Select a gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Male">Male</SelectItem>
                                </SelectContent>
                        </Select>
                    </div>
                    {errorMessage && (
                        <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
                    )}
                </div>
                <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleAddStudent}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    {addedStudent && (
          <EntityConfirmationDialog
            entityType="Student"
            entity={{ code: addedStudent.studentID, name: `${addedStudent.firstName} ${addedStudent.lastName}` }}
            actionType="added"
            onClose={() => setAddedStudent(null)}
            />
        )}
    </>
    )
}