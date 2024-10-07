'use client'
import { Button } from "@/components/ui/button"
import { useAuthActions } from "@convex-dev/auth/react"
import { useRouter } from 'next/navigation'

const TestPage = () => {
  const { signOut } = useAuthActions()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.replace('/auth')
  }

  return (
    <div>TestPage
      <Button type="button" onClick={handleSignOut}>Log out</Button>
    </div>
  )
}

export default TestPage