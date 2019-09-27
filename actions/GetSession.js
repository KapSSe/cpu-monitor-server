'use strict'
const { Action } = require('actionhero')

module.exports = class GetSession extends Action {
  constructor () {
    super()
    this.name = 'get:fp'
    this.description = 'an actionhero action'
    this.outputExample = {}
    // this.middleware = ['mw:user:verify']
  }

  async run (data) {
    data.response = data.connection.id
  }
}
