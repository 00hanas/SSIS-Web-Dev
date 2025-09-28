"use client"

import { College } from "@/app/table/college-columns"
import { EntityConfirmationDialog } from "@/components/entity-confirmation-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteCollege, fetchCollege } from "@/lib/college-api"
import { useEffect, useState } from "react"

interface DeleteCollegeDialogProps {
  college: College
  onCollegeDeleted?: () => void
}

export function DeleteCollegeDialog({ college, onCollegeDeleted }: DeleteCollegeDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [deletedCollege, setDeletedCollege] = useState<College | null>(null)

  useEffect(() => {
    if (college?.collegeCode) {
      setIsOpen(true)
    }
  }, [college.collegeCode])

  const handleDeleteCollege = async () => {
    try {
      await deleteCollege(college.collegeCode)
      setDeletedCollege(college)
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to delete college:", error)
    }
  }

  const handleDialogClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) handleDialogClose()
        else setIsOpen(true)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete <strong>{college.collegeName}</strong> ({college.collegeCode})?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCollege}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {deletedCollege && (
        <EntityConfirmationDialog
          entityType="College"
          entity={{ code: deletedCollege.collegeCode, name: deletedCollege.collegeName }}
          actionType="deleted"
          onClose={() => {
            setDeletedCollege(null)
            onCollegeDeleted?.()
          }}
        />
      )}
    </>
  )
}
