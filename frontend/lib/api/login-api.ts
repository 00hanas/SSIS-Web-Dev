export async function loginUser(email: string, password: string) {
  const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    const error = new Error(data.error || "Login failed")
    // @ts-expect-error: augmenting Error with a custom status property
    error.status = res.status
    throw error
  }

  return data
}

export async function signupUser(
  email: string,
  password: string,
  username: string
) {
  const res = await fetch("http://127.0.0.1:5000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  })

  const data = await res.json()

  if (!res.ok) {
    const error = new Error(data.error || "Signup failed")
    // @ts-expect-error: augmenting Error with a custom status property
    error.status = res.status
    throw error
  }

  return data
}
