import { useAuth0 } from "@auth0/auth0-react"
import { Outlet } from "react-router-dom"

interface AuthenticationProps{
  requireAuth: boolean, // does page require auth
  redirectPath?: string // redirect if authenticated but auth not required or not authenticated but auth is require. Don't redirect if redirectPath is null
}

export default function AuthenticationPage({requireAuth, redirectPath}: AuthenticationProps){
  const auth0 = useAuth0()

  if (auth0.isLoading)
    return 'Loading...'

  const shouldRedirect = redirectPath && ((requireAuth && !auth0.isAuthenticated) || (!requireAuth && auth0.isAuthenticated))
  if (shouldRedirect){
    window.location.href = redirectPath
    return 'Redirecting...'
  }


  return (
    <Outlet/>
  )
}