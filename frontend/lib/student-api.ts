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
 
