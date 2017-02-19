'use strict';

module.exports = function MyError(code, method, message, params, error) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.code = code;
  this.method = method;
  this.message = message;
  this.params = params;
  this.error = error;
  this.print = function () {
    return 'MyError - ' + this.code + ' - ' + this.method + ' - ' + this.message + ' - ' + JSON.stringify(this.params) + ' ---> ' + ((!this.error)?'':((this.error instanceof MyError)?this.error.print():this.error.toString()));
  }
};

require('util').inherits(module.exports, Error);
