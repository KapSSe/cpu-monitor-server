'use strict'
const { Action } = require('actionhero')

module.exports = class UserLoginAction extends Action {
  constructor () {
    super()
    this.name = 'user:login'
    this.description = 'user login'
    this.outputExample = {}
    this.middleware = ['mw:user:login']
  }

  async run (data) {
    return data.response.result
  }
}
