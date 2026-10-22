// Capa de acceso a la API del Art Institute of Chicago. Las páginas no llaman a fetch
// directamente: usan estas funciones, que además convierten los datos de la API (en inglés y
// con muchos campos) a objetos simples en español con solo lo que la interfaz necesita.
const URL_BASE = 'https://api.artic.edu/api/v1'
// Las imágenes de https://www.artic.edu/iiif/2 se piden a través del proxy de Vite (solo en
// local): Cloudflare solo las entrega sin desafío anti-bots si el Referer es de artic.edu, y el
// navegador no permite fijar ese Referer desde la app. En producción la imagen falla y la
// interfaz muestra «Imagen no disponible».
const IIIF_PROXY = '/iiif/2'

export const OBRAS_POR_PAGINA = 12
// La API no permite paginar más allá de los primeros 10.000 resultados.
const MAX_RESULTADOS_API = 10000

// Con `fields` se le pide a la API solo estos campos, para que las respuestas del listado pesen poco.
const CAMPOS_LISTADO = 'id,title,image_id,artist_title,artwork_type_title,date_display'

// Cloudflare (delante de la API) responde 403 sin cabeceras CORS cuando el Referer es
// http://localhost:5173/, así que no se envía.
const OPCIONES_FETCH = (signal) => ({ signal, referrerPolicy: 'no-referrer' })

// Hace la petición y devuelve el JSON, o lanza un Error con un mensaje legible para el usuario.
// `signal` viene de un AbortController: permite cancelar la petición si el componente se
// desmonta o cambian los parámetros antes de que llegue la respuesta.
async function pedirJson(url, signal) {
  let respuesta
  try {
    respuesta = await fetch(url, OPCIONES_FETCH(signal))
  } catch (error) {
    // Una cancelación voluntaria no es un fallo: se propaga tal cual para que el llamador la ignore.
    if (error.name === 'AbortError') throw error
    throw new Error('No se pudo conectar con la API. Revisa tu conexión a internet.', {
      cause: error,
    })
  }
  // fetch solo falla por problemas de red; los códigos 4xx/5xx hay que revisarlos a mano.
  if (respuesta.status === 404) {
    throw new Error('No se encontró el recurso solicitado.')
  }
  if (!respuesta.ok) {
    throw new Error(`La API respondió con un error (${respuesta.status}).`)
  }
  return respuesta.json()
}

// Arma la URL de una imagen con el formato IIIF: /{identificador}/{región}/{tamaño}/{rotación}/{calidad}.jpg
// "full" es la imagen completa y "{ancho}," pide ese ancho con el alto proporcional.
// Devuelve null si la obra no tiene imagen.
export function construirImagen(imageId, ancho = 843) {
  if (!imageId) return null
  return `${IIIF_PROXY}/${imageId}/full/${ancho},/0/default.jpg`
}

// Busca obras para el listado (una página de 12). Usa el endpoint /artworks/search.
export async function buscarObras({ texto, tipo, pagina }, signal) {
  const params = new URLSearchParams({
    page: pagina,
    limit: OBRAS_POR_PAGINA,
    fields: CAMPOS_LISTADO,
    // Filtro de Elasticsearch: solo obras que tengan imagen (las tarjetas siempre muestran una).
    'query[bool][filter][0][exists][field]': 'image_id',
  })
  // `q` es la búsqueda por texto; el filtro por tipo se suma como un segundo filtro exacto.
  if (texto) params.set('q', texto)
  if (tipo) params.set('query[bool][filter][1][term][artwork_type_id]', tipo)

  const json = await pedirJson(`${URL_BASE}/artworks/search?${params}`, signal)
  const maxPaginas = Math.floor(MAX_RESULTADOS_API / OBRAS_POR_PAGINA)

  return {
    obras: json.data.map((obra) => ({
      id: obra.id,
      titulo: obra.title,
      artista: obra.artist_title || 'Artista desconocido',
      tipo: obra.artwork_type_title,
      fecha: obra.date_display,
      imagen: construirImagen(obra.image_id, 400),
    })),
    total: json.pagination.total,
    // Se limita al máximo que permite la API para no ofrecer páginas que darían error.
    totalPaginas: Math.min(json.pagination.total_pages, maxPaginas),
  }
}

// Trae los tipos de obra (pintura, escultura…) para llenar las opciones del filtro, ordenados A-Z.
export async function obtenerTiposDeObra(signal) {
  // No se usa `fields`: la API responde 500 cuando se le pasa en este endpoint.
  const json = await pedirJson(`${URL_BASE}/artwork-types?limit=100`, signal)
  return json.data
    .map((tipo) => ({ id: tipo.id, nombre: tipo.title }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
}

// La descripción de la API viene con etiquetas HTML (<p>, <em>…). Se convierten a texto plano
// con DOMParser, que es más seguro que insertar el HTML directamente en la página.
function limpiarHtml(html) {
  if (!html) return null
  const documento = new DOMParser().parseFromString(html, 'text/html')
  return documento.body.textContent.trim()
}

// Trae todos los datos de una obra por su id (endpoint /artworks/{id}) para la pantalla de detalle.
export async function obtenerObra(id, signal) {
  const json = await pedirJson(`${URL_BASE}/artworks/${id}`, signal)
  const obra = json.data

  return {
    id: obra.id,
    titulo: obra.title,
    artista: obra.artist_display || obra.artist_title || 'Artista desconocido',
    artistaCorto: obra.artist_title || 'Artista desconocido',
    fecha: obra.date_display,
    tecnica: obra.medium_display,
    dimensiones: obra.dimensions,
    origen: obra.place_of_origin,
    tipo: obra.artwork_type_title,
    departamento: obra.department_title,
    // La sala solo tiene sentido si la obra está actualmente en exhibición.
    galeria: obra.is_on_view ? obra.gallery_title : null,
    credito: obra.credit_line,
    dominioPublico: obra.is_public_domain,
    descripcion: limpiarHtml(obra.description) || limpiarHtml(obra.short_description),
    textoAlternativo: obra.thumbnail?.alt_text,
    imagen: construirImagen(obra.image_id, 843),
    // Versión pequeña: es la que se guarda en favoritos para que sus tarjetas carguen rápido.
    imagenMiniatura: construirImagen(obra.image_id, 400),
    enlaceMuseo: `https://www.artic.edu/artworks/${obra.id}`,
  }
}
