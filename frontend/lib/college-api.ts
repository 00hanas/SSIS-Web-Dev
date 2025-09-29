import { College } from "@/app/table/college-columns"

const BASE_URL = "http://127.0.0.1:5000/api/colleges"

export const fetchColleges = async (
  page: number = 1,
  perPage: number = 15,
  search: string = "",
  searchBy: "all" | "collegeCode" | "collegeName" = "all",
  sortBy: "collegeCode" | "collegeName" = "collegeCode",
  order: "asc" | "desc" = "asc",
  token?: string
): Promise<{
  colleges: College[]
  total: number
  pages: number
  current_page: number
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    search,
    searchBy,
    sortBy,
    order
  })

  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    mode: "cors"
  })

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return await res.json()
}

export const fetchCollegesForDropdown = async (): Promise<College[]> => {
  const res = await fetch(`${BASE_URL}/dropdown`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    mode: "cors"
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
  collegeName: string,
  token?: string
) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
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
  collegeCode: string,
  token?: string
): Promise<College> => {
  const res = await fetch(`${BASE_URL}/${collegeCode}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    mode: "cors"
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
  collegeName: string,
  token?: string
): Promise<College> => {
  const res = await fetch(`${BASE_URL}/${originalCode}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ collegeCode, collegeName })
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Failed to update college")
  return data.college
}

export const deleteCollege = async (
  collegeCode: string,
  token?: string
) => {
  const res = await fetch(`${BASE_URL}/${collegeCode}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    mode: "cors"
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
