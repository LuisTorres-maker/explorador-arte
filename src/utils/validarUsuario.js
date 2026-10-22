// Valida los datos del formulario de usuarios. Devuelve el mensaje del primer error encontrado
// o null si todo está bien. La regla de "identificación repetida" no está aquí porque necesita
// la lista de usuarios; la comprueba el hook useUsuarios.
export function validarUsuario({ identificacion, nombre, correo }) {
  if (!identificacion || !nombre || !correo) {
    return 'Todos los campos son obligatorios: identificación, nombre y correo.'
  }
  // Expresión regular: ^ inicio, \d+ uno o más dígitos, $ fin. Rechaza letras, espacios y signos.
  if (!/^\d+$/.test(identificacion)) {
    return 'La identificación debe contener solo números.'
  }
  if (!correo.includes('@')) {
    return 'El correo debe incluir el símbolo «@».'
  }
  return null
}
