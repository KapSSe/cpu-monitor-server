'use strict'
require('dotenv').config()
const { api, Initializer } = require('actionhero')
const mongoose = require('mongoose')

module.exports = class DatabaseInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'DatabaseInitializer'
    this.loadPriority = 1000
    this.startPriority = 1500
    this.stopPriority = 1500
  }

  async initialize () {
    api.mdb = {}

    api.mdb.connect = async (url, params) => {
      try {
        api.mdb.connection = await mongoose.connect(url, params)
        api.log('db connected', 'info')
      } catch (e) {
        api.log('db connection error', 'emerg', e)
      }
    }

    api.mdb.createSchema = (definition) => {
      return new mongoose.Schema(definition)
    }

    api.mdb.createModel = (name, schema) => {
      return mongoose.model(name, schema)
    }

    api.mdb.createDocument = (Model, params) => {
      return new Model(params)
    }

    api.mdb.saveDocument = async (document) => {
      try {
        const savedDocument = await document.save()
        return savedDocument
      } catch (e) {
        api.log('db save document error', 'emerg', e)
      }
    }
  }

  async start () {
    await api.mdb.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    // const userSchema = api.mdb.createSchema(require('../schemas/user'))
    // const User = api.mdb.createModel('User', userSchema)
    // const user = api.mdb.createDocument(User, { name: 'John' })
    // const savedUser = api.mdb.saveDocument(user)
    // api.log('saved to db', 'info', savedUser)
  }

  async stop () {
  }
}
