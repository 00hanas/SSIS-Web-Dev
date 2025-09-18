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

interface DeleteCollegeDialogProps {
  college: {
    ccode: string
    name: string
  }
  onDelete?: (college: { ccode: string; name: string }) => void
}

export function DeleteCollegeDialog({ college, onDelete }: DeleteCollegeDialogProps) {
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
          <DialogTitle>Delete College</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{college.name} ({college.ccode})</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => {
              console.log("Deleting college", college)
              onDelete?.(college)
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
