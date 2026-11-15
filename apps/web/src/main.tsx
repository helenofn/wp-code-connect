import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonte Prompt servida pelo próprio app (sem CSS bloqueante de terceiros).
// Só os pesos usados: 400 (padrão), 500 (font-medium) e 600 (font-semibold).
import '@fontsource/prompt/400.css'
import '@fontsource/prompt/500.css'
import '@fontsource/prompt/600.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
