import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

// Barra de navegación. Los contadores de Favoritos y Registro llegan por props desde App.
// En celular el menú se oculta y se abre con un botón (menuAbierto); al elegir un enlace se cierra.
function Navbar({ totalFavoritos, totalUsuarios }) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  // Los enlaces se definen como datos y se dibujan con map; solo algunos tienen contador.
  const enlaces = [
    { ruta: '/', texto: 'Inicio' },
    { ruta: '/lista', texto: 'Lista' },
    { ruta: '/favoritos', texto: 'Favoritos', contador: totalFavoritos },
    { ruta: '/registro', texto: 'Registro', contador: totalUsuarios },
  ]

  return (
    <header className="navbar">
      <div className="navbar__contenido contenedor">
        <Link to="/" className="navbar__logo" onClick={() => setMenuAbierto(false)}>
          <span className="navbar__marca" aria-hidden="true">GA</span>
          Galería Abierta
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={menuAbierto}
          aria-controls="menu-principal"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {menuAbierto ? 'Cerrar' : 'Menú'}
        </button>

        <nav id="menu-principal" className={`navbar__menu ${menuAbierto ? 'navbar__menu--abierto' : ''}`}>
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.ruta}
              to={enlace.ruta}
              // `end` en "/" evita que Inicio aparezca activo en todas las rutas (todas empiezan con "/").
              // NavLink entrega isActive para marcar visualmente la ruta actual.
              end={enlace.ruta === '/'}
              className={({ isActive }) => `navbar__enlace ${isActive ? 'navbar__enlace--activo' : ''}`}
              onClick={() => setMenuAbierto(false)}
            >
              {enlace.texto}
              {enlace.contador !== undefined && (
                <span className="contador" aria-label={`${enlace.contador} elementos`}>
                  {enlace.contador}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
