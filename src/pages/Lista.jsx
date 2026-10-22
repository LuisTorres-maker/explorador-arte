import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Buscador from '../components/Buscador'
import FiltroTipo from '../components/FiltroTipo'
import Tarjeta from '../components/Tarjeta'
import Paginacion from '../components/Paginacion'
import Cargando from '../components/Cargando'
import Mensaje from '../components/Mensaje'
import { buscarObras, obtenerTiposDeObra } from '../services/artApi'

// Pantalla /lista: tarjetas de obras con buscador por texto, filtro por tipo y paginación.
function Lista({ esFavorito, onAlternarFavorito }) {
  // La búsqueda, el tipo y la página viven en la URL (?q=monet&tipo=1&pagina=2) y no en useState.
  // Así el botón "atrás" funciona, se puede compartir el enlace y, al volver desde el detalle,
  // el listado reaparece con la misma búsqueda y página. Math.max evita páginas menores a 1.
  const [parametros, setParametros] = useSearchParams()
  const texto = parametros.get('q') || ''
  const tipo = parametros.get('tipo') || ''
  const pagina = Math.max(1, Number(parametros.get('pagina')) || 1)

  // Estado de la petición de obras: datos, cargando y error (los tres estados que pide el enunciado).
  const [obras, setObras] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  // Contador que se incrementa con el botón "Reintentar" para volver a ejecutar el efecto.
  const [intento, setIntento] = useState(0)

  const [tipos, setTipos] = useState([])
  const [errorTipos, setErrorTipos] = useState(false)

  // Efecto 1: carga las opciones del filtro una sola vez (arreglo de dependencias vacío).
  // Si falla, solo se deshabilita el filtro: el buscador y el listado siguen funcionando.
  useEffect(() => {
    // AbortController: cancela la petición si el componente se desmonta antes de que responda.
    const controlador = new AbortController()

    const cargarTipos = async () => {
      try {
        const datos = await obtenerTiposDeObra(controlador.signal)
        setTipos(datos)
      } catch (err) {
        if (err.name !== 'AbortError') setErrorTipos(true)
      }
    }

    cargarTipos()
    return () => controlador.abort()
  }, [])

  // Efecto 2: pide las obras a la API. Sus dependencias son la búsqueda, el tipo y la página,
  // así que se vuelve a ejecutar automáticamente cada vez que cualquiera de ellas cambia.
  useEffect(() => {
    const controlador = new AbortController()

    const cargarObras = async () => {
      setCargando(true)
      setError(null)
      try {
        const resultado = await buscarObras({ texto, tipo, pagina }, controlador.signal)
        setObras(resultado.obras)
        setTotal(resultado.total)
        setTotalPaginas(resultado.totalPaginas)
      } catch (err) {
        // Una petición cancelada (porque cambió la búsqueda) no es un error que mostrar.
        if (err.name === 'AbortError') return
        setError(err.message || 'No se pudieron cargar las obras.')
      } finally {
        // Si esta petición fue cancelada, la nueva ya puso "cargando"; no se debe apagar.
        if (!controlador.signal.aborted) setCargando(false)
      }
    }

    cargarObras()
    // Función de limpieza: cancela la petición anterior si llega una búsqueda nueva. Evita que
    // una respuesta lenta y vieja sobrescriba los resultados de la búsqueda más reciente.
    return () => controlador.abort()
  }, [texto, tipo, pagina, intento])

  // Cambia uno o varios parámetros de la URL conservando los demás. Un valor vacío elimina el
  // parámetro para que la URL quede limpia (por ejemplo, sin "?pagina=" en la página 1).
  const actualizarParametros = (cambios) => {
    const nuevos = new URLSearchParams(parametros)
    Object.entries(cambios).forEach(([clave, valor]) => {
      if (valor) nuevos.set(clave, valor)
      else nuevos.delete(clave)
    })
    setParametros(nuevos)
  }

  const cambiarPagina = (nuevaPagina) => {
    actualizarParametros({ pagina: nuevaPagina > 1 ? String(nuevaPagina) : '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Nombre legible del tipo elegido, para los mensajes ("No hay resultados en el tipo «Pintura»").
  const nombreTipo = tipos.find((t) => String(t.id) === tipo)?.nombre

  return (
    <section className="contenedor pagina">
      <header className="pagina__encabezado">
        <h1>Colección</h1>
        <p>Explora obras con imagen del Art Institute of Chicago. Busca por texto y filtra por tipo.</p>
      </header>

      <div className="controles">
        {/* El buscador solo consulta al enviar el formulario (no en cada tecla) porque la API
            limita las peticiones por minuto. Al buscar o filtrar se vuelve a la página 1.
            `key={texto}` reinicia el campo cuando el texto cambia desde fuera (atrás/adelante). */}
        <Buscador
          key={texto}
          valorInicial={texto}
          onBuscar={(nuevoTexto) => actualizarParametros({ q: nuevoTexto, pagina: '' })}
        />
        <FiltroTipo
          tipos={tipos}
          valor={tipo}
          deshabilitado={errorTipos}
          onCambiar={(nuevoTipo) => actualizarParametros({ tipo: nuevoTipo, pagina: '' })}
        />
      </div>
      {errorTipos && (
        <p className="nota">No se pudieron cargar los tipos de obra; la búsqueda sigue funcionando.</p>
      )}

      {/* Renderizado condicional: solo uno de estos bloques se muestra a la vez.
          cargando → error (con botón Reintentar) → sin resultados → listado con datos. */}
      {cargando && <Cargando texto="Cargando obras…" />}

      {!cargando && error && (
        <Mensaje
          tipo="error"
          accion={
            <button type="button" className="boton boton--secundario" onClick={() => setIntento(intento + 1)}>
              Reintentar
            </button>
          }
        >
          {error}
        </Mensaje>
      )}

      {!cargando && !error && obras.length === 0 && (
        <Mensaje tipo="info">
          No hay resultados
          {texto && <> para «{texto}»</>}
          {nombreTipo && <> en el tipo «{nombreTipo}»</>}. Prueba con otra búsqueda o quita el filtro.
        </Mensaje>
      )}

      {!cargando && !error && obras.length > 0 && (
        <>
          <p className="resultados">
            {total.toLocaleString('es-CO')} obras encontradas
            {texto && <> para «{texto}»</>}
            {nombreTipo && <> · {nombreTipo}</>}
          </p>
          <div className="cuadricula">
            {/* key única = id de la obra, para que React identifique cada tarjeta al re-renderizar.
                busquedaActual se envía al detalle para que "Volver" regrese a esta misma búsqueda. */}
            {obras.map((obra) => (
              <Tarjeta
                key={obra.id}
                obra={obra}
                esFavorito={esFavorito(obra.id)}
                onAlternarFavorito={onAlternarFavorito}
                busquedaActual={parametros.toString() ? `?${parametros}` : ''}
              />
            ))}
          </div>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={cambiarPagina} />
        </>
      )}
    </section>
  )
}

export default Lista
