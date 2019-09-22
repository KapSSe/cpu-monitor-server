const { api, Task } = require('actionhero')

module.exports = class SystemMonitorTask extends Task {
  constructor () {
    super()
    this.name = 'SystemMonitorTask'
    this.description = 'I\'am updating system data'
    this.frequency = 500
    this.queue = 'monitor'
  }

  async run (data) {
    await api.systemMonitor.save()
    api.mdb.aggregate('Monitor')
  }
}
