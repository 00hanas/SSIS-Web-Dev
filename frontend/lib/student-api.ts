import { Student } from "@/app/table/student-columns"

export const fetchStudents = async (
  page: number = 1,
  perPage: number = 10,
): Promise<{ 
    students: Student[]
    total: number
    pages: number
    current_page: number 
}> => {
  const res = await fetch(`http://127.0.0.1:5000/api/students?page=${page}&per_page=${perPage}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors'
  })
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const data = await res.json()
    console.log("Total students:", data.total)
    return data
}

export const createStudent = async (studentID: string, firstName: string, lastName: string, programCode: string, yearLevel: number, gender: string) => {
  const res = await fetch("http://127.0.0.1:5000/api/students/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentID, firstName, lastName, programCode, yearLevel, gender }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || "Unknown error")
  }

  return await res.json()
}
