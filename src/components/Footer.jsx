// Pie de página: integrantes del grupo, API utilizada y enlace a su documentación.
const INTEGRANTES = ['Luis Angel Torres Jimenez']

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__contenido contenedor">
        <div>
          <h2 className="footer__titulo">Integrantes</h2>
          <ul className="footer__lista">
            {INTEGRANTES.map((nombre) => (
              <li key={nombre}>{nombre}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer__titulo">API utilizada</h2>
          <p>Art Institute of Chicago API</p>
          <a href="https://api.artic.edu/docs/" target="_blank" rel="noreferrer">
            Ver documentación de la API
          </a>
        </div>
        <p className="footer__nota">
          Tecnologías Web · Unidad 2. Datos e imágenes cortesía del Art Institute of Chicago.
        </p>
      </div>
    </footer>
  )
}

export default Footer
