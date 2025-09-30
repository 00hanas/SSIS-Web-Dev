import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") return

    const checkAuth = async () => {
      let attempts = 0
      while (attempts < 3) {
        try {
          const res = await fetch("http://127.0.0.1:5000/api/auth/ping", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          })
          console.log("Ping response:", res.status)

          if (!res.ok) throw new Error("Unauthorized")

          const data = await res.json()
          if (data.user_id) {
            setAuthenticated(true)
            return
          }
        } catch {
          attempts++
          await new Promise((r) => setTimeout(r, 300))
        }
      }

      router.push("/login")
    }

    checkAuth().finally(() => setLoading(false))
  }, [router])

  const logout = async () => {
    try {
      await fetch("http://127.0.0.1:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (err) {
      console.error("Logout failed:", err)
    } finally {
      router.push("/login")
    }
  }

  return { authenticated, loading, logout }
}
