'use strict'
const { Action } = require('actionhero')

module.exports = class UserRegisterAction extends Action {
  constructor () {
    super()
    this.name = 'user:register'
    this.description = 'new user registration'
    this.outputExample = {}
    this.middleware = ['mw:user:register']
  }

  async run (data) {
    return data.response.result
  }
}
