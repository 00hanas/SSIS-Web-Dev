"use client"

import { useState } from "react"
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

//to be replaced with actual data fetching logic
import { mockData as Programs } from "../programs/page"

export function AddStudentDialog() {
    const [id, setId] = useState("")
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [pcode, setPcode] = useState("")
    const [ylevel, setYlevel] = useState("")
    const [gender, setGender] = useState("")

    const handleAddStudent = () => {
        console.log("Student ID:", id)
        console.log("First Name:", fname)
        console.log("Last Name:", lname)
        console.log("Program Code:", pcode)
        console.log("Year Level:", ylevel)
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
                        <Label htmlFor="id">Student ID</Label>
                        <Input
                            id="id"
                            placeholder="e.g. 2023-0001"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="fname">First Name</Label>
                        <Input
                            id="fname"
                            placeholder="e.g. Juhanara"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lname">Last Name</Label>
                        <Input
                            id="lname"
                            placeholder="e.g. Saluta"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="pcode">Program</Label>
                        <Select value={pcode} onValueChange={setPcode}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                            <SelectContent>
                                {Programs.map((Programs) => (
                                    <SelectItem key={Programs.pcode} value={Programs.pcode}>
                                        {Programs.name} ({Programs.pcode})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="ylevel">Year Level</Label>
                        <Select value={ylevel} onValueChange={setYlevel}>
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