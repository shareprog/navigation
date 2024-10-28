// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from "axios"
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import QR from './pages/QR.tsx';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true
axios.defaults.timeout = 6000

// React.render((<>
// </>), document.getElementById('root'))

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/qr",
      element: <QR />,
    },
])

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
