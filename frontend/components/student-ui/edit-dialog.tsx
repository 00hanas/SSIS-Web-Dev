"use client"

import { useState, useEffect, useRef } from "react"
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
import {
  fetchStudent,
  updateStudent,
  updateStudentAssets,
  deleteStudentPhoto,
} from "@/lib/api/student-api"
import { EntityConfirmationDialog } from "@/components/global/entity-confirmation-dialog"
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
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
  }, [
    visible,
    student.studentID,
    student.firstName,
    student.lastName,
    student.programCode,
    student.yearLevel,
    student.gender,
    student.photoUrl,
  ])

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

    if (photoFile) {
      if (
        !["image/jpg", "image/jpeg", "image/png", "image/svg+xml"].includes(
          photoFile.type
        )
      ) {
        setErrorMessage("Only image files are allowed.")
        return
      }

      const maxSize = 2 * 1024 * 1024
      if (photoFile.size > maxSize) {
        setErrorMessage("Photo must be smaller than 2 MB.")
        if (fileInputRef.current) fileInputRef.current.value = ""
        return
      }
    }

    try {
      let uploadedPhotoUrl = photoUrl || "/student-icon.jpg"

      if (photoFile) {
        const newUrl = await updateStudentAssets(
          originalId,
          studentID.trim(),
          photoFile
        )
        if (newUrl) uploadedPhotoUrl = newUrl
      } else if (originalId !== studentID.trim()) {
        const newUrl = await updateStudentAssets(originalId, studentID.trim())
        if (newUrl) uploadedPhotoUrl = newUrl
      } else if (
        photoUrl === "/student-icon.jpg" &&
        student.photoUrl &&
        student.photoUrl !== "/student-icon.jpg"
      ) {
        await deleteStudentPhoto(originalId, student.photoUrl)
        uploadedPhotoUrl = "/student-icon.jpg"
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
            <div className="flex flex-col items-center gap-4">
              <Label htmlFor="photo">Photo (optional)</Label>
              <div className="relative flex items-center justify-center">
                {photoUrl && photoUrl !== "/student-icon.jpg" ? (
                  <Image
                    src={photoUrl}
                    alt="Current student photo"
                    width={120}
                    height={120}
                    className="!h-20 !w-20 rounded-full border border-gray-300 object-cover"
                  />
                ) : (
                  <div
                    className="flex !h-20 !w-20 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="text-3xl font-bold">+</span>
                  </div>
                )}

                {photoUrl && photoUrl !== "/student-icon.jpg" && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setPhotoFile(null)
                      setPhotoUrl("/student-icon.jpg")
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                    className="absolute -top-2 -right-2 !h-5 !w-5 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    ✕
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2"
              >
                {photoUrl && photoUrl !== "/student-icon.jpg"
                  ? "Change Photo"
                  : "Upload Photo"}
              </Button>
              <input
                ref={fileInputRef}
                id="photo"
                type="file"
                accept="image/*"
                className="hidden"
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
