import { College } from "@/app/table/college-columns"

const BASE_URL = "http://127.0.0.1:5000/api/colleges"


export const fetchColleges = async (
  page: number = 1,
  perPage: number = 15,
  search: string = "",
  searchBy: "all" | "collegeCode" | "collegeName" = "all",
  sortBy: "collegeCode" | "collegeName" = "collegeCode",
  order: "asc" | "desc" = "asc"
): Promise<{
  colleges: College[]
  total: number
  pages: number
  current_page: number
}> => {

  const safeSearchBy = searchBy === "all" ? "all" : searchBy
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    search,
    searchBy: safeSearchBy,
    sortBy,
    order
  })

  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  })

  const data = await res.json()
  console.log("Total colleges:", data.total)
  return data
}

export const fetchCollegesForDropdown = async (): Promise<College[]> => {
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
    throw new Error("Failed to fetch colleges")
  }

  const data = await res.json()
  return data.colleges
}

export const createCollege = async (
  collegeCode: string,
  collegeName: string
) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ collegeCode, collegeName })
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || "Unknown error")
  }

  return await res.json()
}

export const fetchCollege = async (
  collegeCode: string
): Promise<College> => {
  const res = await fetch(`${BASE_URL}/${collegeCode}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!res.ok) {
    console.error("Fetch failed with status:", res.status)
    throw new Error("Failed to fetch college")
  }

  return await res.json()
}

export const updateCollege = async (
  originalCode: string,
  collegeCode: string,
  collegeName: string
): Promise<College> => {
  const res = await fetch(`${BASE_URL}/${originalCode}`, {
    method: "PUT",
    credentials: "include", 
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ collegeCode, collegeName })
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Failed to update college")
  return data.college
}

export const deleteCollege = async (
  collegeCode: string
) => {
  const res = await fetch(`${BASE_URL}/${collegeCode}`, {
    method: "DELETE",
    credentials: "include", 
    headers: {
      "Content-Type": "application/json"
    }
  })

  const contentType = res.headers.get("content-type")
  if (!res.ok) {
    if (contentType?.includes("application/json")) {
      const error = await res.json()
      throw new Error(error.error || "Failed to delete college")
    } else {
      throw new Error("Unexpected server error")
    }
  }

  return await res.json()
}

export async function fetchCollegesTotal(): Promise<number> {
  const res = await fetch("http://127.0.0.1:5000/api/colleges/total", {
    method: "GET",
    credentials: "include",
  })
  const data = await res.json()
  return data.total
}
