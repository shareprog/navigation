// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from "axios"

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true
axios.defaults.timeout = 6000

createRoot(document.getElementById('root')!).render(
    <App />
)
