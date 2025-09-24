"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EntityConfirmationDialogProps {
  entityType: string 
  entity: {
    code: string
    name: string
  }
  onClose?: () => void
}

export function EntityConfirmationDialog({ entityType, entity, onClose }: EntityConfirmationDialogProps) {
  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {entityType} Added Successfully
          </DialogTitle>
          <DialogDescription>
            <span className="font-semibold">{entity.name} ({entity.code})</span> has been added to the system.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="default" onClick={onClose}>
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
