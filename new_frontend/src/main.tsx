import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n/index.ts';
// import { FrappeProvider } from 'frappe-react-sdk'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <FrappeProvider url="http://localhost:8000"> */}
        <App />
    {/* </FrappeProvider> */}
  </StrictMode>,
)
