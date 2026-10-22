import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import BotonFavorito from '../components/BotonFavorito'
import Cargando from '../components/Cargando'
import Mensaje from '../components/Mensaje'
import { obtenerObra } from '../services/artApi'

// Pantalla /detalle/:id: ficha ampliada de una obra, con botón de favoritos y de volver.
function Detalle({ esFavorito, onAlternarFavorito }) {
  // useParams lee el :id de la URL (ruta con parámetro definida en App.jsx).
  const { id } = useParams()
  // La tarjeta envía la búsqueda del listado en location.state; así "Volver al listado" regresa
  // a la misma búsqueda y página. Si se abre la URL directamente, simplemente vuelve a /lista.
  const location = useLocation()
  const rutaVolver = `/lista${location.state?.desde || ''}`

  const [obra, setObra] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [imagenFallida, setImagenFallida] = useState(false)

  // El efecto depende de [id]: si cambia el parámetro de la ruta, se vuelve a cargar la obra.
  // Funciona también al recargar la página o al abrir la URL directamente.
  useEffect(() => {
    const controlador = new AbortController()

    const cargarObra = async () => {
      // Se reinicia el estado para no mostrar por un instante los datos de la obra anterior.
      setCargando(true)
      setError(null)
      setObra(null)
      setImagenFallida(false)

      // Validación previa: un id como /detalle/abc ni siquiera se envía a la API.
      if (!/^\d+$/.test(id)) {
        setError(`«${id}» no es un identificador válido de obra.`)
        setCargando(false)
        return
      }

      try {
        const datos = await obtenerObra(id, controlador.signal)
        setObra(datos)
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(err.message || 'No se pudo cargar la obra.')
      } finally {
        if (!controlador.signal.aborted) setCargando(false)
      }
    }

    cargarObra()
    return () => controlador.abort()
  }, [id])

  // Filas de la ficha técnica. Se filtran las que no tienen valor, porque la API no trae todos
  // los datos de todas las obras y no se quieren filas vacías.
  const datos = obra
    ? [
        { etiqueta: 'Artista', valor: obra.artista },
        { etiqueta: 'Fecha', valor: obra.fecha },
        { etiqueta: 'Tipo de obra', valor: obra.tipo },
        { etiqueta: 'Técnica', valor: obra.tecnica },
        { etiqueta: 'Dimensiones', valor: obra.dimensiones },
        { etiqueta: 'Lugar de origen', valor: obra.origen },
        { etiqueta: 'Departamento', valor: obra.departamento },
        { etiqueta: 'En exhibición', valor: obra.galeria },
        { etiqueta: 'Dominio público', valor: obra.dominioPublico ? 'Sí' : 'No' },
        { etiqueta: 'Crédito', valor: obra.credito },
      ].filter((dato) => dato.valor)
    : []

  // Se guarda en favoritos solo lo necesario para dibujar una tarjeta (con la miniatura),
  // con la misma forma que los objetos del listado.
  const alternar = () =>
    onAlternarFavorito({
      id: obra.id,
      titulo: obra.titulo,
      artista: obra.artistaCorto,
      tipo: obra.tipo,
      fecha: obra.fecha,
      imagen: obra.imagenMiniatura,
    })

  return (
    <section className="contenedor pagina">
      <Link to={rutaVolver} className="volver">
        ← Volver al listado
      </Link>

      {/* Renderizado condicional según el estado: cargando, error o datos de la obra. */}
      {cargando && <Cargando texto="Cargando obra…" />}

      {!cargando && error && (
        <Mensaje tipo="error">
          {error}{' '}
          <Link to="/lista">Ir a la colección</Link>
        </Mensaje>
      )}

      {!cargando && obra && (
        <article className="detalle">
          <figure className="detalle__imagen">
            {/* Si la imagen no carga (onError) se muestra un texto en su lugar, sin romper la página. */}
            {obra.imagen && !imagenFallida ? (
              <img
                src={obra.imagen}
                alt={obra.textoAlternativo || obra.titulo}
                onError={() => setImagenFallida(true)}
              />
            ) : (
              <span className="tarjeta__sin-imagen">Imagen no disponible</span>
            )}
          </figure>

          <div className="detalle__info">
            {obra.tipo && <span className="etiqueta">{obra.tipo}</span>}
            <h1 className="detalle__titulo">{obra.titulo}</h1>

            <div className="detalle__acciones">
              <BotonFavorito activo={esFavorito(obra.id)} onClick={alternar} />
              <Link to={rutaVolver} className="boton boton--secundario">
                Volver al listado
              </Link>
            </div>

            {/* Lista de definiciones (dl) generada con map; la etiqueta sirve de key única. */}
            <dl className="ficha">
              {datos.map((dato) => (
                <div key={dato.etiqueta} className="ficha__fila">
                  <dt>{dato.etiqueta}</dt>
                  <dd>{dato.valor}</dd>
                </div>
              ))}
            </dl>

            {obra.descripcion && (
              <div className="detalle__descripcion">
                <h2>Descripción</h2>
                <p>{obra.descripcion}</p>
              </div>
            )}

            <a href={obra.enlaceMuseo} target="_blank" rel="noreferrer" className="enlace-externo">
              Ver en el sitio del museo ↗
            </a>
          </div>
        </article>
      )}
    </section>
  )
}

export default Detalle
