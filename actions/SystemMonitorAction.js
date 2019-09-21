'use strict'
const { Action } = require('actionhero')

module.exports = class MyAction extends Action {
  constructor () {
    super()
    this.name = 'SystemMonitorAction'
    this.description = 'an actionhero action'
    this.outputExample = {}
  }

  async run (data) {
  }
}
