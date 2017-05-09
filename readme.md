# uget

[![Greenkeeper badge](https://badges.greenkeeper.io/seangenabe/uget.svg)](https://greenkeeper.io/)

Isomorphic JSON API helper on top of the Fetch API.

## Usage

```javascript
const uget = require('uget')
```

On the browser, the native Fetch API is used. On node, [node-fetch](https://npmjs.com/package/node-fetch) is used. (via [browserify](https://npmjs.com/package/browserify))

### uget(input, init)

Fetches a resource from a URI.

**Parameters** are the same as the native `GlobalFetch.fetch` function, but some defaults useful for JSON API endpoints are set for `init`:

* `method` = `GET`
* `headers` = `{ accept: 'application/json' }`

  Can be used to distinguish between a JSON API request and a normal (HTML) request.

* `credentials` = `same-origin`

  Ensures that cookies are sent with the request.

* `redirect` = `follow`

  Follow redirects.

If you pass a plain object or an array to `init.body`, that will be serialized with `JSON.stringify()` and `{ 'content-type': 'application/json' }` will be added to the default `headers`.

**Returns:**

A `Promise` that resolves with a value or rejects with an `Error`:

* If the response is not OK (does not have status 2xx):
  1. Parses the response body.
    * If the response body is valid JSON, attempts to get the `message` property and incorporates it into the error message.
    * If the response body is valid plaintext, gets the first hundred characters and incorporates it into the error message.
  2. Throws an error.
* If the response status is 204:
  * Returns `undefined`.
* Parses the response body as text
  * If the response body is empty, returns `undefined`.
  * Parses the response body text as JSON and returns it.
