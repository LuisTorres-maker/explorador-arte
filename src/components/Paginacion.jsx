// Controles Anterior / Siguiente. No cambia la página por sí mismo: avisa con onCambiar el número
// al que se quiere ir. Los botones se deshabilitan en los extremos y no se muestra nada si hay
// una sola página.
function Paginacion({ pagina, totalPaginas, onCambiar }) {
  if (totalPaginas <= 1) return null

  return (
    <nav className="paginacion" aria-label="Paginación de resultados">
      <button
        type="button"
        className="boton boton--secundario"
        onClick={() => onCambiar(pagina - 1)}
        disabled={pagina <= 1}
      >
        ← Anterior
      </button>
      <span className="paginacion__estado">
        Página {pagina} de {totalPaginas}
      </span>
      <button
        type="button"
        className="boton boton--secundario"
        onClick={() => onCambiar(pagina + 1)}
        disabled={pagina >= totalPaginas}
      >
        Siguiente →
      </button>
    </nav>
  )
}

export default Paginacion
