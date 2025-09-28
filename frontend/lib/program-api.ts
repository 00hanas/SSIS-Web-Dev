import { Program } from "@/app/table/program-columns"

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
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    search,
    searchBy,
    sort_by: sortBy,
    order
  })

  const res = await fetch(`http://127.0.0.1:5000/api/programs?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors'
  })
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  
  const data = await res.json()
  console.log("Total programs:", data.total)
  return data
}

export const fetchProgramsForDropdown = async (): Promise<Program[]> => {
  const res = await fetch("http://127.0.0.1:5000/api/programs/dropdown")
  if (!res.ok) {
    const text = await res.text()
    console.error("Server returned:", text)
    throw new Error("Failed to fetch programs")
  }
  const data = await res.json()

  return data.programs
}

export const createProgram = async (programCode: string, programName: string, collegeCode: string) => {
  const res = await fetch("http://127.0.0.1:5000/api/programs/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ programCode, programName, collegeCode }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || "Unknown error")
  }

  return await res.json()
}

export async function fetchProgram(programCode: string): Promise<Program> {
  const response = await fetch(`http://127.0.0.1:5000/api/programs/${programCode}`)
  if (!response.ok) {
    console.error("Fetch failed with status:", response.status)
    throw new Error("Failed to fetch program")
  }
  const data = await response.json()
  console.log("Fetched program:", data)
  return data
}

export async function updateProgram(originalCode: string, programCode: string, programName: string, collegeCode: string): Promise<Program> {
  const response = await fetch(`http://127.0.0.1:5000/api/programs/${originalCode}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ programCode, programName, collegeCode }),
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to update program")
  }

  return data.program
}

export async function deleteProgram(programCode: string) {
  const response = await fetch(`http://127.0.0.1:5000/api/programs/${programCode}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to delete program")
  }

  return await response.json()
}