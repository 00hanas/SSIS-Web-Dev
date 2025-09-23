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

import { fetchCollegesForDropdown } from "@/lib/college-api"
import { College } from "../../table/college-columns"

type EditProgramDialogProps = {
    program: {
        programCode: string
        programName: string
        collegeCode: string
    }
}

export function EditProgramDialog( { program }: EditProgramDialogProps) {
    const [colleges, setColleges] = useState<College[]>([])
    const [programCode, setPcode] = useState(program.programCode)
    const [programName, setName] = useState(program.programName)
    const [collegeCode, setCcode] = useState(program.collegeCode)

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

    const handleEditProgram = () => {
        console.log("Updated Program Code:", programCode)
        console.log("Updated Program Name:", programName)
        console.log("Updated College Code:", collegeCode)
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
                    <DialogTitle>Edit Program</DialogTitle>
                    <DialogDescription>
                        Update the fields below to modify this program."
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="programCode">Program Code</Label>
                        <Input
                            id="programCode"
                            value={programCode}
                            onChange={(e) => setPcode(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="programName">Program Name</Label>
                        <Input
                            id="programName"
                            value={programName}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
            <Label htmlFor="collegeCode">College</Label>
            <Select value={collegeCode} onValueChange={setCcode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
          <Button type="button" onClick={handleEditProgram}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
    
}