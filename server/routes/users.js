const express = require('express');
const log = require('../util/logUtil').init('UsersRouter');
const dbConfig = require('../util/dbConfiguration').init();
const DatabaseConfiguration = require('../util/dbConfiguration');
const Cache = require('../util/cache');

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

router.get('/get', [Cache.getNoCacheMiddleware(), (req, res, next) => {
  req.useCaching = false;
  log.debug('users/get - request received.');
  DatabaseConfiguration.init()
          .getDB('read')
          .then(({ db }) => {
            log.debug('Connection ready');
            db.get('users')
              .find()
              .then(users => {
                log.debug(() => JSON.stringify(users));
                res.send(JSON.stringify(users));
              })
              .catch(err => next(err))
              .then(() => db.close());          
          })
          .catch(err => next(err));
}]);

router.post('/add', (req, res, next) => {
  log.debug(() => JSON.stringify(req.body));
  const { user } = req.body;
  if (user) {
    dbConfig.getDB('write').then(({ db }) => {
      const collection = db.get('users');
      log.debug('Inserting user.');
      collection.insert(user)
                .then(result => {                                
                  res.send(JSON.stringify(result));                  
                })
                .catch(err => next(err))
                .then(() => db.close());
    })
    .catch(err => next(err));
  }
});

router.post('/delete', (req, res, next) => {
  log.debug(() => JSON.stringify(req.body));
  const { id } = req.body;
  log.debug(() => `Request to delete ${id}`);
  if (id) {
    dbConfig.getDB('write')
            .then(({ db }) => {
              db.get('users')
                .remove({ _id: id })
                .then(result => {
                  res.send(result);
                })
                .catch(err => next(err))
                .then(() => db.close());
            })
            .catch(err => next(err));
  } else {
    next(new Error('No ID found in body.'));
  }
});

module.exports = router;
