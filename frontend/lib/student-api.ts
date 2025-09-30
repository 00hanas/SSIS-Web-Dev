import { Student } from "@/app/table/student-columns"

const BASE_URL = "http://127.0.0.1:5000/api/students"

function sanitizeQuery(value: string | undefined): string {
  return value?.trim() === "search" ? "" : value?.trim() || ""
}

export const fetchStudents = async (
  page: number = 1,
  perPage: number = 15,
  search: string = "",
  searchBy: "all" | "studentID" | "firstName" | "lastName" | "programCode" | "yearLevel" | "gender" = "all",
  sortBy: "studentID" | "firstName" | "lastName" | "programCode" | "yearLevel" | "gender" = "lastName",
  order: "asc" | "desc" = "asc"
): Promise<{ 
  students: Student[]
  total: number
  pages: number
  current_page: number 
}> => {

  const safeSearchBy = searchBy === "all" ? "all" : searchBy
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    search: sanitizeQuery(search),
    searchBy: safeSearchBy,
    sortBy,
    order
  })

  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  })

  
  const data = await res.json()
  console.log("Total students:", data.total)
  return data
}


export const createStudent = async (
  studentID: string,
  firstName: string,
  lastName: string,
  programCode: string,
  yearLevel: number,
  gender: string
) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    credentials: "include", 
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ studentID, firstName, lastName, programCode, yearLevel, gender })
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || "Unknown error")
  }

  return await res.json()
}

export const fetchStudent = async (
  studentID: string
): Promise<Student> => {
  const response = await fetch(`${BASE_URL}/${studentID}`, {
    method: "GET",
    credentials: "include", 
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    console.error("Fetch failed with status:", response.status)
    throw new Error("Failed to fetch student")
  }

  const data = await response.json()
  console.log("Fetched student:", data)
  return data
}

export const updateStudent = async (
  originalCode: string,
  studentID: string,
  firstName: string,
  lastName: string,
  programCode: string,
  yearLevel: number,
  gender: string
): Promise<Student> => {
  const response = await fetch(`${BASE_URL}/${originalCode}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ studentID, firstName, lastName, programCode, yearLevel, gender })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || "Failed to update student")
  }

  return data.student
}

export const deleteStudent = async (
  studentID: string
) => {
  const response = await fetch(`${BASE_URL}/${studentID}`, {
    method: "DELETE",
    credentials: "include", 
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to delete student")
  }

  return await response.json()
}
