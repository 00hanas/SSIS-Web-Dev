"use client"

import { useState, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Program } from "../table/program-columns"
import { fetchProgramsForDropdown } from "@/lib/api/program-api"
import { Student } from "@/components/table/student-columns"
import { createStudent } from "@/lib/api/student-api"
import { EntityConfirmationDialog } from "@/components/global/entity-confirmation-dialog"
import { supabase } from "@/lib/supabase/client"
import Image from "next/image"

type AddStudentDialogProps = {
  onStudentAdded?: () => void
}

export function AddStudentDialog({ onStudentAdded }: AddStudentDialogProps) {
  const [addedStudent, setAddedStudent] = useState<Student | null>(null)
  const [programs, setPrograms] = useState<Program[]>([])
  const [studentID, setId] = useState("")
  const [firstName, setFname] = useState("")
  const [lastName, setLname] = useState("")
  const [programCode, setPcode] = useState("")
  const [yearLevel, setYlevel] = useState("")
  const [gender, setGender] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const data = await fetchProgramsForDropdown()
        setPrograms(data)
      } catch (error) {
        console.error("Failed to load programs:", error)
      }
    }
    loadPrograms()
  }, [])

  const handleAddStudent = async () => {
    const studentIdPattern = /^\d{4}-\d{4}$/
    if (
      !studentID.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !programCode.trim() ||
      !yearLevel.trim() ||
      !gender.trim()
    ) {
      setErrorMessage("Please fill in all fields.")
      return
    }

    if (!studentIdPattern.test(studentID.trim())) {
      setErrorMessage(
        "Student ID must follow the format XXXX-XXXX using digits only."
      )
      return
    }

    try {
      let uploadedPhotoUrl = "/student-icon.jpg"

      if (photoFile) {
        const filePath = `${studentID}/${Date.now()}-${photoFile.name}`
        const { error } = await supabase.storage
          .from("students-photos")
          .upload(filePath, photoFile)

        if (error) {
          console.error("Upload error:", error)
        } else {
          const { data } = supabase.storage
            .from("students-photos")
            .getPublicUrl(filePath)
          uploadedPhotoUrl = data.publicUrl
        }
      }

      const response = await createStudent(
        studentID,
        firstName,
        lastName,
        programCode,
        parseInt(yearLevel),
        gender,
        uploadedPhotoUrl
      )

      setAddedStudent(response.student)
      resetForm()
      setIsOpen(false)
      onStudentAdded?.()
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Student ID already exists") {
          setErrorMessage(`Student ID (${studentID}) is already taken.`)
        } else if (error.message === "Missing required fields") {
          setErrorMessage("Please fill in all required fields.")
        } else {
          setErrorMessage(error.message || "Something went wrong. Try again.")
        }
      } else {
        setErrorMessage("Something went wrong. Try again.")
      }
    }
  }

  const resetForm = () => {
    setId("")
    setFname("")
    setLname("")
    setPcode("")
    setYlevel("")
    setGender("")
    setPhotoFile(null)
    setPhotoUrl(null)
    setErrorMessage("")
  }

  const handleDialogClose = () => {
    resetForm()
    setIsOpen(false)
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) handleDialogClose()
          else setIsOpen(true)
        }}
      >
        <DialogTrigger asChild className="cursor-pointer">
          <Button variant="default" size="sm">
            Add Student
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a new Student</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a student.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="studentID">Student ID</Label>
              <Input
                id="studentID"
                placeholder="e.g. 2023-0001"
                value={studentID}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "")
                  if (value.length > 4) {
                    value = value.slice(0, 4) + "-" + value.slice(4, 8)
                  }

                  setId(value)
                }}
                maxLength={9}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="e.g. Juhanara"
                value={firstName}
                onChange={(e) => setFname(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="e.g. Saluta"
                value={lastName}
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="programCode">Program</Label>
              <Select value={programCode} onValueChange={setPcode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {Array.isArray(programs) &&
                    programs.map((program) => (
                      <SelectItem
                        key={program.programCode}
                        value={program.programCode}
                      >
                        {program.programName} ({program.programCode})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="yearLevel">Year Level</Label>
              <Select value={yearLevel} onValueChange={setYlevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="photo">Photo (optional)</Label>
              {photoUrl && (
                <div className="mt-2">
                  <Image
                    src={photoUrl}
                    alt="Preview"
                    width={75}
                    height={75}
                    className="!h-15 !w-15 rounded-full object-cover"
                  />
                </div>
              )}
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setPhotoFile(file)

                  if (file) {
                    const previewUrl = URL.createObjectURL(file)
                    setPhotoUrl(previewUrl)
                  }
                }}
              />
            </div>
            {errorMessage && (
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="mr-auto cursor-pointer"
              onClick={resetForm}
            >
              Reset
            </Button>
            <DialogClose asChild>
              <Button className="cursor-pointer" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="cursor-pointer"
              type="button"
              onClick={handleAddStudent}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {addedStudent && (
        <EntityConfirmationDialog
          entityType="Student"
          entity={{
            code: addedStudent.studentID,
            name: `${addedStudent.firstName} ${addedStudent.lastName}`,
          }}
          actionType="added"
          onClose={() => setAddedStudent(null)}
        />
      )}
    </>
  )
}
