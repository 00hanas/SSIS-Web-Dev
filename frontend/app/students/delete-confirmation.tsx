"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DeleteOutlineSharp as DeleteIcon } from '@mui/icons-material'

interface DeleteStudentDialogProps {
  student: {
    id: string
    fname: string
    lname: string
    pcode: string
    ylevel: 1 | 2 | 3 | 4 | 5
    gender: "Female" | "Male"
  }
  onDelete?: (student: { id: string; fname: string; lname: string; pcode: string; ylevel: 1 | 2 | 3 | 4 | 5;
    gender: "Female" | "Male" }) => void
}

export function DeleteStudentDialog({ student, onDelete }: DeleteStudentDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
              <Button variant="ghost" className="w-full flex justify-between">
                  <span>Delete</span>
                  <DeleteIcon className="h-4 w-4 text-muted-foreground" />
              </Button>
              </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Student</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{student.fname} {student.lname}  ({student.id})</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => {
              console.log("Deleting student", student)
              onDelete?.(student)
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
