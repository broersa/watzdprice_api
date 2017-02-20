'use strict';

var conn = require('../dal/pgConnection.js');
var dal = require('../dal/watzdprice.js');
var elasticsearch = require('../dal/elasticsearch.js');

module.exports.getproductGET = function getproductGET (req, res, next) {
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
  if (req.swagger.params.apikey.value !== 'andre') {
    res.statusCode = 403;
    return res.end();
  } else {
    var client = elasticsearch.startSession();
    elasticsearch.searchProducts(client, req.swagger.params.q.value, function (err, products) {
      if (err) {
        console.error('searchproductsGET - ' + JSON.stringify(req.swagger.params) + err.print());
        conn.rollback(client, done);
        return next(err);
      }

      res.statusCode = 200;
      return res.end(JSON.stringify({products: products}));
    });
  }
};
