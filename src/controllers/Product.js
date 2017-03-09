'use strict';

var conn = require('../dal/pgConnection.js');
var dal = require('../dal/watzdprice.js');
var elasticsearch = require('../dal/elasticsearch.js');
var MyError = require('../MyError.js');
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
        return next(new MyError('ERROR', 'getproductGET', 'Error', {params: req.swagger.params}, err));
      }
      dal.getProduct(client, req.swagger.params.id.value, function (err, product) {
        if (err) {
          conn.rollback(client, done);
          return next(new MyError('ERROR', 'getproductGET', 'Error', {params: req.swagger.params}, err));
        }
        conn.commit(client, done);
        if (!product) {
          res.statusCode = 204;
          return res.end();
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({
          product: {
            id: product.id,
            name: product.name,
            shop: product.shop,
            brand: product.brand,
            ean: product.ean,
            category: product.category,
            created: product.created,
            lastupdate: product.lastupdate,
            price: product.price,
            description: product.description,
            url: product.url,
            image: product.image
          }
        }));
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
    elasticsearch.searchProducts(client, req.swagger.params.offset.value, req.swagger.params.limit.value, req.swagger.params.q.value, function (err, products) {
      if (err) {
        return next(new MyError('ERROR', 'searchproductsGET', 'Error', {params: req.swagger.params}, err));
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({products: products}));
    });
  }
};
