import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { TimeProvider } from './context/TimeContext.tsx'
import './index.css'
import { Analytics } from '@vercel/analytics/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TimeProvider>
      <App />
      <Analytics />
    </TimeProvider>
  </StrictMode>,
)
