const Joi = require('@hapi/joi')

const UserValidationModel = Joi.object({
  email: Joi.string().min(3).required().email(),
  password: Joi.string().min(6).required()
})

module.exports = UserValidationModel
