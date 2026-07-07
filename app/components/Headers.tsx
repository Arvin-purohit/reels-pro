'use client'
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

function Headers() {
    const {data : session} = useSession()
    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            
        }
    }
  return (
    <div>
      <button onClick={handleSignOut}>Signout</button>
      {session ? (
        <div>Welcome</div>
      ) : (
        <div>
            <Link href='/login'>Login</Link>
            <Link href='/register'>Register</Link>
        </div>
      )}
    </div>
  )
}

export default Headers
