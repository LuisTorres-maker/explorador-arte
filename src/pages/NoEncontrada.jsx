import { Link, useLocation } from 'react-router-dom'

// Página 404: se muestra para cualquier ruta que no exista (ruta "*" en App.jsx).
function NoEncontrada() {
  // useLocation da la ruta que el usuario intentó abrir, para mostrarla en el mensaje.
  const { pathname } = useLocation()

  return (
    <section className="contenedor pagina no-encontrada">
      <p className="no-encontrada__codigo">404</p>
      <h1>Esta sala no existe</h1>
      <p>
        La ruta <code>{pathname}</code> no corresponde a ninguna página de la aplicación.
      </p>
      <Link to="/" className="boton boton--primario">
        Volver al inicio
      </Link>
    </section>
  )
}

export default NoEncontrada
