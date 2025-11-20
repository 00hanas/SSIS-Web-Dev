import { fetchColleges, fetchCollegesTotal } from "@/lib/api/college-api"
import { fetchPrograms, fetchProgramsTotal } from "@/lib/api/program-api"
import { fetchStudents, fetchStudentsTotal } from "@/lib/api/student-api"
import { College } from "@/components/table/college-columns"
import { Program } from "@/components/table/program-columns"
import { Student } from "@/components/table/student-columns"

export async function loadColleges() {
  const data = await fetchColleges()
  const total = await fetchCollegesTotal()
  return { colleges: data.colleges as College[], total }
}

export async function loadPrograms() {
  const data = await fetchPrograms()
  const total = await fetchProgramsTotal()
  return { programs: data.programs as Program[], total }
}

export async function loadStudents() {
  const data = await fetchStudents()
  const total = await fetchStudentsTotal()
  return { students: data.students as Student[], total }
}
