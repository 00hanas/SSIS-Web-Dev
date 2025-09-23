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

import { fetchCollegesForDropdown } from "@/lib/college-api"
import { College } from "../../table/college-columns"


export function AddProgramDialog() {
    const [colleges, setColleges] = useState<College[]>([])
    const [programCode, setPcode] = useState("")
    const [programName, setName] = useState("")
    const [collegeCode, setCcode] = useState("")

    useEffect(() => {
    const loadColleges = async () => {
      try {
        const data = await fetchCollegesForDropdown()
        setColleges(data)
      } catch (error) {
        console.error("Failed to load colleges:", error)
      }
    }
    loadColleges()
  }, [])

    const handleAddProgram = () => {
        console.log("Program Code:", programCode)
        console.log("Program Name:", programName)
        console.log("College Code:", collegeCode)
        setPcode("")
        setName("")
        setCcode("")
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    Add Program
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add a new Program</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a program.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="programCode">Program Code</Label>
                        <Input
                            id="programCode"
                            placeholder="e.g. BSCS"
                            value={programCode}
                            onChange={(e) => setPcode(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="programName">Program Name</Label>
                        <Input
                            id="programName"
                            placeholder="e.g. Bachelor of Science in Computer Science"
                            value={programName}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
            <Label htmlFor="collegeCode">College</Label>
            <Select value={collegeCode} onValueChange={setCcode}>
              <SelectTrigger>
                <SelectValue placeholder="Select a college" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {colleges.map((college) => (
                  <SelectItem key={college.collegeCode} value={college.collegeCode}>
                    {college.collegeName} ({college.collegeCode})
                  </SelectItem>
                ))}
              </SelectContent>



            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleAddProgram}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
    
}