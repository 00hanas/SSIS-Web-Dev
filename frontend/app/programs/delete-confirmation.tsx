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

interface DeleteProgramDialogProps {
  program: {
    pcode: string
    name: string
    ccode: string
  }
  onDelete?: (program: { pcode: string; name: string; ccode:string }) => void
}

export function DeleteProgramDialog({ program, onDelete }: DeleteProgramDialogProps) {
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
          <DialogTitle>Delete Program</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{program.name} ({program.pcode})</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => {
              console.log("Deleting program", program)
              onDelete?.(program)
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
