import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n/index.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { FrappeProvider } from 'frappe-react-sdk'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <FrappeProvider url="http://localhost:8000"> */}
        <App />
      {/* </FrappeProvider> */}
    </QueryClientProvider>
  </StrictMode>,
)
