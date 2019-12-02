const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const log = require('./server/util/logUtil').init('app');

// const cacheData = {};
const cache = require('./server/util/cache').init();
const dbConfig = require('./server/util/dbConfiguration').init();

log.debug(dbConfig.getReadConnectionString());

const indexRouter = require('./server/routes/index');
const usersRouter = require('./server/routes/users');
const rolesRouter = require('./server/routes/roles');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cache.getMiddleware());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/roles', rolesRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
