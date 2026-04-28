import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@fontsource/caveat'
import '@fontsource/patrick-hand'
import '@fontsource/indie-flower'
import '@fontsource/shadows-into-light'
import '@fontsource/kalam'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
