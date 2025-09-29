import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      router.push("/login")
    } else {
      setToken(storedToken)
    }
    setLoading(false)
  }, [router])

  const logout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return { token, loading, logout }
}
