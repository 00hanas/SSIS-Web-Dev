import { useEffect, useState } from "react"

export function useCurrentUser() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/auth/ping", {
          method: "GET",
          credentials: "include",
        })
        const data = await res.json()
        if (res.ok) setUser(data.user)
      } catch (err) {
        console.error("Failed to fetch user", err)
      }
    }

    fetchUser()
  }, [])

  return user
}
