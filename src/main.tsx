import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { getJsObjects } from './fetchJson.ts'
import App from './App.tsx'
import './index.css'
import { GameProvider } from './GameContext.tsx'

getJsObjects();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GameProvider>
            <App />
        </GameProvider>
    </StrictMode>,
)
