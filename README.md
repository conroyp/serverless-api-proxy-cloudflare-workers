# Serverless caching and proxying with Cloudflare Workers

A reference implementation of serverless caching and proxying using [Cloudflare Workers](https://developers.cloudflare.com/workers/).

This repo is intended to accompany the article [Serverless caching and proxying with Cloudflare Workers](https://www.conroyp.com/articles/serverless-api-caching-cloudflare-workers-json-cors-proxy), which goes into more detail on why we'd want to do this (speed, CORS proxying, avoiding rate limits).

## Setup

Install [wrangler](https://developers.cloudflare.com/workers/wrangler/):

```
npm install -g wrangler
```

Log in to Cloudflare:
```
wrangler login
```

Install dependencies:
```
npm install
```

Run local dev server
```
npm start
```

Deploy to Cloudflare:
```
wrangler deploy
```

If you have more than one Cloudflare account, you'll be asked to pick the account first. Then you'll get a `workers.dev` URL where the worker can be accessed.
