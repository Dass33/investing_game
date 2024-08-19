import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { getJsObjects } from './fetchJson.ts'
import App from './App.tsx'
import './index.css'

getJsObjects();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
