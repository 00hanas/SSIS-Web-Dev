"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "@/lib/login-api"
import { SignUpDialog } from "@/components/signup-form"

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showSignUp, setShowSignUp] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      return
    }
    try {
      await loginUser(email, password)
      router.push("/dashboard")
    } catch (err: any) {
      if (err.status === 404) {
        setError("This email is not registered.")
      } else if (err.status === 401) {
        setError("Incorrect password. Please try again.")
      } else {
        setError(err.message || "Something went wrong. Please try again.")
      }
    }
  }

  return (
    <div className={cn("w-full max-w-3xl flex flex-col gap-6 mx-auto", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome!</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your SSIS account
                </p>
              </div>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. juhanara.saluta@g.msuiit.edu.ph"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <button
                type="button"
                onClick={() => setShowSignUp(true)}
                className="underline underline-offset-4 text-blue-600 hover:text-blue-800"
              >
                Sign up
              </button>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/login-photo.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
            />
          </div>
        </CardContent>
      </Card>
      <SignUpDialog
        open={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSignedUp={() => {
          setShowSignUp(false)
        }}
      />
    </div>
  )
}
