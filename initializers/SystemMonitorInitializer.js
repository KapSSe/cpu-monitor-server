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

    api.systemMonitor.getCpuUsage = () => cpu.usage()

    api.systemMonitor.getTimeRange = (type, depth) => {
      const date = new Date()
      switch (type) {
        case 'seconds':
          return { from: new Date(date.setSeconds(date.getSeconds() - depth)), to: new Date() }
        case 'minutes':
          return { from: new Date(date.setMinutes(date.getMinutes() - depth)), to: new Date() }
        case 'hours':
          return { from: new Date(date.setHours(date.getHours() - depth)), to: new Date() }
        default:
          break
      }
    }

    api.systemMonitor.count = async (params) => {
      if (!params || !params.type || !params.depth) {
        throw new Error('missing counter params')
      }

      const range = api.systemMonitor.getTimeRange(params.type, params.depth)
      const pipeline = [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$type', params.type] },
                { $gte: ['$date', range.from] },
                { $lte: ['$date', range.to] }
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avg_cpu: { $avg: '$cpu' }
          }
        }
      ]

      return api.mdb.aggregate('Monitor', pipeline)
    }

    api.systemMonitor.stats = async (params) => {
      if (!params || !params.type || !params.depth) {
        throw new Error('missing stats params')
      }

      const range = api.systemMonitor.getTimeRange(params.type, params.depth)

      const pipeline = [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$type', params.type] },
                { $gte: ['$date', range.from] },
                { $lte: ['$date', range.to] }
              ]
            }
          }
        }
      ]

      return api.mdb.aggregate('Monitor', pipeline)
    }

    api.systemMonitor.saveSecond = async () => {
      try {
        const monitorModel = api.mdb.getModel('Monitor')
        const cpu = await api.systemMonitor.getCpuUsage()

        const user = api.mdb.createDocument(monitorModel, { cpu, type: 'seconds' })
        await api.mdb.saveDocument(user)
      } catch (err) {
        throw new Error(err)
      }
    }

    api.systemMonitor.saveMinute = async () => {
      try {
        const monitorModel = api.mdb.getModel('Monitor')
        const awg = await api.systemMonitor.count({ type: 'seconds', depth: 60 })

        if (awg.length) {
          const cpu = awg[0].avg_cpu
          const user = api.mdb.createDocument(monitorModel, { cpu, type: 'minutes' })
          await api.mdb.saveDocument(user)
        }
      } catch (err) {
        throw new Error(err)
      }
    }

    api.systemMonitor.saveHour = async () => {
      try {
        const monitorModel = api.mdb.getModel('Monitor')
        const awg = await api.systemMonitor.count({ type: 'minutes', depth: 60 })

        if (awg.length) {
          const cpu = awg[0].avg_cpu
          const user = api.mdb.createDocument(monitorModel, { cpu, type: 'hours' })
          await api.mdb.saveDocument(user)
        }
      } catch (err) {
        throw new Error(err)
      }
    }

    api.systemMonitor.getStats = async (params) => {
      try {
        return api.systemMonitor.stats(params)
      } catch (err) {
        throw new Error(err)
      }
    }
  }
}
