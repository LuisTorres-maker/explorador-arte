import { useState } from 'react'

// Hook con el estado y las operaciones (CRUD) de los usuarios registrados.
// Los usuarios solo viven en memoria: se pierden al recargar la página (lo pide el enunciado).
// Cada usuario es un objeto { identificacion, nombre, correo }; la identificación es la clave única.
export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([])

  // Indica si ya hay un usuario con esa identificación. Al editar se pasa la identificación
  // original del usuario (identificacionPropia) para que pueda conservar la suya sin que se
  // cuente como repetida; con cualquier otra identificación existente sí hay conflicto.
  const existeIdentificacion = (identificacion, identificacionPropia = null) =>
    usuarios.some(
      (usuario) =>
        usuario.identificacion === identificacion &&
        usuario.identificacion !== identificacionPropia,
    )

  // Crear: se agrega al final de la lista (sin mutar el arreglo, React necesita uno nuevo).
  const agregarUsuario = (nuevoUsuario) => {
    setUsuarios((actuales) => [...actuales, nuevoUsuario])
  }

  // Editar: map reemplaza solo al usuario original y deja a los demás igual, así conserva
  // su posición en la lista aunque se haya cambiado su identificación.
  const actualizarUsuario = (identificacionOriginal, datosNuevos) => {
    setUsuarios((actuales) =>
      actuales.map((usuario) =>
        usuario.identificacion === identificacionOriginal ? datosNuevos : usuario,
      ),
    )
  }

  // Eliminar: filter deja pasar a todos menos al de esa identificación.
  const eliminarUsuario = (identificacion) => {
    setUsuarios((actuales) =>
      actuales.filter((usuario) => usuario.identificacion !== identificacion),
    )
  }

  return {
    usuarios,
    existeIdentificacion,
    agregarUsuario,
    actualizarUsuario,
    eliminarUsuario,
  }
}
