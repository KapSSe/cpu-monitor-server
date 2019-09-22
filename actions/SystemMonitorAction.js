'use strict'
const { Action } = require('actionhero')

module.exports = class SystemMonitorAction extends Action {
  constructor () {
    super()
    this.name = 'monitor:test'
    this.description = 'an actionhero action'
    this.outputExample = {}
    this.middleware = ['mw:user:verify']
  }

  async run (data) {
  }
}
