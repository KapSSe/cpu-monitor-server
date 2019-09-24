'use strict'
require('dotenv').config()
const { api, Initializer } = require('actionhero')
const mongoose = require('mongoose')

module.exports = class DatabaseInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'DatabaseInitializer'
    this.loadPriority = 500
    this.startPriority = 500
    this.stopPriority = 1000
  }

  async initialize () {
    api.mdb = {}

    api.mdb._models = {
      User: require('../models/User/User'),
      Monitor: require('../models/Monitor/Monitor')
    }

    api.mdb.connect = async (url, params) => {
      try {
        api.mdb.connection = await mongoose.connect(url, params)
        api.log('db connected', 'info')
      } catch (e) {
        api.log('db connection error', 'emerg', e)
      }
    }

    api.mdb.getModel = (name) => {
      return api.mdb._models[name]
    }

    api.mdb.createDocument = (Model, params) => {
      return new Model(params)
    }

    api.mdb.findDocument = async (Model, params) => {
      return Model.findOne(params)
    }

    api.mdb.saveDocument = async (document) => {
      try {
        const savedDocument = await document.save()
        return savedDocument
      } catch (err) {
        api.log('db save document error', 'emerg')
        throw new Error(err)
      }
    }

    api.mdb.aggregate = async (Model, pipeline) => {
      try {
        const res = await api.mdb._models[Model].aggregate(pipeline).then(res => res)
        return res
      } catch (err) {
        throw new Error(err)
      }
    }
  }

  async start () {
    await api.mdb.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  }

  async stop () {
  }
}
