// Función de Vercel: proxy de las imágenes IIIF del museo (equivalente al proxy de vite.config.js).
// Cloudflare solo las entrega sin desafío anti-bots si el Referer es de artic.edu.
// vercel.json reescribe /iiif/:ruta* a /api/iiif?ruta=:ruta*.

// Solo se aceptan rutas con la forma exacta de una imagen IIIF (2/{uuid}/full/{ancho},/0/default.jpg).
// Sin esta validación, cualquiera podría usar la función como proxy abierto hacia otras rutas.
const RUTA_VALIDA = /^2\/[0-9a-f-]+\/full\/[0-9,!]+\/0\/default\.jpg$/

export async function GET(request) {
  const ruta = new URL(request.url).searchParams.get('ruta') ?? ''
  if (!RUTA_VALIDA.test(ruta)) {
    return new Response('Ruta de imagen no válida', { status: 400 })
  }

  // Se pide la imagen al museo desde el servidor, enviando el Referer que Cloudflare exige.
  const respuesta = await fetch(`https://www.artic.edu/iiif/${ruta}`, {
    headers: { Referer: 'https://www.artic.edu/' },
  })
  if (!respuesta.ok) {
    return new Response('No se pudo obtener la imagen', { status: respuesta.status })
  }

  // Se reenvía la imagen al navegador con caché de 1 día (navegador) y 7 días (CDN de Vercel):
  // las imágenes de una obra no cambian, y así se evitan peticiones repetidas al museo.
  return new Response(respuesta.body, {
    headers: {
      'Content-Type': respuesta.headers.get('Content-Type') ?? 'image/jpeg',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
    },
  })
}
