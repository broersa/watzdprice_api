'use strict';

var ua = require('universal-analytics');

var uaCode;

module.exports = {
  init: function (trackingId) {
    uaCode = trackingId;
    return true;
  },
  getLogger: function () {
    return ua(uaCode, {https: true});
  }
}
