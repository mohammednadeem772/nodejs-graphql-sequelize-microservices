const createError = require('http-errors');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
var session = require('express-session');
var device = require('express-device');
const helmet = require("helmet");
// for no caching in client
const nocache = require("nocache");

const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/users');

const app = express();
app.use(device.capture());
// header control
app.use(helmet.noSniff());
app.use(helmet.hsts({
    maxAge: 15552000,
    includeSubDomains: true,
}));
app.use(nocache());

// dbService().startDev();

app.use(cors());

app.use(bodyParser.json({ limit: '50mb', type: ['application/json', 'application/scim+json'] }));
app.use(
	bodyParser.urlencoded({
		limit: '50mb',
		extended: true,
		parameterLimit: 50000,
	})
);
app.use(session({ secret: 'this shit hits', resave: true, saveUninitialized: true, })); // session secret
app.disable('etag', false);
app.disable('x-powered-by', 'Test API');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;

