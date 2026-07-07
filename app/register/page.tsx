'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"



function Register() {
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [confirmPassword , setConfirmPassword] = useState("")
    const [error , setError] = useState('')

    const router = useRouter()

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
        setError('Password does not match')
        return
    }
    setError('')
    try {
    const res = await fetch('/api/auth/register', {
        method : 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({email , password})
    })

   
   const data = await res.json();

if (!res.ok) {
    setError(data.error || "Registration Failed");
    return; // Stop here if there was an error
}

router.push("/login");
} catch (error) {
    setError('Unexpected Error Occured')
}
};
  return (
<div className="min-h-screen flex items-center justify-center bg-base-200">
    <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
      <div className="card-body">
        <h1 className="text-4xl font-bold text-center">
          Create an Account
        </h1>

        <p className="text-center text-base-content/70 mb-6">
          Register to get started
        </p>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="input input-bordered w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
          >
            Register
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <a href="/login" className="link link-primary">
              Login
            </a>
          </p>

        </form>
      </div>
    </div>
  </div>
)
}

export default Register
