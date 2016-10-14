'use strict'

const nfetch = require('node-fetch')
const cfetch = require('./cfetch')

class Agent {

  constructor() {
    this._fns = []
  }

  fetch(uri, options) {
    if (this._fns.length) {
      return this._fns[this._fns.length - 1](uri, options)
    }
    return cfetch(nfetch, uri, options)
  }
}

const globalAgent = new Agent()

let exp = function uget(uri, options) {
  return globalAgent.fetch(uri, options)
}

exp.Agent = Agent
exp.globalAgent = globalAgent

module.exports = exp
