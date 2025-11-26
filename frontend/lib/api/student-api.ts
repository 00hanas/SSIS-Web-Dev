import { Student } from "@/components/table/student-columns"

const BASE_URL = "http://127.0.0.1:5000/api/students"

export const fetchStudents = async (): Promise<{
  students: Student[]
}> => {
  const res = await fetch(`${BASE_URL}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const data = await res.json()
  console.log("Fetched students:", data.students)
  return data
}

export const createStudent = async (
  studentID: string,
  firstName: string,
  lastName: string,
  programCode: string,
  yearLevel: number,
  gender: string,
  photoUrl: string
) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      studentID,
      firstName,
      lastName,
      programCode,
      yearLevel,
      gender,
      photoUrl,
    }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || "Unknown error")
  }

  return await res.json()
}

export const fetchStudent = async (studentID: string): Promise<Student> => {
  const response = await fetch(`${BASE_URL}/${studentID}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
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
  gender: string,
  photoUrl: string
): Promise<Student> => {
  const response = await fetch(`${BASE_URL}/${originalCode}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      studentID,
      firstName,
      lastName,
      programCode,
      yearLevel,
      gender,
      photoUrl,
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || "Failed to update student")
  }

  return data.student
}

export const deleteStudent = async (studentID: string) => {
  const response = await fetch(`${BASE_URL}/${studentID}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to delete student")
  }

  return await response.json()
}

export const fetchStudentsByProgram = async (
  programCode: string
): Promise<Student[]> => {
  const params = new URLSearchParams()
  if (programCode !== "all") {
    params.set("programCode", programCode)
  }

  const res = await fetch(`${BASE_URL}/by-program?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  })

  if (!res.ok) throw new Error("Failed to fetch students by program")
  const data = await res.json()
  return data.students
}

export async function fetchStudentCountsByProgram() {
  const res = await fetch(
    "http://127.0.0.1:5000/api/students/count-by-program",
    {
      method: "GET",
      credentials: "include",
    }
  )
  if (!res.ok) throw new Error("Failed to fetch counts")
  return res.json()
}

export async function fetchStudentCountByGender() {
  const res = await fetch(
    "http://127.0.0.1:5000/api/students/count-by-gender",
    {
      method: "GET",
      credentials: "include",
    }
  )
  if (!res.ok) throw new Error("Failed to fetch gender counts")
  return res.json()
}

export async function fetchStudentsTotal(): Promise<number> {
  const res = await fetch("http://127.0.0.1:5000/api/students/total", {
    method: "GET",
    credentials: "include",
  })
  const data = await res.json()
  return data.total
}
