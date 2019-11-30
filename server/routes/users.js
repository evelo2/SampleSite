const express = require('express');
const log = require('../util/logUtil').init();
const dbConfig = require('../util/dbConfiguration').init();


const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.render(
    'users', 
    {
      title: 'users'
    }
  );
});

router.get('/get', (req, res, next) => {
  req.useCache = false;
  dbConfig.getDB('read')
          .then(db => {
            const users = db.get('users').find();
            log.debug(JSON.stringify(users));
            res.send(JSON.stringify(users));
          })
          .catch(err => next(err));
});

router.post('/add', (req, res) => {
  log.debug(JSON.stringify(req.body));
  const { user } = req.body;
  if (user) {
    dbConfig.getDB('write').then(db => {
      const collection = db.get('users');
      log.debug('Inserting user.');
      collection.insert(user);
      res.send(JSON.stringify({
        result: 1
      }));
    });
  }
});

module.exports = router;
