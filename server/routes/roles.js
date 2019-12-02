const express = require('express');
const log = require('../util/logUtil').init('RolesRouter');
const dbConfig = require('../util/dbConfiguration').init();
const DatabaseConfiguration = require('../util/dbConfiguration');
const Cache = require('../util/cache');

const router = express.Router();
const collectionName = 'roles';

/* GET users listing. */
router.get('/', (req, res) => {
  res.render(
    'roles', 
    {
      title: 'roles'
    }
  );
});

router.get('/get', [Cache.getNoCacheMiddleware(), (req, res, next) => {
  req.useCaching = false;
  log.debug('roles/get - request received.');
  DatabaseConfiguration.init()
          .getDB('read')
          .then(({ db }) => {
            log.debug('Connection ready');
            db.get(collectionName)
              .find()
              .then(roles => {
                log.debug(JSON.stringify(roles));
                res.send(JSON.stringify(roles));
              });          
          })
          .catch(err => next(err));
}]);

router.post('/add', (req, res, next) => {
  log.debug(JSON.stringify(req.body));
  const { role } = req.body;
  if (role) {
    dbConfig.getDB('write').then(({ db }) => {
      const collection = db.get(collectionName);
      log.debug('Inserting user.');
      collection.insert(role)
                .then(result => {                                
                  res.send(JSON.stringify(result));                  
                })
                .catch(err => next(err));
    })
    .catch(err => next(err));
  }
});

router.post('/delete', (req, res, next) => {
  log.debug(JSON.stringify(req.body));
  const { id } = req.body;
  log.debug(`Request to delete ${id}`);
  if (id) {
    dbConfig.getDB('write')
            .then(({ db }) => {
              db.get(collectionName)
                .remove({ _id: id })
                .then(result => {
                  res.send(result);
                })
                .catch(err => next(err));
            })
            .catch(err => next(err));
  } else {
    next(new Error('No ID found in body.'));
  }
});

module.exports = router;
