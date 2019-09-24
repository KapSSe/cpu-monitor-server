const mongoose = require('mongoose')

const monitor = new mongoose.Schema({
  cpu: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Monitor', monitor)
