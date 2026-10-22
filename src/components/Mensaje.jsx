const TITULOS = {
  exito: 'Listo',
  error: 'Error',
  info: 'Aviso',
}

// Mensaje en pantalla reutilizable para éxito, error o información (en vez de alert).
// `children` es el texto y `accion` un botón opcional (por ejemplo "Reintentar").
// Los errores usan role="alert" para que los lectores de pantalla los anuncien de inmediato.
function Mensaje({ tipo = 'info', children, accion }) {
  return (
    <div className={`mensaje mensaje--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <div>
        <strong className="mensaje__titulo">{TITULOS[tipo]}</strong>
        <div className="mensaje__texto">{children}</div>
      </div>
      {accion}
    </div>
  )
}

export default Mensaje
