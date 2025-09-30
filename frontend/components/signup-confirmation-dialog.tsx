"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SignUpSuccessDialogProps {
  open: boolean
  onClose: () => void
}

export function SignUpSuccessDialog({ open, onClose }: SignUpSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="mx-auto w-100">
        <DialogHeader>
          <DialogTitle >Account Created</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          You’ve successfully signed up for SSIS. You can now log in and start exploring.
        </p>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
