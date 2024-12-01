import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'

import router from './router.tsx'
import { Auth0Provider } from '@auth0/auth0-react'

const queryClient = new QueryClient()

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('app') as HTMLElement).render(
    <Auth0Provider
      domain='https://roa-2024-katuta.au.auth0.com'
      clientId='OmPBttVCXaD67CpeMM9qb4PS4pPU3xLf'
      cacheLocation='localstorage'
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'performance-logger-api'
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Auth0Provider>
  )
})
