import { fetchStudent } from "@/lib/api/student-api"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import Image from "next/image"
import { Badge } from "../ui/badge"
import { fetchProgramsForDropdown } from "@/lib/api/program-api"
import { Program } from "../table/program-columns"

type ViewStudentDialogProps = {
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
}

export function ViewStudentDialog({
  student,
  visible,
  onClose,
}: ViewStudentDialogProps) {
  const [studentData, setStudentData] = useState(student)
  const [programs, setPrograms] = useState<Program[]>([])

  useEffect(() => {
    if (visible) {
      const loadStudentData = async () => {
        try {
          const data = await fetchStudent(student.studentID)
          setStudentData(data)
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

  const program = programs.find(
    (p) => p.programCode === studentData.programCode
  )

  return (
    <Dialog
      open={visible}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Student Profile</DialogTitle>
        </DialogHeader>
        <div className="container mt-2 mb-5">
          <div className="mb-8 flex flex-row">
            {studentData.photoUrl ? (
              <Image
                src={studentData.photoUrl}
                alt={`${studentData.firstName} ${studentData.lastName}`}
                width={150}
                height={150}
                className="!h-15 !w-15 rounded-full object-cover"
              />
            ) : null}
            <div className="ml-4 flex flex-col">
              <span className="mb-1 text-[18px] font-medium tracking-wide">
                {studentData.firstName} {studentData.lastName}
              </span>
              <Badge className="text-[10px] tracking-wide">
                {studentData.studentID}
              </Badge>
            </div>
          </div>
          <div className="flex-cols-2 mr-10 ml-10 flex gap-10 rounded-sm border p-5 shadow-sm">
            <div className="mr-5 flex !w-2/3 flex-col">
              <div className="mb-5 flex flex-col">
                <span className="text-muted-foreground mb-2 text-[11px] tracking-wide">
                  Program
                </span>
                {program ? (
                  <>
                    <span className="text-sm">{program.programName}</span>
                  </>
                ) : (
                  <span className="text-sm">{studentData.programCode}</span>
                )}
              </div>
              <div className="mb-5 flex flex-col">
                <span className="text-muted-foreground mb-2 text-[11px] tracking-wide">
                  Year Level
                </span>
                <span className="text-sm">{studentData.yearLevel}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-5 flex flex-col">
                <span className="text-muted-foreground mb-2 text-[11px] tracking-wide">
                  College
                </span>
                {program ? (
                  <>
                    <span className="text-sm">{program.collegeCode}</span>
                  </>
                ) : (
                  <span className="text-sm">N/A</span>
                )}
              </div>
              <div className="mb-5 flex flex-col">
                <span className="text-muted-foreground mb-2 text-[11px] tracking-wide">
                  Gender
                </span>
                <span className="text-sm">{studentData.gender}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
