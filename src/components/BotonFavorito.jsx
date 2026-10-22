// Botón de estrella para agregar/quitar favoritos. No guarda nada por sí mismo: recibe si está
// activo y avisa con onClick. `compacto` muestra solo la estrella (para las tarjetas).
// aria-pressed y aria-label permiten a los lectores de pantalla saber su estado y su función.
function BotonFavorito({ activo, onClick, compacto = false }) {
  const texto = activo ? 'Quitar de favoritos' : 'Agregar a favoritos'

  return (
    <button
      type="button"
      className={`boton-favorito ${activo ? 'boton-favorito--activo' : ''} ${compacto ? 'boton-favorito--compacto' : ''}`}
      onClick={onClick}
      aria-pressed={activo}
      aria-label={texto}
      title={texto}
    >
      <span aria-hidden="true">{activo ? '★' : '☆'}</span>
      {!compacto && <span>{texto}</span>}
    </button>
  )
}

export default BotonFavorito
