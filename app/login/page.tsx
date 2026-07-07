"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "../components/Notification"
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
     showNotification(result.error, "error");
    } else {
      showNotification("Login successful!", "success");
      router.push("/");
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-base-200">
    <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
      <div className="card-body">
        <h1 className="text-4xl font-bold text-center">
          Welcome Back
        </h1>

        <p className="text-center text-base-content/70 mb-6">
          Login to continue
        </p>

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
              required
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
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Login
          </button>

          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="link link-primary"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  </div>
  );
}