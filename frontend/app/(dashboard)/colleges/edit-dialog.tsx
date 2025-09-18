"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EditNoteSharp as EditIcon } from '@mui/icons-material'

type EditCollegeDialogProps = {
  college: {
    ccode: string
    name: string
  }
}

export function EditCollegeDialog({ college }: EditCollegeDialogProps) {
  const [ccode, setCcode] = useState(college.ccode)
  const [name, setName] = useState(college.name)

  const handleEditCollege = () => {
    console.log("Updated College Code:", ccode)
    console.log("Updated College Name:", name)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full flex justify-between">
            <span>Edit</span>
            <EditIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit College</DialogTitle>
          <DialogDescription>
            Update the fields below to modify this college.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="ccode">College Code</Label>
            <Input
              id="ccode"
              value={ccode}
              onChange={(e) => setCcode(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">College Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleEditCollege}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
