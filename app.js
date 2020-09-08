const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const logger = require('morgan');
const creation = require('./api/Creation');
const helmet = require('helmet');

/*==============================================*/
/*============ Databbase connection ============*/
/*==============================================*/
mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log("Connection to database failed! " + error.message);
  });
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

/*==============================================*/
/*================= Middleware =================*/
/*==============================================*/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Protects from some well-known web vulnerabilities by setting HTTP headers appropriately
app.use(helmet());
// Prevents CORS errors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

/*==============================================*/
/*=================== Routes ===================*/
/*==============================================*/  
let router = null;
const setupRouter = () => { 
  router = new express.Router();
  creation.mountEndpoints(`./api/routes/`, router);   
}
setupRouter();
app.use('/api', (req, res, next) => router(req, res, next));

// Error handling
app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({error: err.message});
});  

module.exports = app;
module.exports.dynamicRouter = router;
module.exports.setupRouter = setupRouter;
