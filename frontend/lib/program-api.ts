import { Program } from "@/app/table/program-columns"

const BASE_URL = "http://127.0.0.1:5000/api/programs"

function sanitizeQuery(value: string | undefined): string {
  return value?.trim() === "search" ? "" : value?.trim() || ""
}

export const fetchPrograms = async (
  page: number = 1,
  perPage: number = 15,
  search: string = "",
  searchBy: "all" | "programCode" | "programName" | "collegeCode" = "all",
  sortBy: "programCode" | "programName" | "collegeCode" = "programCode",
  order: "asc" | "desc" = "asc"
): Promise<{ 
  programs: Program[]
  total: number
  pages: number
  current_page: number 
}> => {

  const safeSearchBy = searchBy === "all" ? "programName" : searchBy
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
  console.log("Total programs:", data.total)
  return data
}

export const fetchProgramsForDropdown = async (): Promise<Program[]> => {
  const res = await fetch(`${BASE_URL}/dropdown`, {
    method: "GET",
    credentials: "include", 
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!res.ok) {
    const text = await res.text()
    console.error("Server returned:", text)
    throw new Error("Failed to fetch programs")
  }

  const data = await res.json()
  return data.programs
}

export const createProgram = async (
  programCode: string,
  programName: string,
  collegeCode: string
) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    credentials: "include", 
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ programCode, programName, collegeCode })
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || "Unknown error")
  }

  return await res.json()
}

export const fetchProgram = async (
  programCode: string
): Promise<Program> => {
  const response = await fetch(`${BASE_URL}/${programCode}`, {
    method: "GET",
    credentials: "include", 
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    console.error("Fetch failed with status:", response.status)
    throw new Error("Failed to fetch program")
  }

  const data = await response.json()
  console.log("Fetched program:", data)
  return data
}

export const updateProgram = async (
  originalCode: string,
  programCode: string,
  programName: string,
  collegeCode: string
): Promise<Program> => {
  const response = await fetch(`${BASE_URL}/${originalCode}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ programCode, programName, collegeCode })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || "Failed to update program")
  }

  return data.program
}

export const deleteProgram = async (
  programCode: string
) => {
  const response = await fetch(`${BASE_URL}/${programCode}`, {
    method: "DELETE",
    credentials: "include", 
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to delete program")
  }

  return await response.json()
}
