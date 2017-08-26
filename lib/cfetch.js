'use strict'

const g = require('global')
const isPlainObject = require('lodash.isplainobject')

const defaultHeaders = { accept: 'application/json' }

module.exports = async function commonFetch(fetcher, uri, options, detailsKey = 'message') {
  // Merge default options
  options = Object.assign({
    method: 'GET',
    credentials: 'same-origin',
    redirect: 'follow'
  }, options)

  // Stringify body
  let myDefaultHeaders = Object.assign({}, defaultHeaders)
  let ob = options.body
  if (isPlainObject(ob) || Array.isArray(ob)) {
    options.body = JSON.stringify(ob)
    myDefaultHeaders['content-type'] = 'application/json'
  }

  // Merge headers
  let oh = options.headers
  if (g.Headers && oh instanceof g.Headers) {
    for (let key of Object.keys(myDefaultHeaders)) {
      if (!g.has(key)) {
        g.set(key, myDefaultHeaders[key])
      }
    }
  }
  else if (isPlainObject(oh)) {
    options.headers = Object.assign({}, myDefaultHeaders, oh)
  }

  // Fetch
  let response = await fetcher(uri, options)

  // Process response
  if (!response.ok) {
    let errDetails
    let payload
    let additional = {}
    try {
      let result = await response.text()
      payload = result
      if (result === '') {
        errDetails = "Empty response payload."
      }
      try {
        let resultJson = JSON.parse(result)
        errDetails = resultJson[detailsKey]
        additional.payloadJson = resultJson
        additional.payloadJsonDetail = resultJson[detailsKey]
      }
      catch (err) {
        errDetails = result.substring(0, 100)
      }
    }
    catch (responseErr) {
      errDetails = responseErr.message
    }
    let err = new Error(`Invalid response: ${response.status} ${response.statusText}${errDetails ? `: ${errDetails}` : ''}`)
    err.payload = payload
    err.response = response
    Object.assign(err, additional)
    throw err
  }
  if (response.status === 204) {
    return undefined
  }
  let result = await response.text()
  if (result === '') {
    return undefined
  }
  return JSON.parse(result)
}
