// Lista de usuarios registrados con sus botones Editar y Eliminar. Solo dibuja los datos que
// recibe; las acciones las ejecuta el padre. Resalta al usuario que se está editando.
function ListaUsuarios({ usuarios, identificacionEditando, onEditar, onEliminar }) {
  return (
    <section className="panel">
      <div className="panel__encabezado">
        <h2 className="panel__titulo">Usuarios registrados</h2>
        <span className="total">Total: {usuarios.length}</span>
      </div>

      {/* Renderizado condicional: mensaje de lista vacía o la lista generada con map.
          La key es la identificación porque es única (el registro no permite repetirla). */}
      {usuarios.length === 0 ? (
        <p className="vacio">Aún no hay usuarios registrados</p>
      ) : (
        <ul className="usuarios">
          {usuarios.map((usuario) => (
            <li
              key={usuario.identificacion}
              className={`usuario ${usuario.identificacion === identificacionEditando ? 'usuario--editando' : ''}`}
            >
              <div className="usuario__datos">
                <strong>{usuario.nombre}</strong>
                <span>ID: {usuario.identificacion}</span>
                <span className="usuario__correo">{usuario.correo}</span>
              </div>
              <div className="usuario__botones">
                <button
                  type="button"
                  className="boton boton--secundario boton--pequeno"
                  onClick={() => onEditar(usuario)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="boton boton--peligro boton--pequeno"
                  onClick={() => onEliminar(usuario)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ListaUsuarios
