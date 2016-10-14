'use strict'

module.exports = async function commonFetch(fetcher, uri, options, detailsKey = 'message') {
  options = Object.assign({
    method: 'GET',
    headers: new Headers({
      accept: 'application/json'
    }),
    credentials: 'same-origin',
    redirect: 'follow'
  }, options)
  let response = await fetcher(uri, options)
  if (!response.ok) {
    let err
    let errDetails
    let payload
    try {
      let result = await response.text()
      if (result === '') {
        return undefined
      }
      try {
        let resultJson = JSON.parse(result)
        errDetails = resultJson[detailsKey]
      }
      catch (err) {
        errDetails = result.substring(0, 100)
      }
      err.payload = result
    }
    catch (responseErr) {
      errDetails = responseErr.message
    }
    err = new Error(`Invalid response: ${response.status} ${response.statusText}${errDetails ? `: ${errDetails}` : errDetails}`)
  }
  if (response.status === 204) {
    return undefined
  }
  let result = response.text()
  if (result === '') {
    return undefined
  }
  return JSON.parse(result)
}
