"use client"

import { Program } from "@/app/table/programs-columns"
import { EntityConfirmationDialog } from "@/components/entity-confirmation-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteProgram } from "@/lib/program-api"
import { useEffect, useState } from "react"

interface DeleteProgramDialogProps {
  program: {
    programCode: string
    programName: string
    collegeCode: string
  }
  onProgramDeleted?: () => void
}

export function DeleteProgramDialog({ program, onProgramDeleted }: DeleteProgramDialogProps) {
  const [isOpen, setIsOpen] = useState (false)
  const [deletedProgram, setDeletedProgram] = useState<Program | null>(null)

  useEffect(() => {
    if (program?.programCode) {
      setIsOpen(true)
    }
  }, [program.programCode])

  const handleDeleteProgram = async () => {
    try {
      await deleteProgram(program.programCode)
      setDeletedProgram(program)
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to delete program:", error)
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
        <p>Are you sure you want to delete <strong>{program.programName}</strong> ({program.programCode})</p>
       <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDeleteProgram}>Delete</Button>
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
        }}
      />
    )}
    </>
  )
}
