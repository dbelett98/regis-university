// the following is from Professor Morgan's instructions

// include express
const express = require('express');
// blogger agent for console logs while passing data into server or from server
const logger = require('morgan');
// middleware piece for parsin JSON responses to make it usable in database
const bodyParser = require('body-parser');

// custom pieces from Professor Morgan
const tasksRoutes = require('./routes/tasks.routes');
const middleware = require('./middleware/errors.middleware');


// initialized app
const app = express();
// setup variable for port
const port = process.env.PORT || 3000;

const logLevel = process.env.LOG_LEVEL || 'dev';

// Middleware - logs server requests to console
app.use(logger(logLevel));

// Middleware - parses incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Handle routes for tasks.
app.use('/tasks', tasksRoutes); // http://localhost:3000/tasks
// app.use('/users', usersRoutes); // http://localhost:3000/users

// Handle 404 requests
app.use(middleware.error404); // http://loaclhost:3000/users

// Handle 500 requests - applies mostly to live services
app.use(middleware.error500);

// listen on server port
app.listen(port, function() {
  console.log(`Running on port: ${port}...`);
});