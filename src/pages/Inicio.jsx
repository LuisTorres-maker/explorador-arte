import { Link } from 'react-router-dom'

// Texto fijo de la presentación (no son datos de la API): se mantiene como lista para
// generar las tarjetas con map en vez de repetir el mismo bloque cuatro veces.
const CARACTERISTICAS = [
  { titulo: 'Busca y filtra', texto: 'Encuentra obras por texto y fíltralas por tipo: pintura, escultura, fotografía y más.' },
  { titulo: 'Mira los detalles', texto: 'Abre cada obra para ver su imagen, artista, técnica, dimensiones y descripción.' },
  { titulo: 'Guarda favoritos', texto: 'Marca con la estrella las obras que te gusten; se guardan en tu navegador.' },
  { titulo: 'Registra usuarios', texto: 'Gestiona una lista de usuarios con validación de identificación única.' },
]

function Inicio() {
  return (
    <>
      <section className="hero">
        <div className="contenedor hero__contenido">
          <p className="hero__antetitulo">Art Institute of Chicago · Colección abierta</p>
          <h1 className="hero__titulo">Recorre un museo entero desde tu pantalla</h1>
          <p className="hero__texto">
            Galería Abierta es una aplicación hecha con React para explorar la colección del Art
            Institute of Chicago. Usa su API pública y gratuita, que ofrece datos de más de cien mil
            obras, desde pintura impresionista hasta arte antiguo e imágenes servidas mediante el
            estándar IIIF.
          </p>
          <Link to="/lista" className="boton boton--primario boton--grande">
            Explorar la colección
          </Link>
        </div>
      </section>

      <section className="contenedor caracteristicas">
        {CARACTERISTICAS.map((item) => (
          <article key={item.titulo} className="caracteristica">
            <h2>{item.titulo}</h2>
            <p>{item.texto}</p>
          </article>
        ))}
      </section>
    </>
  )
}

export default Inicio
