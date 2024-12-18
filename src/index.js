/**
 * Use Cloudflare Workers as a serverless proxy.
 *
 * @see https://www.conroyp.com/articles/serverless-api-caching-cloudflare-workers-json-cors-proxy
 */


export default {
  // The fetch handler is invoked when this worker receives a HTTP(S) request
  // and should return a Response (optionally wrapped in a Promise)
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Allow access from all domains
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // If it's an OPTIONS request, respond with 204 immediately
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }
    const cacheUrl = new URL(request.url);

    // Construct the cache key from the cache URL
    const cacheKey = new Request(cacheUrl.toString(), request);
    const cache = caches.default;

    // Check whether the value is already available in the cache
    // If not, fetch it from origin, and store it in the cache
    let response = await cache.match(cacheKey);

    if (!response) {
      console.log(
        `Response for request url: ${request.url} not present in cache. Fetching and caching request.`,
      );

      let remoteResponse = await fetchRemoteUrl(cacheUrl, corsHeaders);

      response = new Response(remoteResponse.body, {
        status: remoteResponse.status,
        headers: {
          ...remoteResponse.headers,
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=120, s-maxage=120",
          // Add timestamp to the response headers
          "X-Response-Time": new Date().toISOString(),
        },
      });

      // Into the cache we go!
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    }

    return response;
  },
};

async function fetchRemoteUrl(url) {
  // @TODO: Implement your proxying logic here.
  // N.B. Remember that if you deploy the worker to a custom URL on your domain (i.e. not
  // using workers.dev default domain), that path will also be included here.
  let targetUrl = 'https://election.sq1.io'+url.pathname;

  // Fetch the target URL and proxy the response
  return await fetch(targetUrl);
};
