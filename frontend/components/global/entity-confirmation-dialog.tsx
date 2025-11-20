"use client"

import { useEffect } from "react"
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
  actionType?: "added" | "updated" | "deleted"
  onClose?: () => void
}

export function EntityConfirmationDialog({
  entityType,
  entity,
  actionType = "added",
  onClose,
}: EntityConfirmationDialogProps) {
  const verb = {
    added: "added to the system",
    updated: "updated successfully",
    deleted: "deleted from the system",
  }[actionType]

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, 10000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open && onClose) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {entityType}{" "}
            {actionType.charAt(0).toUpperCase() + actionType.slice(1)}{" "}
            Successfully
          </DialogTitle>
          <DialogDescription>
            <span className="font-semibold">
              {entity.name} ({entity.code})
            </span>{" "}
            has been {verb}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="default"
            onClick={() => onClose?.()}
          >
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
