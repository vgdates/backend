const express = require('express');
const router = express.Router();

const path = require('path');
const moment = require('moment');

const Knex = require('knex');
const knexConfig = require('../knexfile');

const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

router.get('/month/:month', (req, res, next) => {
    let month = parseInt(req.params.month);

    if (month > 0 && month < 13) {
        // Months in Moment.js are zero indexed
        let monthName = moment().month(month - 1).format("MMMM");
        knex.select('*').from('games').where('releaseDate', 'LIKE', `%${monthName}%`)
        .then((games) => {
            let releases = [];

            for (i in games) {
                let name = games[i].title;
                let date = moment(`${games[i].releaseDate} GMT`);

                releases.push({name, date});
            }

            releases.sort((a, b) => {
                return a.date - b.date;
            })

            for (i in releases) {
                releases[i].date = moment(releases[i].date).format("dddd, MMMM Do")
            }

            res.json({ releases });
        })
    } else {
        res.send('That isn\'t a valid month');
    }
});

module.exports = router
