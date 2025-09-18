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

export function AddCollegeDialog() {
  const [ccode, setCcode] = useState("")
  const [name, setName] = useState("")

  const handleAddCollege = () => {
    console.log("College Code:", ccode)
    console.log("College Name:", name)
    setCcode("")
    setName("")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Add College
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new College</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a college.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="ccode">College Code</Label>
            <Input
              id="ccode"
              placeholder="e.g. CCS"
              value={ccode}
              onChange={(e) => setCcode(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">College Name</Label>
            <Input
              id="name"
              placeholder="e.g. College of Computer Studies"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleAddCollege}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
