'use strict'
const { api, Initializer } = require('actionhero')
const { cpu } = require('node-os-utils')

module.exports = class SystemMonitorIntializer extends Initializer {
  constructor () {
    super()
    this.name = 'SystemMonitor'
    this.loadPriority = 500
    this.startPriority = 500
    this.stopPriority = 500
  }

  async initialize () {
    api.systemMonitor = {}

    api.systemMonitor.getCpuUsage = async () => {
      try {
        return await cpu.usage()
      } catch (e) {
        api.log('system monitor cpu error', 'emerg', e)
      }
    }
  }

  async start () {}

  async stop () {}
}
