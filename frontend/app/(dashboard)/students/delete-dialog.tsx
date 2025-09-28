"use client"

import { Student } from "@/app/table/student-columns"
import { EntityConfirmationDialog } from "@/components/entity-confirmation-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteStudent } from "@/lib/student-api"
import { DeleteOutlineSharp as DeleteIcon } from '@mui/icons-material'
import { useEffect, useState } from "react"

interface DeleteStudentDialogProps {
  student: {
    studentID: string
    firstName: string
    lastName: string
    programCode: string
    yearLevel: 1 | 2 | 3 | 4 | 5
    gender: "Female" | "Male"
  }
  onStudentDeleted?: () => void
}

export function DeleteStudentDialog({ student, onStudentDeleted }: DeleteStudentDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [deletedStudent, setDeletedStudent] = useState<Student | null>(null)

  useEffect (() => {
    if (student?.studentID) {
      setIsOpen(true)
    }
  }, [student.studentID])

  const handleDeleteStudent = async () => {
    try {
      await deleteStudent(student.studentID)
      setDeletedStudent(student)
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to delete student:", error)
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
        <p>Are you sure you want to delete <strong>{student.firstName} {student.lastName}</strong> ({student.studentID})</p>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
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
        }}
      />
    )}
    </>
  )
}
