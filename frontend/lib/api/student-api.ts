import { Student } from "@/components/table/student-columns"
import { supabase } from "../supabase/client"

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

export async function deleteStudentFolder(studentID: string) {
  try {
    const folderPath = `${studentID}/`

    // List files inside the folder
    const { data: files, error: listError } = await supabase.storage
      .from("students-photos")
      .list(folderPath, { limit: 1000 })

    if (listError) {
      console.error("Error listing files:", listError)
      return
    }

    if (!files || files.length === 0) {
      console.log("No files found in folder:", folderPath)
      return
    }

    // Build full file paths
    const filePaths = files.map((file) => `${folderPath}${file.name}`)

    const { error: delError } = await supabase.storage
      .from("students-photos")
      .remove(filePaths)

    if (delError) {
      console.error("Error deleting files:", delError)
      return
    }

    console.log(`Deleted all files under ${folderPath}`)
  } catch (err) {
    console.error("Unexpected error deleting folder:", err)
  }
}

export async function updateStudentAssets(
  oldID: string,
  newID: string,
  newPhotoFile?: File
): Promise<string | null> {
  let newPhotoUrl: string | null = null

  // If ID changed, move existing files
  if (oldID !== newID) {
    const { data, error } = await supabase.storage
      .from("students-photos")
      .list(oldID)

    if (error) {
      console.error("Error listing files:", error)
      return null
    }

    for (const file of data) {
      const oldPath = `${oldID}/${file.name}`
      const newPath = `${newID}/${file.name}`

      await supabase.storage.from("students-photos").copy(oldPath, newPath)
      await supabase.storage.from("students-photos").remove([oldPath])

      const { data: urlData } = supabase.storage
        .from("students-photos")
        .getPublicUrl(newPath)

      newPhotoUrl = urlData.publicUrl
    }
  }

  // If a new photo is provided, delete old ones first
  if (newPhotoFile) {
    // Delete all existing files under newID folder
    const { data: oldFiles, error: listError } = await supabase.storage
      .from("students-photos")
      .list(newID)

    if (!listError && oldFiles && oldFiles.length > 0) {
      const oldPaths = oldFiles.map((f) => `${newID}/${f.name}`)
      await supabase.storage.from("students-photos").remove(oldPaths)
    }

    // Upload new photo
    const filePath = `${newID}/${Date.now()}-${newPhotoFile.name}`
    const { error: uploadError } = await supabase.storage
      .from("students-photos")
      .upload(filePath, newPhotoFile, { upsert: true })

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("students-photos")
        .getPublicUrl(filePath)

      newPhotoUrl = urlData.publicUrl
    }
  }

  return newPhotoUrl
}

export async function deleteStudentPhoto(studentId: string, photoUrl: string) {
  try {
    const urlParts = photoUrl.split("/students-photos/")
    if (urlParts.length < 2) return false
    const path = urlParts[1] // "2023-0001/photo.png"

    const { error } = await supabase.storage
      .from("students-photos")
      .remove([path])

    if (error) throw error
    return true
  } catch (err) {
    console.error("Failed to delete photo:", err)
    return false
  }
}
