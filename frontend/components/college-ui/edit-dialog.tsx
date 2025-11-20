"use client"

import { useEffect, useState } from "react"
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
import { fetchCollege, updateCollege } from "@/lib/api/college-api"
import { College } from "@/components/table/college-columns"
import { EntityConfirmationDialog } from "@/components/global/entity-confirmation-dialog"

type EditCollegeDialogProps = {
  college: {
    collegeCode: string
    collegeName: string
  }
  visible: boolean
  onClose: () => void
  onCollegeUpdated?: () => void
}

export function EditCollegeDialog({
  college,
  visible,
  onClose,
  onCollegeUpdated,
}: EditCollegeDialogProps) {
  const [collegeCode, setCcode] = useState(college.collegeCode)
  const [collegeName, setName] = useState(college.collegeName)
  const [updatedCollege, setUpdatedCollege] = useState<College | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (visible) {
      setCcode(college.collegeCode)
      setName(college.collegeName)
      setErrorMessage("")
      const loadCollegeData = async () => {
        try {
          const data = await fetchCollege(college.collegeCode)
          setCcode(data.collegeCode)
          setName(data.collegeName)
        } catch (error) {
          console.error("Failed to fetch college data:", error)
        }
      }
      loadCollegeData()
    }
  }, [visible, college.collegeCode])

  const handleEditCollege = async () => {
    const originalCode = college.collegeCode

    if (!collegeCode.trim() || !collegeName.trim()) {
      setErrorMessage("Please fill in both fields.")
      return
    }

    if (
      collegeCode.trim() === originalCode.trim() &&
      collegeName.trim() === college.collegeName.trim()
    ) {
      setErrorMessage("No changes detected.")
      return
    }

    try {
      const response = await updateCollege(
        originalCode,
        collegeCode,
        collegeName
      )
      setUpdatedCollege(response)
      setErrorMessage("")
    } catch (error: any) {
      if (error.message === "College code already exists") {
        setErrorMessage(`College Code (${collegeCode}) is already taken.`)
      } else if (error.message === "Missing required fields") {
        setErrorMessage("Please fill in both College Code and College Name.")
      } else {
        setErrorMessage("Something went wrong. Try again.")
      }
    }
  }

  const resetForm = () => {
    setCcode("")
    setName("")
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
            <DialogTitle>Edit College</DialogTitle>
            <DialogDescription>
              Update the fields below to modify this college.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="collegeCode">College Code</Label>
              <Input
                id="collegeCode"
                value={collegeCode}
                placeholder="e.g. CCS"
                onChange={(e) => setCcode(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="collegeName">College Name</Label>
              <Input
                id="collegeName"
                value={collegeName}
                placeholder="e.g. College of Computer Studies"
                onChange={(e) => setName(e.target.value)}
              />
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
              onClick={handleEditCollege}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {updatedCollege && (
        <EntityConfirmationDialog
          entityType="College"
          entity={{
            code: updatedCollege.collegeCode,
            name: updatedCollege.collegeName,
          }}
          actionType="updated"
          onClose={() => {
            setUpdatedCollege(null)
            onCollegeUpdated?.()
            onClose()
          }}
        />
      )}
    </>
  )
}
