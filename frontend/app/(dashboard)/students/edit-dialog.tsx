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
import { EditNoteSharp as EditIcon } from '@mui/icons-material'

//to be replaced with actual data fetching logic
import { mockData as Programs } from "../programs/page"

type EditStudentDialogProps = {
    student: {
        id: string
        fname: string
        lname: string
        pcode: string
        ylevel: number
        gender: string
    }
}

export function EditStudentDialog( {student}: EditStudentDialogProps) {
    const [id, setId] = useState(student.id)
    const [fname, setFname] = useState(student.fname)
    const [lname, setLname] = useState(student.lname)
    const [pcode, setPcode] = useState(student.pcode)
    const [ylevel, setYlevel] = useState(student.ylevel)
    const [gender, setGender] = useState(student.gender)

    const handleEditStudent = () => {
        console.log("Student ID:", id)
        console.log("First Name:", fname)
        console.log("Last Name:", lname)
        console.log("Program Code:", pcode)
        console.log("Year Level:", ylevel)
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
                        <Label htmlFor="id">Student ID</Label>
                        <Input
                            id="id"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="fname">First Name</Label>
                        <Input
                            id="fname"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lname">Last Name</Label>
                        <Input
                            id="lname"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="pcode">Program</Label>
                        <Select value={pcode} onValueChange={setPcode}>
                            <SelectTrigger>
                                <SelectValue />
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
                        <Select
                            value={ylevel.toString()}
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