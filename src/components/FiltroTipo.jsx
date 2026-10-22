// Lista desplegable para filtrar por tipo de obra. Es un componente controlado: el valor
// seleccionado lo decide el padre (viene de la URL) y aquí solo se avisa del cambio.
// La opción con valor "" significa "sin filtro".
function FiltroTipo({ tipos, valor, onCambiar, deshabilitado }) {
  return (
    <div className="filtro">
      <label htmlFor="filtro-tipo" className="campo__etiqueta">
        Tipo de obra
      </label>
      <select
        id="filtro-tipo"
        className="campo__input"
        value={valor}
        onChange={(evento) => onCambiar(evento.target.value)}
        disabled={deshabilitado}
      >
        <option value="">Todos los tipos</option>
        {tipos.map((tipo) => (
          <option key={tipo.id} value={tipo.id}>
            {tipo.nombre}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FiltroTipo
