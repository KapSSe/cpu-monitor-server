const { api, Task } = require('actionhero')

exports.SystemMonitorTaskSecond = class SystemMonitorTaskSecond extends Task {
  constructor () {
    super()
    this.name = 'SystemMonitorTaskSecond'
    this.description = 'I\'am updating process usage data each second'
    this.frequency = 1000
    this.queue = 'cpu'
  }

  async run (data) {
    api.systemMonitor.saveSecond()
  }
}

exports.SystemMonitorTaskMinute = class SystemMonitorTaskMinute extends Task {
  constructor () {
    super()
    this.name = 'SystemMonitorTaskMinute'
    this.description = 'I\'am updating process usage data each minute'
    this.frequency = 60000
    this.queue = 'cpu'
  }

  async run (data) {
    api.systemMonitor.saveMinute()
  }
}

exports.SystemMonitorTaskHour = class SystemMonitorTaskHour extends Task {
  constructor () {
    super()
    this.name = 'SystemMonitorTaskHour'
    this.description = 'I\'am updating process usage data each hour'
    this.frequency = 3600000
    this.queue = 'cpu'
  }

  async run (data) {
    api.systemMonitor.saveHour()
  }
}
