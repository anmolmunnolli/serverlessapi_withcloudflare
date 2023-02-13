addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */


const allowedOrigins = [
  "http://localhost:3000",
  "https://serverless-api-viewers.pages.dev"
]

const corsHeaders = origin => ({
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Origin': origin,
})

const checkOrigin = request => {
  const origin = request.headers.get("Origin")
  return allowedOrigins.find(allowedOrigin => allowedOrigin.includes(origin))
}


const getImages = async request => {
  const {query} = await request.json()

  const resp= await fetch(`https://api.unsplash.com/search/photos?query=${query}`, {

  headers: {
    Authorization: `Client-ID ${CLIENT_ID}`
  }

  })

  const data= await resp.json()
  const images=data.results.map(image => ({
    id: image.id,
    image: image.urls.small,
    link: image.links.html
  }))

  const allowedOrigin = checkOrigin(request)
  return new Response(JSON.stringify(images),{
    headers: {
      'Content-type':'application/json',
      ...corsHeaders(allowedOrigin)
    }
    })
}



async function handleRequest(request){
if(request.method ===  "OPTIONS"){
  const allowedOrigin = checkOrigin(request)
  return new Response("OK", {
    headers: corsHeaders(allowedOrigin)
  })
}

if(request.method === 'POST'){
  return getImages(request)
}

}
  






