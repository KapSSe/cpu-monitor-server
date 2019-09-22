'use strict'
const { api, Initializer } = require('actionhero')
const { cpu } = require('node-os-utils')

module.exports = class SystemMonitorIntializer extends Initializer {
  constructor () {
    super()
    this.name = 'SystemMonitor'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () {
    api.systemMonitor = {}

    api.systemMonitor.getCpuUsage = async () => {
      try {
        return await cpu.usage()
      } catch (err) {
        throw new Error(err)
      }
    }

    api.systemMonitor.save = async () => {
      try {
        const monitorModel = api.mdb.getModel('Monitor')
        const cpu = await api.systemMonitor.getCpuUsage()

        const user = api.mdb.createDocument(monitorModel, { cpu })
        await api.mdb.saveDocument(user)
      } catch (err) {
        throw new Error(err)
      }
    }
  }
}
