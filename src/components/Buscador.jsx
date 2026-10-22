import { useState } from 'react'

// Formulario de búsqueda por texto. Mantiene lo que el usuario escribe en su propio estado y
// solo avisa al padre (onBuscar) al enviar, no en cada tecla, para no saturar la API.
function Buscador({ valorInicial, onBuscar }) {
  const [texto, setTexto] = useState(valorInicial)

  const manejarEnvio = (evento) => {
    // Evita que el navegador recargue la página al enviar el formulario.
    evento.preventDefault()
    onBuscar(texto.trim())
  }

  // El botón "Limpiar" solo aparece si hay una búsqueda activa (valorInicial no vacío).
  const limpiar = () => {
    setTexto('')
    onBuscar('')
  }

  return (
    <form className="buscador" onSubmit={manejarEnvio} role="search">
      <label htmlFor="buscador-obras" className="campo__etiqueta">
        Buscar obras
      </label>
      <div className="buscador__fila">
        <input
          id="buscador-obras"
          type="search"
          className="campo__input"
          placeholder="Ej: Monet, gatos, paisaje…"
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
        />
        <button type="submit" className="boton boton--primario">
          Buscar
        </button>
        {valorInicial && (
          <button type="button" className="boton boton--secundario" onClick={limpiar}>
            Limpiar
          </button>
        )}
      </div>
    </form>
  )
}

export default Buscador
