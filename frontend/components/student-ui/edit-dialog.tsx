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
import { fetchProgramsForDropdown } from "@/lib/api/program-api"
import { Program } from "../table/program-columns"
import { Student } from "@/components/table/student-columns"
import { fetchStudent, updateStudent } from "@/lib/api/student-api"
import { EntityConfirmationDialog } from "@/components/global/entity-confirmation-dialog"
import { supabase } from "@/lib/supabase/client"
import Image from "next/image"

type EditStudentDialogProps = {
  student: {
    studentID: string
    firstName: string
    lastName: string
    programCode: string
    yearLevel: number
    gender: string
    photoUrl?: string
  }
  visible: boolean
  onClose: () => void
  onStudentUpdated?: () => void
}

export function EditStudentDialog({
  student,
  visible,
  onClose,
  onStudentUpdated,
}: EditStudentDialogProps) {
  const [programs, setPrograms] = useState<Program[]>([])
  const [studentID, setId] = useState(student.studentID)
  const [firstName, setFname] = useState(student.firstName)
  const [lastName, setLname] = useState(student.lastName)
  const [programCode, setPcode] = useState(student.programCode)
  const [yearLevel, setYlevel] = useState(student.yearLevel)
  const [gender, setGender] = useState(student.gender)
  const [updatedStudent, setUpdatedStudent] = useState<Student | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [photoUrl, setPhotoUrl] = useState(student.photoUrl)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  useEffect(() => {
    if (visible) {
      setId(student.studentID)
      setFname(student.firstName)
      setLname(student.lastName)
      setPcode(student.programCode)
      setYlevel(student.yearLevel)
      setGender(student.gender)
      setPhotoUrl(student.photoUrl)
      setErrorMessage("")

      const loadStudentData = async () => {
        try {
          const data = await fetchStudent(student.studentID)
          setId(data.studentID)
          setFname(data.firstName)
          setLname(data.lastName)
          setPcode(data.programCode)
          setYlevel(data.yearLevel)
          setGender(data.gender)
          setPhotoUrl(data.photoUrl)
        } catch (error) {
          console.error("Failed to fetch student data:", error)
        }
      }
      loadStudentData()
    }
  }, [visible, student.studentID])

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const data = await fetchProgramsForDropdown()
        setPrograms(data)
      } catch (error) {
        console.error("Failed to load programs:", error)
        setPrograms([])
      }
    }

    loadPrograms()
  }, [])

  const handleEditStudent = async () => {
    const originalId = student.studentID
    const studentIdPattern = /^\d{4}-\d{4}$/

    if (
      !studentID.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !programCode.trim() ||
      !yearLevel.toString().trim() ||
      !gender.trim()
    ) {
      setErrorMessage("Please fill in all fields.")
      return
    }

    if (!studentIdPattern.test(studentID.trim())) {
      setErrorMessage("Student ID must follow the format YYYY-NNNN.")
      return
    }

    if (
      studentID.trim() === originalId.trim() &&
      firstName.trim() === student.firstName.trim() &&
      lastName.trim() === student.lastName.trim() &&
      programCode.trim() === student.programCode.trim() &&
      yearLevel === student.yearLevel &&
      gender.trim() === student.gender.trim() &&
      student.photoUrl === photoUrl
    ) {
      setErrorMessage("No changes detected.")
      return
    }

    try {
      let uploadedPhotoUrl = student.photoUrl || "/student-icon.jpg"

      if (photoFile) {
        const filePath = `${studentID}/${Date.now()}-${photoFile.name}`
        const { error } = await supabase.storage
          .from("students-photos")
          .upload(filePath, photoFile, { upsert: true })

        if (error) {
          console.error("Upload error:", error)
        } else {
          const { data } = supabase.storage
            .from("students-photos")
            .getPublicUrl(filePath)
          uploadedPhotoUrl = data.publicUrl
          setPhotoUrl(uploadedPhotoUrl)
        }
      }
      const response = await updateStudent(
        originalId,
        studentID.trim(),
        firstName.trim(),
        lastName.trim(),
        programCode.trim(),
        yearLevel,
        gender.trim(),
        uploadedPhotoUrl
      )

      setUpdatedStudent(response)
      setErrorMessage("")
    } catch (error: any) {
      const msg = error.message
      if (msg === "Student ID already exists") {
        setErrorMessage(`Student ID (${studentID}) is already taken.`)
      } else if (msg === "Missing required fields") {
        setErrorMessage("Please fill in all fields.")
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
    setYlevel(0)
    setGender("")
    setPhotoUrl("")
    setErrorMessage("")
  }

  return (
    <>
      <Dialog
        open={visible}
        onOpenChange={(open) => {
          if (!open) onClose()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the fields below to modify this student.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="studentID">Student ID</Label>
              <Input
                id="studentID"
                value={studentID}
                placeholder="e.g. 2023-0001"
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
                value={firstName}
                placeholder="e.g. Juhanara"
                onChange={(e) => setFname(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                placeholder="e.g. Saluta"
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="programCode">Program</Label>
              <Select value={programCode} onValueChange={setPcode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
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
              <Select
                value={yearLevel.toString()}
                onValueChange={(val) => setYlevel(Number(val))}
              >
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
              <div className="flex flex-col gap-2">
                {photoUrl && photoUrl !== "/student-icon.jpg" && (
                  <Image
                    src={photoUrl}
                    alt="Current student photo"
                    width={75}
                    height={75}
                    className="rounded-full"
                  />
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
            </div>
            {errorMessage && (
              <div className="text-sm text-red-600">{errorMessage}</div>
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
              onClick={handleEditStudent}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {updatedStudent && (
        <EntityConfirmationDialog
          entityType="Student"
          entity={{
            code: updatedStudent.studentID,
            name: `${updatedStudent.firstName} ${updatedStudent.lastName}`,
          }}
          actionType="updated"
          onClose={() => {
            setUpdatedStudent(null)
            onStudentUpdated?.()
            onClose()
          }}
        />
      )}
    </>
  )
}
