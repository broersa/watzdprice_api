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
        key: parseInt(result.rows[0].prokey),
        id: result.rows[0].proid,
        name: result.rows[0].proname,
        shop: result.rows[0].proshop,
        brand: result.rows[0].probrand,
        ean: result.rows[0].proean,
        category: result.rows[0].procategory,
        created: moment(result.rows[0].procreated),
        lastupdate: moment(result.rows[0].prolastupdate),
        price: parseFloat(result.rows[0].proprice),
        description: result.rows[0].prodescription,
        url: result.rows[0].prourl,
        image: result.rows[0].proimage
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
