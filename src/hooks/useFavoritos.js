import { useEffect, useState } from 'react'

const CLAVE_STORAGE = 'galeria-abierta:favoritos'

// Lee los favoritos de localStorage. Se usa como inicializador "perezoso" de useState, así que
// solo se ejecuta una vez, al montar la aplicación. Si el JSON está dañado o el navegador
// bloquea el almacenamiento, se empieza con una lista vacía en vez de romper la app.
function leerFavoritosGuardados() {
  try {
    const guardados = localStorage.getItem(CLAVE_STORAGE)
    return guardados ? JSON.parse(guardados) : []
  } catch {
    return []
  }
}

// Hook que gestiona la lista de favoritos y la sincroniza con localStorage.
// Se guarda el objeto completo de la obra (no solo el id) para poder mostrar la página de
// Favoritos sin volver a pedir cada obra a la API.
export function useFavoritos() {
  const [favoritos, setFavoritos] = useState(leerFavoritosGuardados)

  // Cada vez que cambia la lista, se guarda en localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(favoritos))
    } catch {
      // Si el navegador bloquea el almacenamiento, los favoritos siguen en memoria.
    }
  }, [favoritos])

  const esFavorito = (id) => favoritos.some((obra) => obra.id === id)

  // Agrega la obra si no está y la quita si ya estaba. Se usa la forma funcional de setState
  // (recibe el valor "actuales") para no depender de una copia desactualizada del estado.
  const alternarFavorito = (obra) => {
    setFavoritos((actuales) =>
      actuales.some((fav) => fav.id === obra.id)
        ? actuales.filter((fav) => fav.id !== obra.id)
        : [...actuales, obra],
    )
  }

  const quitarFavorito = (id) => {
    setFavoritos((actuales) => actuales.filter((obra) => obra.id !== id))
  }

  return { favoritos, esFavorito, alternarFavorito, quitarFavorito }
}
