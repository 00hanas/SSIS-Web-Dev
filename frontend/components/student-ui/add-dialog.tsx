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
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
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
      setLoading(false)
      return
    }

    if (!studentIdPattern.test(studentID.trim())) {
      setErrorMessage(
        "Student ID must follow the format XXXX-XXXX using digits only."
      )
      setLoading(false)
      return
    }

    if (photoFile) {
      if (
        !["image/jpg", "image/jpeg", "image/png", "image/svg+xml"].includes(
          photoFile.type
        )
      ) {
        setErrorMessage("Only image files are allowed.")
        if (fileInputRef.current) fileInputRef.current.value = ""
        setLoading(false)
        return
      }

      const maxSize = 2 * 1024 * 1024
      if (photoFile.size > maxSize) {
        setErrorMessage("Photo must be smaller than 2 MB.")
        if (fileInputRef.current) fileInputRef.current.value = ""
        setLoading(false)
        return
      }
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
        uploadedPhotoUrl || "/student-icon.jpg"
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
    } finally {
      setLoading(false)
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
            <div className="flex flex-col items-center gap-4">
              <Label htmlFor="photo">Photo (optional)</Label>
              <div className="relative flex items-center justify-center">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt="Preview"
                    width={120}
                    height={120}
                    className="!h-20 !w-20 rounded-full border border-gray-300 object-cover"
                  />
                ) : (
                  <div className="flex !h-20 !w-20 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <span className="text-3xl font-bold">+</span>
                  </div>
                )}
                {photoUrl && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setPhotoFile(null)
                      setPhotoUrl(null)
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
                {photoUrl ? "Change Photo" : "Upload Photo"}
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
              type="submit"
              onClick={handleAddStudent}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
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
