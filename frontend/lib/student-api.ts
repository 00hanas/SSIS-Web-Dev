import { Student } from "@/app/table/student-columns"

const BASE_URL = "http://127.0.0.1:5000/api/students"

export const fetchStudents = async (
  page: number = 1,
  perPage: number = 15,
  search: string = "",
  searchBy: "all" | "studentID" | "firstName" | "lastName" | "programCode" | "yearLevel" | "gender" = "all",
  sortBy: "all" | "studentID" | "firstName" | "lastName" | "programCode" | "yearLevel" | "gender" = "lastName",
  order: "asc" | "desc" = "asc",
  token?: string
): Promise<{ 
    students: Student[]
    total: number
    pages: number
    current_page: number 
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    search,
    searchBy,
    sortBy: sortBy,
    order
  })

  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    mode: 'cors'
  })
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const data = await res.json()
    console.log("Total students:", data.total)
    return data
}

export const createStudent = async (studentID: string, firstName: string, lastName: string, programCode: string, yearLevel: number, gender: string, token?: string) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ studentID, firstName, lastName, programCode, yearLevel, gender }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || "Unknown error")
  }

  return await res.json()
}

export async function fetchStudent(studentID: string, token?: string): Promise<Student> {
  const response = await fetch(`${BASE_URL}/${studentID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    mode: "cors"
  })

  if (!response.ok) {
    console.error("Fetch failed with status:", response.status)
    throw new Error("Failed to fetch student")
  }
  const data = await response.json()
  console.log("Fetched student:", data)
  return data
}

export async function updateStudent(originalCode: string, studentID: string, firstName: string, lastName: string, programCode: string, yearLevel: number, gender: string, token?: string): Promise<Student> {
  const response = await fetch(`${BASE_URL}/${originalCode}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ studentID, firstName, lastName, programCode, yearLevel, gender }),
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to update student")
  }

  return data.student
}

export async function deleteStudent(studentID: string, token?: string) {
  const response = await fetch(`${BASE_URL}/${studentID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    mode: "cors"
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to delete student")
  }

  return await response.json()
}