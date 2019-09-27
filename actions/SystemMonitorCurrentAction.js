'use strict'
const { api, Action } = require('actionhero')

module.exports = class SystemMonitorCurrentAction extends Action {
  constructor () {
    super()
    this.name = 'monitor:get:current'
    this.description = 'an actionhero action'
    this.outputExample = {}
    // this.middleware = ['mw:user:verify']
  }

  async run (data) {
    data.response.message = await api.systemMonitor.getCpuUsage()
  }
}
