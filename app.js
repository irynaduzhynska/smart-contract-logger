const express = require("express");
const cors = require('cors');
const logger = require('morgan');
const error = require('http-errors');
const path = require('path');
const bodyParser = require('body-parser')
const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false , limit: '10mb', parameterLimit:10000}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', require('./routes/index.route'))

app.use(function(req, res, next) {
    next(error(404));
});

app.use(function(err, req, res, next) {
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).send({message: err.message || "error"})
});

module.exports = app;