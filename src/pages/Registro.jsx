import { useState } from 'react'
import FormularioUsuario from '../components/FormularioUsuario'
import ListaUsuarios from '../components/ListaUsuarios'
import Mensaje from '../components/Mensaje'
import { validarUsuario } from '../utils/validarUsuario'

const FORMULARIO_VACIO = { identificacion: '', nombre: '', correo: '' }

// Pantalla /registro: CRUD de usuarios. Esta página coordina el formulario y la lista, pero la
// lista de usuarios (y sus operaciones) llega por props desde App, para que no se pierda al
// cambiar de ruta. Aquí solo vive el estado propio de la pantalla: el formulario y el mensaje.
function Registro({ usuarios, existeIdentificacion, onAgregar, onActualizar, onEliminar }) {
  // Formulario controlado: el estado es la única fuente de verdad de lo que muestran los inputs.
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO)
  // Identificación del usuario que se está editando (null = modo registro). Se guarda la
  // original porque el usuario puede cambiar su identificación durante la edición.
  const [identificacionEditando, setIdentificacionEditando] = useState(null)
  // Mensaje en pantalla para confirmaciones y errores de validación (no se usa alert).
  const [mensaje, setMensaje] = useState(null)

  const editando = identificacionEditando !== null

  // Deja el formulario limpio y vuelve al modo "Registrar".
  const reiniciarFormulario = () => {
    setFormulario(FORMULARIO_VACIO)
    setIdentificacionEditando(null)
  }

  // Un solo manejador para los tres campos: el nombre del input (name) indica cuál actualizar.
  const cambiarCampo = (campo, valor) => {
    setFormulario({ ...formulario, [campo]: valor })
  }

  // Se ejecuta al enviar el formulario, tanto al registrar como al guardar cambios.
  // Orden de las comprobaciones: 1) campos válidos, 2) identificación no repetida, 3) guardar.
  const guardar = () => {
    // trim() quita espacios al inicio y al final para que "  123 " se trate como "123".
    const usuario = {
      identificacion: formulario.identificacion.trim(),
      nombre: formulario.nombre.trim(),
      correo: formulario.correo.trim(),
    }

    const errorValidacion = validarUsuario(usuario)
    if (errorValidacion) {
      setMensaje({ tipo: 'error', texto: errorValidacion })
      return
    }

    // Al editar se pasa la identificación original para que el usuario pueda conservar la suya,
    // pero no tomar la de otro usuario. En modo registro vale null: cualquier coincidencia es error.
    if (existeIdentificacion(usuario.identificacion, identificacionEditando)) {
      setMensaje({
        tipo: 'error',
        texto: `Ya existe un usuario con la identificación ${usuario.identificacion}.`,
      })
      return
    }

    if (editando) {
      onActualizar(identificacionEditando, usuario)
      setMensaje({ tipo: 'exito', texto: `Se guardaron los cambios de ${usuario.nombre}.` })
    } else {
      onAgregar(usuario)
      setMensaje({ tipo: 'exito', texto: `${usuario.nombre} quedó registrado correctamente.` })
    }
    reiniciarFormulario()
  }

  // Editar: carga los datos del usuario en el formulario y activa el modo edición.
  const empezarEdicion = (usuario) => {
    setFormulario(usuario)
    setIdentificacionEditando(usuario.identificacion)
    setMensaje({ tipo: 'info', texto: `Editando a ${usuario.nombre}. Cambia los datos y guarda.` })
  }

  const cancelarEdicion = () => {
    reiniciarFormulario()
    setMensaje({ tipo: 'info', texto: 'Edición cancelada.' })
  }

  // Eliminar: pide confirmación al usuario y, si acepta, quita el usuario de la lista.
  const eliminar = (usuario) => {
    const confirmado = window.confirm(
      `¿Seguro que quieres eliminar a ${usuario.nombre} (ID ${usuario.identificacion})?`,
    )
    if (!confirmado) return

    onEliminar(usuario.identificacion)
    // Si justo se estaba editando a este usuario, se cancela la edición: ya no existe.
    if (usuario.identificacion === identificacionEditando) {
      reiniciarFormulario()
    }
    setMensaje({ tipo: 'exito', texto: `${usuario.nombre} fue eliminado.` })
  }

  return (
    <section className="contenedor pagina">
      <header className="pagina__encabezado">
        <h1>Registro de usuarios</h1>
        <p>Registra, edita y elimina usuarios. La identificación no se puede repetir.</p>
      </header>

      {/* El tipo del mensaje (exito, error o info) define su color; solo se muestra si hay uno. */}
      {mensaje && <Mensaje tipo={mensaje.tipo}>{mensaje.texto}</Mensaje>}

      <div className="registro">
        <FormularioUsuario
          valores={formulario}
          editando={editando}
          onCambiar={cambiarCampo}
          onEnviar={guardar}
          onCancelar={cancelarEdicion}
        />
        <ListaUsuarios
          usuarios={usuarios}
          identificacionEditando={identificacionEditando}
          onEditar={empezarEdicion}
          onEliminar={eliminar}
        />
      </div>
    </section>
  )
}

export default Registro
