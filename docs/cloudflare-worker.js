
// Cloudflare Worker for Reverse Proxy
// Deploy this worker and set up a route for movingto.com/funds/*

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Handle redirects from old subdomain
  if (url.hostname === 'funds.movingto.io') {
    const newUrl = `https://movingto.com/funds${url.pathname}${url.search}`
    return Response.redirect(newUrl, 301)
  }
  
  // Handle /funds path
  if (url.pathname.startsWith('/funds/')) {
    // Remove /funds prefix and proxy to subdomain
    const targetPath = url.pathname.replace('/funds', '')
    const targetUrl = `https://funds.movingto.io${targetPath}${url.search}`
    
    // Create new request
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    })
    
    // Fetch from origin
    const response = await fetch(newRequest)
    
    // Create new response with modified headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    })
    
    // Update any location headers for proper redirects
    if (newResponse.headers.get('location')) {
      const location = newResponse.headers.get('location')
      if (location.startsWith('https://funds.movingto.io/')) {
        const newLocation = location.replace('https://funds.movingto.io/', 'https://movingto.com/funds/')
        newResponse.headers.set('location', newLocation)
      }
    }
    
    return newResponse
  }
  
  // Handle exact /funds redirect
  if (url.pathname === '/funds') {
    return Response.redirect(`${url.origin}/funds/`, 301)
  }
  
  // For all other requests, pass through to your main site
  return fetch(request)
}
