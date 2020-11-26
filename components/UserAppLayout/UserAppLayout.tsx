import AppLayout from "components/AppLayout/AppLayout"
import { FirebaseContext } from "context/FirebaseContext"
import { useRouter } from "next/router"
import React, { useContext, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"

interface UserAppLayoutProps {}

const UserAppLayout: React.FC<UserAppLayoutProps> = ({ children }) => {
  const { auth } = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push("/login")
    return () => {}
  }, [user])

  return <AppLayout>{children}</AppLayout>
}

export default UserAppLayout
