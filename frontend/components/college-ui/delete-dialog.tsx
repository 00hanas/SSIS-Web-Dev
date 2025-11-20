"use client"

import { College } from "@/components/table/college-columns"
import { EntityConfirmationDialog } from "@/components/global/entity-confirmation-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteCollege } from "@/lib/api/college-api"
import { useState } from "react"

interface DeleteCollegeDialogProps {
  college: College
  visible: boolean
  onClose: () => void
  onCollegeDeleted?: () => void
}

export function DeleteCollegeDialog({
  college,
  visible,
  onClose,
  onCollegeDeleted,
}: DeleteCollegeDialogProps) {
  const [deletedCollege, setDeletedCollege] = useState<College | null>(null)

  const handleDeleteCollege = async () => {
    try {
      await deleteCollege(college.collegeCode)
      setDeletedCollege(college)
    } catch (error) {
      console.error("Failed to delete college:", error)
    }
  }

  return (
    <>
      <Dialog
        open={visible}
        onOpenChange={(open) => {
          if (!open) onClose()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <strong>{college.collegeName}</strong> ({college.collegeCode})?
          </p>
          <DialogFooter>
            <Button
              className="cursor-pointer"
              variant="secondary"
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={handleDeleteCollege}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {deletedCollege && (
        <EntityConfirmationDialog
          entityType="College"
          entity={{
            code: deletedCollege.collegeCode,
            name: deletedCollege.collegeName,
          }}
          actionType="deleted"
          onClose={() => {
            setDeletedCollege(null)
            onCollegeDeleted?.()
            onClose()
          }}
        />
      )}
    </>
  )
}
