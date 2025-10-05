"use client"

import { Student } from "@/app/table/student-columns"
import { EntityConfirmationDialog } from "@/components/entity-confirmation-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteStudent } from "@/lib/student-api"
import { useState } from "react"

interface DeleteStudentDialogProps {
  student: Student
  visible: boolean
  onClose: () => void
  onStudentDeleted?: () => void
}

export function DeleteStudentDialog({ student, visible, onClose, onStudentDeleted }: DeleteStudentDialogProps) {
  const [deletedStudent, setDeletedStudent] = useState<Student | null>(null)
  const handleDeleteStudent = async () => {
    try {
      await deleteStudent(student.studentID)
      setDeletedStudent(student)
    } catch (error) {
      console.error("Failed to delete student:", error)
    }
  }

  return (
    <>
    <Dialog open={visible} onOpenChange={(open) => {
        if (!open) onClose()
      }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete <strong>{student.firstName} {student.lastName}</strong> ({student.studentID})</p>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onClose()}>Cancel</Button>
          <Button variant="destructive" onClick={handleDeleteStudent}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {deletedStudent && (
      <EntityConfirmationDialog
        entityType="Student"
        entity={{ code: student.studentID, name: `${student.firstName} ${student.lastName}` }}
        actionType="deleted"
        onClose={() => {
          setDeletedStudent(null)
          onStudentDeleted?.()
          onClose()
        }}
      />
    )}
    </>
  )
}
