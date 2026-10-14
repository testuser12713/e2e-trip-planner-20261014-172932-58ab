import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { TripProvider } from './state/TripContext'
import './styles/index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root is missing from index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <TripProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TripProvider>
  </StrictMode>,
)
