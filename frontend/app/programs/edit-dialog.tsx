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
import { EditNoteSharp as EditIcon } from '@mui/icons-material'

//to be replaced with actual data fetching logic
import { mockData as Colleges } from "../colleges/page"

type EditProgramDialogProps = {
    program: {
        pcode: string
        name: string
        ccode: string
    }
}

export function EditProgramDialog( { program }: EditProgramDialogProps) {
    const [pcode, setPcode] = useState(program.pcode)
    const [name, setName] = useState(program.name)
    const [ccode, setCcode] = useState(program.ccode)

    const handleEditProgram = () => {
        console.log("Updated Program Code:", pcode)
        console.log("Updated Program Name:", name)
        console.log("Updated College Code:", ccode)
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
                    <DialogTitle>Edit Program</DialogTitle>
                    <DialogDescription>
                        Update the fields below to modify this program."
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="pcode">Program Code</Label>
                        <Input
                            id="pcode"
                            value={pcode}
                            onChange={(e) => setPcode(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Program Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
            <Label htmlFor="ccode">College</Label>
            <Select value={ccode} onValueChange={setCcode}>
              <SelectTrigger>
                <SelectValue />
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
          <Button type="button" onClick={handleEditProgram}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
    
}