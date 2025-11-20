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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchCollegesForDropdown } from "@/lib/api/college-api"
import { College } from "@/components/table/college-columns"
import { Program } from "@/components/table/program-columns"
import { fetchProgram, updateProgram } from "@/lib/api/program-api"
import { EntityConfirmationDialog } from "@/components/global/entity-confirmation-dialog"

type EditProgramDialogProps = {
  program: {
    programCode: string
    programName: string
    collegeCode: string
  }
  visible: boolean
  onClose: () => void
  onProgramUpdated?: () => void
}

export function EditProgramDialog({
  program,
  visible,
  onClose,
  onProgramUpdated,
}: EditProgramDialogProps) {
  const [colleges, setColleges] = useState<College[]>([])
  const [programCode, setPcode] = useState(program.programCode)
  const [programName, setName] = useState(program.programName)
  const [collegeCode, setCcode] = useState(program.collegeCode)
  const [updatedProgram, setUpdatedProgram] = useState<Program | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (visible) {
      setPcode(program.programCode)
      setName(program.programName)
      setCcode(program.collegeCode)
      setErrorMessage("")
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
  }, [visible, program.programCode])

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
      const response = await updateProgram(
        originalCode,
        programCode,
        programName,
        collegeCode
      )
      setUpdatedProgram(response)
      setErrorMessage("")
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
    setPcode("")
    setName("")
    setCcode("")
    setErrorMessage("")
  }

  return (
    <>
      <Dialog
        open={visible}
        onOpenChange={(open) => {
          if (!open) onClose()
        }}
      >
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
                placeholder="e.g. BSCS"
                onChange={(e) => setPcode(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="programName">Program Name</Label>
              <Input
                id="programName"
                value={programName}
                placeholder="e.g. Bachelor of Science in Computer Science"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="collegeCode">College</Label>
              <Select value={collegeCode} onValueChange={setCcode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem
                      key={college.collegeCode}
                      value={college.collegeCode}
                    >
                      {college.collegeName} ({college.collegeCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errorMessage && (
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="mr-auto cursor-pointer"
              onClick={resetForm}
            >
              Reset
            </Button>
            <DialogClose asChild>
              <Button className="cursor-pointer" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="cursor-pointer"
              type="button"
              onClick={handleEditProgram}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {updatedProgram && (
        <EntityConfirmationDialog
          entityType="Program"
          entity={{
            code: updatedProgram.programCode,
            name: updatedProgram.programName,
          }}
          actionType="updated"
          onClose={() => {
            setUpdatedProgram(null)
            onProgramUpdated?.()
            onClose()
          }}
        />
      )}
    </>
  )
}
