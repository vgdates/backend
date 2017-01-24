const express = require('express')
const router = express.Router()

const gb = require('../lib/api/giantbomb')

const moment = require('moment')

const Knex = require('knex')
const knexConfig = require('../knexfile')
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development'])

router.get('/', (req, res, next) => {
  res.render('import')
})

router.post('/', (req, res, next) => {
  knex('games').insert({ gb_id: req.body.gb_id, title: req.body.title, releaseDate: req.body.date, bgcover: req.body.bgcover, description: req.body.description, developer: req.body.developer, publisher: req.body.publisher })
    .then((done) => {
      console.log(`Added ${req.body.title} to the database.`)
      res.redirect('/')
    })
    .catch((err) => {
      console.log('I died!', err)
    })
})

router.post('/confirm', (req, res, next) => {
  gb.queryMultiple(req.body.title)
    .then((games) => {
      let results = []

      for (let i in games.data.results) {
        let name = games.data.results[i].name
        let date = moment(`${games.data.results[i].original_release_date} GMT`)
        let bgcover = games.data.results[i].image.medium_url
        results.push({name, date, bgcover})
      }

      results.sort((a, b) => {
        return b.date - a.date
      })

      res.render('index', { 'games': results, 'header': 'Search Results', 'tagline': 'One of these lucky titles might make it into the database!' })
    })
    .catch((err) => {
      console.log('Something broke', err)
    })
})

router.post('/details', (req, res, next) => {
  gb.queryByName('req.params.name')
    .then((game) => {
      console.log(game)
    })
})

module.exports = router
