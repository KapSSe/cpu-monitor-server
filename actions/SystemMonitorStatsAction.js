'use strict'
const { api, Action } = require('actionhero')

module.exports = class SystemMonitorStatsAction extends Action {
  constructor () {
    super()
    this.name = 'monitor:get:stats'
    this.description = 'an actionhero action'
    this.outputExample = {}
    // this.middleware = ['mw:user:verify']
  }

  async run (data) {
    data.response.message = await api.systemMonitor.getStats(data.connection.rawConnection.params.body)
  }
}
