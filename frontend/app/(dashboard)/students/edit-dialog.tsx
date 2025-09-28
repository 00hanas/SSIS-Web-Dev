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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchProgramsForDropdown } from "@/lib/program-api"
import { Program } from "../../table/program-columns"
import { Student } from "@/app/table/student-columns"
import { fetchStudent, updateStudent } from "@/lib/student-api"
import { EntityConfirmationDialog } from "@/components/entity-confirmation-dialog"

type EditStudentDialogProps = {
    student: {
        studentID: string
        firstName: string
        lastName: string
        programCode: string
        yearLevel: number
        gender: string
    }
    onStudentUpdated?: () => void
}

export function EditStudentDialog( {student, onStudentUpdated }: EditStudentDialogProps) {
    const [programs, setPrograms] = useState<Program[]>([])
    const [studentID, setId] = useState(student.studentID)
    const [firstName, setFname] = useState(student.firstName)
    const [lastName, setLname] = useState(student.lastName)
    const [programCode, setPcode] = useState(student.programCode)
    const [yearLevel, setYlevel] = useState(student.yearLevel)
    const [gender, setGender] = useState(student.gender)
    const [updatedStudent, setUpdatedStudent] = useState<Student | null>(null)
    const [errorMessage, setErrorMessage] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (student?.studentID) {
            setIsOpen(true)
            setId(student.studentID)
            setFname(student.firstName)
            setLname(student.lastName)
            setPcode(student.programCode)
            setYlevel(student.yearLevel)
            setGender(student.gender)
            setErrorMessage("")
        } 
    }, [student.studentID])

    useEffect(() => {
        const loadPrograms = async () => {
          try {
            const data = await fetchProgramsForDropdown()
            setPrograms(data)
          } catch (error) {
            console.error("Failed to load programs:", error)
            setPrograms([])
          }
        }
        loadPrograms()
      }, [])

      useEffect (() => {
          if (isOpen) {
            const loadStudentData = async () => {
              try {
                const data = await fetchStudent(student.studentID)
                setId(data.studentID)
                setFname(data.firstName)
                setLname(data.lastName)
                setPcode(data.programCode)
                setYlevel(data.yearLevel)
                setGender(data.gender)
              } catch (error) {
                console.error("Failed to fetch program data:", error)
              }
            }
            loadStudentData()
          }
        }, [isOpen, student.studentID])

    const handleEditStudent = async () => {
        const originalId = student.studentID
        const studentIdPattern = /^\d{4}-\d{4}$/

        if (
            !studentID.trim() ||
            !firstName.trim() ||
            !lastName.trim() ||
            !programCode.trim() ||
            !yearLevel.toString().trim() ||
            !gender.trim()
        ) {
            setErrorMessage("Please fill in all fields.")
            return
        }

        if (!studentIdPattern.test(studentID.trim())) {
            setErrorMessage("Student ID must follow the format YYYY-NNNN.")
            return
        }

        if (
            studentID.trim() === originalId.trim() &&
            firstName.trim() === student.firstName.trim() &&
            lastName.trim() === student.lastName.trim() &&
            programCode.trim() === student.programCode.trim() &&
            yearLevel.toString().trim() === student.yearLevel.toString().trim() &&
            gender.trim() === student.gender.trim()
        ) {
            setErrorMessage("No changes detected.")
            return
        }

        try {
            const response = await updateStudent(
            originalId,
            studentID.trim(),
            firstName.trim(),
            lastName.trim(),
            programCode.trim(),
            parseInt(yearLevel.toString().trim()),
            gender.trim()
            )
            setUpdatedStudent(response)
            setErrorMessage("")
            setIsOpen(false)
        } catch (error: any) {
            const msg = error.message
            if (msg === "Student ID already exists") {
            setErrorMessage(`Student ID (${studentID}) is already taken.`)
            } else if (msg === "Missing required fields") {
            setErrorMessage("Please fill in all fields.")
            } else {
            setErrorMessage("Something went wrong. Try again.")
            }
        }
    }

    const resetForm = () => {
        setId(student.studentID)
        setFname(student.firstName)
        setLname(student.lastName)
        setPcode(student.programCode)
        setYlevel(student.yearLevel)
        setGender(student.gender)
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
                    {errorMessage && (
                        <div className="text-sm text-red-600">{errorMessage}</div>
                    )}
                </div>
                <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleEditStudent}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {updatedStudent && (
        <EntityConfirmationDialog
        entityType="Student"
        entity={{code: updatedStudent.studentID, name: `${updatedStudent.firstName} ${updatedStudent.lastName}`}}
        actionType="updated"
        onClose={() => {
            setUpdatedStudent(null)
            onStudentUpdated?.()
        }}
        />
    )}
    </>
    )
}