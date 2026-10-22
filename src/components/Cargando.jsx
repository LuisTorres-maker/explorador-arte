// Indicador de carga reutilizable. role="status" y aria-live="polite" hacen que los lectores de
// pantalla anuncien el texto sin interrumpir; el spinner es decorativo (aria-hidden).
function Cargando({ texto = 'Cargando…' }) {
  return (
    <div className="cargando" role="status" aria-live="polite">
      <span className="cargando__spinner" aria-hidden="true" />
      <p>{texto}</p>
    </div>
  )
}

export default Cargando
