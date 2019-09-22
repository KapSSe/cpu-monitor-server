'use strict'
const { api, Initializer } = require('actionhero')
const Joi = require('@hapi/joi')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = class MiddlewareInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'MiddlewareInitializer'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () {
    api.middlewares = {
      user: {}
    }

    api.middlewares.user._valiadationModels = {
      UserRegister: require('../models/User/UserRegisterValidation'),
      UserLogin: require('../models/User/UserLoginValidation')
    }

    api.middlewares.user.register = {
      name: 'mw:user:register',
      global: false,
      priority: 100,
      preProcessor: async (data) => {
        const userData = data.connection.rawConnection.params.body
        const validationModel = api.middlewares.user._valiadationModels.UserRegister
        const userModel = api.mdb.getModel('User')

        try {
          Joi.attempt(userData, validationModel)
          const user = await api.mdb.findDocument(userModel, { email: userData.email })

          if (!user) {
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(userData.password, salt)

            userData.password = hashed

            const user = api.mdb.createDocument(userModel, userData)
            const res = await api.mdb.saveDocument(user)

            if (res) data.response.result = { body: 'OK' }
          } else {
            data.response.result = { error: 'Registration', body: 'User already exists' }
          }
        } catch (err) {
          data.response.result = { error: err.name, body: err.message }
        }
      }
    }

    api.middlewares.user.login = {
      name: 'mw:user:login',
      global: false,
      priority: 100,
      preProcessor: async (data) => {
        const userData = data.connection.rawConnection.params.body
        const validationModel = api.middlewares.user._valiadationModels.UserLogin
        const userModel = api.mdb.getModel('User')

        try {
          Joi.attempt(userData, validationModel)
          const user = await api.mdb.findDocument(userModel, { email: userData.email })
          const hasValidPassword = await bcrypt.compare(userData.password, user.password)

          if (user && hasValidPassword) {
            const token = jwt.sign({ _id: user.id }, process.env.JWT_TOKEN_SECRET, { expiresIn: 1300000 })
            data.connection.setHeader('auth-token', token)
            data.response.result = { body: 'logged in' }
          } else {
            data.response.result = { error: 'Login', body: 'Email or password is wrong' }
          }
        } catch (err) {
          data.response.result = { error: err.name, body: err.message }
        }
      }
    }

    api.middlewares.user.verify = {
      name: 'mw:user:verify',
      global: false,
      priority: 100,
      preProcessor: async (data) => {
        const token = data.connection.rawConnection.req.headers['auth-token']
        if (!token) throw new Error('Access is denied')

        const isValidToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET)
        if (!isValidToken) throw new Error('Invalid token')
      }
    }
  }

  async start () {
    const { user } = api.middlewares
    api.actions.addMiddleware(user.register)
    api.actions.addMiddleware(user.login)
    api.actions.addMiddleware(user.verify)
  }
}
