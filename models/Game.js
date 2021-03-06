const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const slug = require('slugs')

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Please specify a title'
  },
  slug: String,
  description: String,
  release: {
    type: Date,
    required: 'Please specify a release date'
  },
  platforms: [String],
  created: {
    type: Date,
    default: Date.now
  }
})

gameSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next()
  }
  this.slug = slug(this.title)
  next()
})

module.exports = mongoose.model('Game', gameSchema)