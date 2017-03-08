'use strict';

var moment = require('moment');
var MyError = require('../MyError.js');

module.exports = {
  getProduct: function (client, productid, callback) {
    client.query('select prokey, proid, proname, proshop, probrand, proean, procategory, procreated, prolastupdate, proprice, prodescription, prourl, proimage from product where proid=$1 for update', [productid], function (err, result) {
      if (err) {
        return callback(new MyError('ERROR', 'getProduct', 'Error', {productid: productid}, err));
      }
      if (result.rowCount !== 1) {
        return callback(null, null);
      }
      callback(null, {
        prokey: parseInt(result.rows[0].prokey),
        proid: result.rows[0].proid,
        proname: result.rows[0].proname,
        proshop: result.rows[0].proshop,
        probrand: result.rows[0].probrand,
        proean: result.rows[0].proean,
        procategory: result.rows[0].procategory,
        procreated: moment(result.rows[0].procreated),
        prolastupdate: moment(result.rows[0].prolastupdate),
        proprice: parseFloat(result.rows[0].proprice),
        prodescription: result.rows[0].prodescription,
        prourl: result.rows[0].prourl,
        proimage: result.rows[0].proimage
      });
    });
  },
  addSearchProducts: function (client, searchProducts, callback) {
    client.query('insert into searchproducts (sprapikey, sprquery values ($1, $2) returning sprkey', [searchProducts.apikey, searchProducts.query], function (err, result) {
      if (err) {
        if (err.code === '23505') {
          return callback(new MyError('DUPLICATEKEY', 'addSearchProducts', 'Duplicate key error', { searchProducts: searchProducts }, err));
        }
        return callback(new MyError('ERROR', 'addSearchProducts', 'Error', { searchProducts: searchProducts }, err));
      }
      if (result.rowCount !== 1) {
        return callback(null, null);
      }
      callback(null, result.rows[0].sprkey);
    });
  },
  addGetProduct: function (client, getProduct, callback) {
    client.query('insert into getproduct (gprapikey, gprproduct values ($1, $2) returning gprkey', [getProduct.apikey, getProduct.product], function (err, result) {
      if (err) {
        if (err.code === '23505') {
          return callback(new MyError('DUPLICATEKEY', 'addGetProduct', 'Duplicate key error', { getProduct: getProduct }, err));
        }
        return callback(new MyError('ERROR', 'addGetProduct', 'Error', { getProduct: getProduct }, err));
      }
      if (result.rowCount !== 1) {
        return callback(null, null);
      }
      callback(null, result.rows[0].gprkey);
    });
  },
  getAutocomplete: function (client, query, callback) {
    client.query('select acoword from autocomplete where acoword like $1 order by acoproductcount limit 10', [query + '%'], function (err, result) {
      if (err) {
        return callback(new MyError('ERROR', 'getAutocomplete', 'Error', { query: query }, err));
      }
      var r = [];
      if (result) {
        for (var i = 0; i < result.rows.length; i++) {
          r.push(result.rows[i].acoword);
        }
      }
      callback(null, r);
    });
  }
}
