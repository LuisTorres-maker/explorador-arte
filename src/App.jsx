import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'
import Lista from './pages/Lista'
import Detalle from './pages/Detalle'
import Favoritos from './pages/Favoritos'
import Registro from './pages/Registro'
import NoEncontrada from './pages/NoEncontrada'
import { useFavoritos } from './hooks/useFavoritos'
import { useUsuarios } from './hooks/useUsuarios'

function App() {
  // El estado de favoritos y de usuarios vive aquí, en el componente superior, y no dentro de
  // cada página. Así no se pierde al cambiar de ruta (las páginas se desmontan al navegar) y el
  // Navbar puede mostrar los contadores sin duplicar datos.
  const { favoritos, esFavorito, alternarFavorito, quitarFavorito } = useFavoritos()
  const { usuarios, existeIdentificacion, agregarUsuario, actualizarUsuario, eliminarUsuario } =
    useUsuarios()

  return (
    <div className="app">
      <Navbar totalFavoritos={favoritos.length} totalUsuarios={usuarios.length} />

      <main className="app__contenido">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route
            path="/lista"
            element={<Lista esFavorito={esFavorito} onAlternarFavorito={alternarFavorito} />}
          />
          {/* Ruta con parámetro: Detalle lee :id con useParams */}
          <Route
            path="/detalle/:id"
            element={<Detalle esFavorito={esFavorito} onAlternarFavorito={alternarFavorito} />}
          />
          <Route
            path="/favoritos"
            element={<Favoritos favoritos={favoritos} onQuitarFavorito={quitarFavorito} />}
          />
          <Route
            path="/registro"
            element={
              <Registro
                usuarios={usuarios}
                existeIdentificacion={existeIdentificacion}
                onAgregar={agregarUsuario}
                onActualizar={actualizarUsuario}
                onEliminar={eliminarUsuario}
              />
            }
          />
          {/* "*" captura cualquier ruta que no coincida con las anteriores: página 404 */}
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
