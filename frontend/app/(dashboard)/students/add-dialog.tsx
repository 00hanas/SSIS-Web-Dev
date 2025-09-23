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

import { Program } from "../../table/programs-columns"
import { fetchProgramsForDropdown } from "@/lib/program-api"

export function AddStudentDialog() {
    const [programs, setPrograms] = useState<Program[]>([])
    const [studentID, setId] = useState("")
    const [firstName, setFname] = useState("")
    const [lastName, setLname] = useState("")
    const [programCode, setPcode] = useState("")
    const [yearLevel, setYlevel] = useState("")
    const [gender, setGender] = useState("")

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

    const handleAddStudent = () => {
        console.log("Student ID:", studentID)
        console.log("First Name:", firstName)
        console.log("Last Name:", lastName)
        console.log("Program Code:", programCode)
        console.log("Year Level:", yearLevel)
        console.log("Gender:", gender)
        setId("")
        setFname("")
        setLname("")
        setPcode("")
        setYlevel("")
        setGender("")
    }

    return (
        <Dialog>
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
                </div>
                <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleAddStudent}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    )
}