import { College } from "@/app/table/college-columns"

export const fetchColleges = async (
  page: number = 1,
  perPage: number = 10
): Promise<{
  colleges: College[]
  total: number
  pages: number
  current_page: number
}> => {
  const res = await fetch(`http://127.0.0.1:5000/api/colleges?page=${page}&per_page=${perPage}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors'
  })
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

  const data = await res.json()
  console.log("Total colleges:", data.total) 
  return data
}

export const fetchCollegesForDropdown = async (): Promise<College[]> => {
  const res = await fetch("http://127.0.0.1:5000/api/colleges/dropdown")
  if (!res.ok) {
    const text = await res.text()
    console.error("Server returned:", text)
    throw new Error("Failed to fetch colleges")
  }
  const data = await res.json()

  return data.colleges
}

export const createCollege = async (collegeCode: string, collegeName: string) => {
  const res = await fetch("http://127.0.0.1:5000/api/colleges/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ collegeCode, collegeName }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || "Unknown error")
  }

  return await res.json()
}


