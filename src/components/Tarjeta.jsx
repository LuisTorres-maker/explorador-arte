import { useState } from 'react'
import { Link } from 'react-router-dom'
import BotonFavorito from './BotonFavorito'

// Tarjeta de una obra, usada en el listado y en Favoritos. Al hacer clic lleva al detalle y,
// mediante `state`, le envía la búsqueda actual para que el botón "Volver" la recupere.
function Tarjeta({ obra, esFavorito, onAlternarFavorito, busquedaActual = '' }) {
  // Si la imagen no carga se muestra un texto en su lugar en vez de un icono roto.
  const [imagenFallida, setImagenFallida] = useState(false)
  const mostrarImagen = obra.imagen && !imagenFallida

  return (
    <article className="tarjeta">
      <Link
        to={`/detalle/${obra.id}`}
        state={{ desde: busquedaActual }}
        className="tarjeta__enlace"
      >
        <div className="tarjeta__marco">
          {mostrarImagen ? (
            <img
              src={obra.imagen}
              alt={obra.titulo}
              // lazy: el navegador descarga la imagen solo cuando está por aparecer en pantalla.
              loading="lazy"
              onError={() => setImagenFallida(true)}
            />
          ) : (
            <span className="tarjeta__sin-imagen">Imagen no disponible</span>
          )}
        </div>
        <div className="tarjeta__cuerpo">
          {obra.tipo && <span className="etiqueta">{obra.tipo}</span>}
          <h3 className="tarjeta__titulo">{obra.titulo}</h3>
          <p className="tarjeta__artista">{obra.artista}</p>
          {obra.fecha && <p className="tarjeta__fecha">{obra.fecha}</p>}
        </div>
      </Link>
      <div className="tarjeta__acciones">
        <BotonFavorito activo={esFavorito} onClick={() => onAlternarFavorito(obra)} compacto />
      </div>
    </article>
  )
}

export default Tarjeta
