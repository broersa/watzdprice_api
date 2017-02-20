var elasticsearch = require('elasticsearch');
var MyError = require('../MyError.js');

var url;
var index;
var query;

module.exports = {
  init: function (elasticUrl, elasticIndex, elasticQuery) {
    url = elasticUrl;
    index = elasticIndex;
    query = elasticQuery;
    return true;
  },
  startSession: function() {
    return new elasticsearch.Client({
      host: url
    });
  },
  searchProducts: function (client, q, cb) {
    var qobject = JSON.parse(query.replace('^^^query^^^', q));
    client.search({
      index: index,
      body: {
        query: qobject
      }
    }, function (err, result) {
      if (err) {
        return cb(new MyError("ERROR", "searchProducts", "Error", {q: q}, err));
      }
      if (result.hits.total <= 0) {
        return cb(null, null);
      }
      var products = [];
      for (var i = 0; i < result.hits.hits.length; i++) {
        products.push({id: result.hits.hits[i]._id, name: result.hits.hits[i]._source.name});
      }

      return cb(null, products);
    });
  }
}
