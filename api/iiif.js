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

  // Se pide la imagen al museo desde el servidor con las cabeceras que enviaría un navegador al
  // mostrar la imagen dentro de www.artic.edu. El Referer es el que Cloudflare exige; el resto
  // evita que la petición se identifique como un bot (fetch de Node envía "User-Agent: node").
  const respuesta = await fetch(`https://www.artic.edu/iiif/${ruta}`, {
    headers: {
      Referer: 'https://www.artic.edu/',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Sec-Fetch-Dest': 'image',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'same-origin',
    },
  })
  if (!respuesta.ok) {
    // Se indica qué respondió el museo (cf-mitigated=challenge significa desafío anti-bots).
    const mitigacion = respuesta.headers.get('cf-mitigated') ?? 'ninguna'
    return new Response(
      `No se pudo obtener la imagen: el museo respondió ${respuesta.status} (cf-mitigated=${mitigacion})`,
      { status: respuesta.status },
    )
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
