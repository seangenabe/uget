'use strict'

const g = require('global')
const cfetch = require('./cfetch')

class Agent {

  fetch(uri, options) {
    if (typeof g.fetch !== 'function') {
      throw new Error("GlobalFetch.fetch is not available.")
    }

    return cfetch(g.fetch, uri, options, this.detailsKey)
  }
}

const globalAgent = new Agent()

module.exports = function uget(uri, options) {
  return globalAgent.fetch(uri, options)
}

module.exports.Agent = Agent

module.exports.globalAgent = globalAgent
