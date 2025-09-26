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
import { createCollege } from "@/lib/college-api"
import { College } from "../../table/college-columns"
import { EntityConfirmationDialog } from "@/components/entity-confirmation-dialog"

type AddCollegeDialogProps = {
  onCollegeAdded?: () => void
}

export function AddCollegeDialog({ onCollegeAdded }: AddCollegeDialogProps) {
  const [addedCollege, setAddedCollege] = useState<College | null>(null)
  const [collegeCode, setCcode] = useState("")
  const [collegeName, setName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleAddCollege = async () => {
    if (!collegeCode.trim() || !collegeName.trim()) {
      setErrorMessage("Please fill in both fields.")
      return
    }

    try {
      const response = await createCollege(collegeCode, collegeName)
      setAddedCollege(response.college)
      setCcode("")
      setName("")
      setErrorMessage("")
      setIsOpen(false)
      onCollegeAdded?.()
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
        <Button variant="default" size="sm" onClick={() => setIsOpen(true)}>
          Add College
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Add a new College</DialogTitle>
      <DialogDescription>
        Fill in the details below to add a college.
      </DialogDescription>
    </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="collegeCode">College Code</Label>
                <Input
                  id="collegeCode"
                  placeholder="e.g. CCS"
                  value={collegeCode}
                  onChange={(e) => setCcode(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="collegeName">College Name</Label>
                <Input
                  id="collegeName"
                  placeholder="e.g. College of Computer Studies"
                  value={collegeName}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {errorMessage && (
                <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleAddCollege}>
                Save
              </Button>
            </DialogFooter>
      </DialogContent>
    </Dialog>
    {addedCollege && (
      <EntityConfirmationDialog
        entityType="College"
        entity={{ code: addedCollege.collegeCode, name: addedCollege.collegeName }}
        actionType="added"
        onClose={() => setAddedCollege(null)}
      />
    )}
  </>
  )
}
