'use strict';

var conn = require('../dal/pgConnection.js');
var dal = require('../dal/watzdprice.js');
var elasticsearch = require('../dal/elasticsearch.js');
var log = require('../log.js');

module.exports.getproductGET = function getproductGET (req, res, next) {
  var visitor = log.getLogger();
  visitor.event('getproduct', req.swagger.params.apikey.value, req.swagger.params.id.value, 1, {uid: req.swagger.params.apikey.value, uip: req.headers['x-forwarded-for'] || req.connection.remoteAddress, ua: req.headers['user-agent']}).send();
  if (req.swagger.params.apikey.value !== 'andre') {
    res.statusCode = 403;
    return res.end();
  } else {
    conn.execute(function (err, client, done) {
      if (err) {
        console.error('getproductGET - ' + JSON.stringify(req.swagger.params) + err.print());
        return next(err);
      }
      dal.getProduct(client, req.swagger.params.id.value, function (err, product) {
        if (err) {
          console.error('getproductGET - ' + JSON.stringify(req.swagger.params) + err.print());
          conn.rollback(client, done);
          return next(err);
        }

        conn.commit(client, done);
        res.statusCode = 200;
        return res.end(JSON.stringify({product: product}));
      });
    });
  }
};

module.exports.searchproductsGET = function searchproductsGET (req, res, next) {
  var visitor = log.getLogger();
  visitor.event('searchproducts', req.swagger.params.apikey.value, req.swagger.params.q.value, 1, {uid: req.swagger.params.apikey.value, uip: req.headers['x-forwarded-for'] || req.connection.remoteAddress, ua: req.headers['user-agent']}).send();
  if (req.swagger.params.apikey.value !== 'andre') {
    res.statusCode = 403;
    return res.end();
  } else {
    var client = elasticsearch.startSession();
    elasticsearch.searchProducts(client, req.swagger.params.q.value, function (err, products) {
      if (err) {
        console.error('searchproductsGET - ' + JSON.stringify(req.swagger.params) + err.print());
        return next(err);
      }

      res.statusCode = 200;
      return res.end(JSON.stringify({products: products}));
    });
  }
};
