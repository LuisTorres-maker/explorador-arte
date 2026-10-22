// Formulario controlado de usuario (identificación, nombre y correo). No guarda ni valida nada:
// muestra los `valores` que recibe y avisa al padre (Registro) de cada cambio y del envío.
// `editando` cambia el título y el texto del botón (Registrar / Guardar cambios) y muestra Cancelar.
function FormularioUsuario({ valores, editando, onCambiar, onEnviar, onCancelar }) {
  // Un solo manejador para los tres inputs: se identifican por su atributo name.
  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    onCambiar(name, value)
  }

  const manejarEnvio = (evento) => {
    evento.preventDefault()
    onEnviar()
  }

  return (
    // noValidate desactiva los avisos nativos del navegador: las validaciones las hace la app
    // y se muestran como mensajes en pantalla, con el mismo estilo que el resto.
    <form className="formulario panel" onSubmit={manejarEnvio} noValidate>
      <h2 className="panel__titulo">{editando ? 'Editar usuario' : 'Nuevo usuario'}</h2>

      <div className="campo">
        <label htmlFor="identificacion" className="campo__etiqueta">
          Identificación
        </label>
        <input
          id="identificacion"
          name="identificacion"
          className="campo__input"
          inputMode="numeric"
          placeholder="Ej: 1234567890"
          value={valores.identificacion}
          onChange={manejarCambio}
        />
      </div>

      <div className="campo">
        <label htmlFor="nombre" className="campo__etiqueta">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          className="campo__input"
          placeholder="Ej: Ana Pérez"
          value={valores.nombre}
          onChange={manejarCambio}
        />
      </div>

      <div className="campo">
        <label htmlFor="correo" className="campo__etiqueta">
          Correo
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          className="campo__input"
          placeholder="Ej: ana@correo.com"
          value={valores.correo}
          onChange={manejarCambio}
        />
      </div>

      <div className="formulario__botones">
        <button type="submit" className="boton boton--primario">
          {editando ? 'Guardar cambios' : 'Registrar'}
        </button>
        {editando && (
          <button type="button" className="boton boton--secundario" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default FormularioUsuario
