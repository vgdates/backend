const mongoose = require('mongoose')
const moment = require('moment')
const Game = mongoose.model('Game')

exports.getGames = async (req, res) => {
  let games = await Game.find()
  games = games.filter(game => moment(game.release).isAfter())
  games.sort((a, b) => a.release - b.release)
  res.render('index', { title: 'Upcoming Games', games })
}

exports.queryGame = async(req, res) => {
  let game = await Game.findOne({ slug: req.params.game })
  res.render('editGame', { title: `Edit ${game.name}`, game })
}

exports.addGame = (req, res) => {
  res.render('editGame', { title: 'Add Game' })
}

exports.createGame = async (req, res) => {
  const game = await (new Game(req.body)).save()
  req.flash('success', `Successfully added ${game.name}.`)
  res.redirect('/')
}

exports.sortByMonth = async(req, res) => {
  let games = await Game.find()
  const month = req.params.month.slice(0,1).toUpperCase() + req.params.month.slice(1)

  games = games.filter(game => (moment(game.release).format('MMMM').toLowerCase() === req.params.month))
  games.sort((a, b) => a.release - b.release)

  res.render('index', { title: `Releases for ${month}`, games})
}