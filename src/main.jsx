import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Punto de entrada: monta la aplicación en el <div id="root"> de index.html.
// StrictMode ejecuta dos veces los efectos en desarrollo para detectar errores
// (por eso en dev se ven peticiones duplicadas a la API; en producción no ocurre).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter habilita las rutas y la lectura de la URL en toda la aplicación */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
