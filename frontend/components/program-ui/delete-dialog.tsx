"use client"

import { Program } from "@/components/table/program-columns"
import { EntityConfirmationDialog } from "@/components/global/entity-confirmation-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteProgram } from "@/lib/api/program-api"
import { useState } from "react"

interface DeleteProgramDialogProps {
  program: Program
  visible: boolean
  onClose: () => void
  onProgramDeleted?: () => void
}

export function DeleteProgramDialog({
  program,
  visible,
  onClose,
  onProgramDeleted,
}: DeleteProgramDialogProps) {
  const [deletedProgram, setDeletedProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDeleteProgram = async () => {
    setLoading(true)
    try {
      await deleteProgram(program.programCode)
      setDeletedProgram(program)
    } catch (error) {
      console.error("Failed to delete program:", error)
    } finally {
      setLoading(false)
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
            <strong>{program.programName}</strong> ({program.programCode})
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
              type="submit"
              disabled={loading}
              onClick={handleDeleteProgram}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {deletedProgram && (
        <EntityConfirmationDialog
          entityType="College"
          entity={{ code: program.programCode, name: program.programName }}
          actionType="deleted"
          onClose={() => {
            setDeletedProgram(null)
            onProgramDeleted?.()
            onClose()
          }}
        />
      )}
    </>
  )
}
