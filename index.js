console.log('index.js is plugged in');
const sqlite = require('sqlite');
const Sequelize = require('sequelize'),
  request = require('request'),
  express = require('express'),
  app = express();
var axios = require('axios');
var Promise = require('bluebird');

const {
  PORT = 3000, NODE_ENV = 'development', DB_PATH = './db/database.db'
} = process.env;

const dbPromise = sqlite.open('db/database.db', {
  Promise
});

// START SERVER
Promise.resolve()
  .then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch((err) => {
    if (NODE_ENV === 'development') console.error(err.stack);
  });

// ROUTES
baseURL = "http://credentials-api.generalassemb.ly/4576f55f-c427-4cfc-a11c-5bfe914ca6c1";

// let db = sqlite('./db/database.db');

let sql = `SELECT
          *
          FROM
           films
          LIMIT 5 OFFSET 2;`;

app.get('/films/:id/reviews', function getFilmRecommendations(req, res) {
  const filmId = req.params.id;


  reviewsURL = `http://credentials-api.generalassemb.ly/4576f55f-c427-4cfc-a11c-5bfe914ca6c1?films=${filmId}`;

  axios
    .get(reviewsURL)
    .then(function(response) {
      console.log("response", response.data);
      res.json({
        meta: {offset: 0, limit:10},
        recommendations: response.data
      });

    })
    .catch(err => {
      return err;
    })


});

// ROUTE HANDLER

app.get('/films/:id/recommendations', async (req, res, next) => {

  console.log(req.params.id, "req.params.id");
  var id = req.params.id;
  try {
    const db = await dbPromise;
    const [genre] = await Promise.all([
      // db.get('SELECT * FROM films WHERE id = ?', req.params.id),
      db.all(`SELECT
                *
                FROM
                 films

                LIMIT 5 OFFSET 2;`)
    ]).then(data => {
      res.json(data)

    });
  } catch (err) {
    next(err);
  }

});
// const filmId;


module.exports = app;
