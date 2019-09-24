'use strict'
const { api, Action } = require('actionhero')

module.exports = class SystemMonitorAction extends Action {
  constructor () {
    super()
    this.name = 'monitor:get:last'
    this.description = 'an actionhero action'
    this.outputExample = {}
    // this.middleware = ['mw:user:verify']
    this.inputs = {
      type: {
        required: true
      },
      depth: {
        required: true
      }
    }
  }

  async run (data) {
    data.response.result = await api.systemMonitor.getStats(data.params)
  }
}
