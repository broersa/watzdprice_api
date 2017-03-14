'use strict';

var conn = require('../dal/pgConnection.js');
var dal = require('../dal/watzdprice.js');
var MyError = require('../MyError.js');
var log = require('../log.js');

module.exports.getautocompleteGET = function getautocompleteGET (req, res, next) {
  var visitor = log.getLogger();
  visitor.event('getautocomplete', req.swagger.params.apikey.value, req.swagger.params.q.value, 1, {uid: req.swagger.params.apikey.value, uip: req.headers['x-forwarded-for'] || req.connection.remoteAddress, ua: req.headers['user-agent']}).send();
  conn.execute(function (err, client, done) {
    if (err) {
      return next(new MyError('ERROR', 'getautocompleteGET', 'Error', {params: req.swagger.params}, err));
    }
    dal.getAutocomplete(client, req.swagger.params.q.value, function (err, words) {
      if (err) {
        conn.rollback(client, done);
        return next(new MyError('ERROR', 'getautocompleteGET', 'Error', {params: req.swagger.params}, err));
      }
      conn.commit(client, done);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({words: words}));
    });
  });
};
