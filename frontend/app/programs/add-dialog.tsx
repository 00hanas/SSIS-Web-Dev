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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

//to be replaced with actual data fetching logic
import { mockData as Colleges } from "../colleges/page"


export function AddProgramDialog() {
    const [pcode, setPcode] = useState("")
    const [name, setName] = useState("")
    const [ccode, setCcode] = useState("")

    const handleAddProgram = () => {
        console.log("Program Code:", pcode)
        console.log("Program Name:", name)
        console.log("College Code:", ccode)
        setPcode("")
        setName("")
        setCcode("")
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    Add Program
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add a new Program</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a program.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="pcode">Program Code</Label>
                        <Input
                            id="pcode"
                            placeholder="e.g. BSCS"
                            value={pcode}
                            onChange={(e) => setPcode(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Program Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Bachelor of Science in Computer Science"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
            <Label htmlFor="ccode">College</Label>
            <Select value={ccode} onValueChange={setCcode}>
              <SelectTrigger>
                <SelectValue placeholder="Select a college" />
              </SelectTrigger>
              <SelectContent>
                {Colleges.map((Colleges) => (
                  <SelectItem key={Colleges.ccode} value={Colleges.ccode}>
                    {Colleges.name} ({Colleges.ccode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleAddProgram}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
    
}