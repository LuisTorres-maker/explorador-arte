import { Link } from 'react-router-dom'
import Tarjeta from '../components/Tarjeta'
import Mensaje from '../components/Mensaje'

// Pantalla /favoritos: muestra las obras guardadas (que persisten en localStorage, ver useFavoritos).
// Reutiliza el componente Tarjeta; aquí la estrella siempre está activa y al pulsarla se quita la obra.
function Favoritos({ favoritos, onQuitarFavorito }) {
  return (
    <section className="contenedor pagina">
      <header className="pagina__encabezado">
        <h1>Mis favoritos</h1>
        <p>
          Las obras que guardes aquí se conservan en este navegador aunque cierres la página.
          {favoritos.length > 0 && <> Tienes {favoritos.length} guardada{favoritos.length === 1 ? '' : 's'}.</>}
        </p>
      </header>

      {favoritos.length === 0 ? (
        <Mensaje tipo="info">
          Aún no tienes obras favoritas. <Link to="/lista">Explora la colección</Link> y marca las que te
          gusten con la estrella.
        </Mensaje>
      ) : (
        <div className="cuadricula">
          {favoritos.map((obra) => (
            <Tarjeta
              key={obra.id}
              obra={obra}
              esFavorito
              onAlternarFavorito={() => onQuitarFavorito(obra.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Favoritos
