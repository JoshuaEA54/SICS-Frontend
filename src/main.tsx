import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { router } from './router'
import { ToastContainer } from './components/ui/ToastContainer'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}>
      <RouterProvider router={router} />
      <ToastContainer />
    </GoogleOAuthProvider>
  </StrictMode>,
)
