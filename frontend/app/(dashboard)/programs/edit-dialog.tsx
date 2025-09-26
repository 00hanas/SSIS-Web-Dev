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
    DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchCollegesForDropdown } from "@/lib/college-api"
import { College } from "../../table/college-columns"
import { Program } from "@/app/table/programs-columns"
import { fetchProgram, updateProgram } from "@/lib/program-api"
import { EntityConfirmationDialog } from "@/components/entity-confirmation-dialog"

type EditProgramDialogProps = {
    program: {
        programCode: string
        programName: string
        collegeCode: string
    }
    onProgramUpdated?: () => void
}

export function EditProgramDialog( { program, onProgramUpdated }: EditProgramDialogProps) {
  const [colleges, setColleges] = useState<College[]>([])
  const [programCode, setPcode] = useState(program.programCode)
  const [programName, setName] = useState(program.programName)
  const [collegeCode, setCcode] = useState(program.collegeCode)
  const [updatedProgram, setUpdatedProgram] = useState<Program | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (program?.programCode) {
      setIsOpen(true)
      setPcode(program.programCode)
      setName(program.programName)
      setCcode(program.collegeCode)
      setErrorMessage("")
    }
  }, [program.programCode])

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

  useEffect (() => {
    if (isOpen) {
      const loadProgramData = async () => {
        try {
          const data = await fetchProgram(program.programCode)
          setPcode(data.programCode)
          setName(data.programName)
          setCcode(data.collegeCode)
        } catch (error) {
          console.error("Failed to fetch program data:", error)
        }
      }
      loadProgramData()
    }
  }, [isOpen, program.programCode])

  const handleEditProgram = async () => {
    const originalCode = program.programCode

    if (!programCode.trim() || !programName.trim() || !collegeCode.trim()) {
      setErrorMessage("Please fill in all fields.")
      return
    }

    if (
      programCode.trim() === originalCode.trim() &&
      programName.trim() === program.programName.trim() &&
      collegeCode.trim() === program.collegeCode.trim()
    ) {
      setErrorMessage("No changes detected.")
      return
    }

    try {
      const response = await updateProgram(originalCode, programCode, programName, collegeCode)
      setUpdatedProgram(response)
      setErrorMessage("")
      setIsOpen(false)
    } catch (error: any) {
      if (error.message === "Program code already exists") {
        setErrorMessage(`Program Code (${programCode}) is already taken.`)
      } else if (error.message === "Missing required fields") {
        setErrorMessage("Please fill in all fields.")
      } else {
        setErrorMessage("Something went wrong. Try again.")
      }
    }
  }

  const resetForm = () => {
    setPcode(program.programCode)
    setName(program.programName)
    setCcode(program.collegeCode)
    setErrorMessage("")
  }

  const handleDialogCLose = () => {
    resetForm()
    setIsOpen(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
          if (!open) handleDialogCLose()
          else setIsOpen(true)
      }}>
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
             {errorMessage && (
                <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
             )}
             </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleEditProgram}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {updatedProgram && (
      <EntityConfirmationDialog
        entityType="Program"
        entity={{code: updatedProgram.programCode, name: updatedProgram.programName}}
        actionType="updated"
        onClose={() => {
          setUpdatedProgram(null)
          onProgramUpdated?.()
        }}
      />
    )}
  </>
  )    
}