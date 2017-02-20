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
  }
}
