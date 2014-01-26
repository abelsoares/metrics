var mongodb = require('mongodb');
var events = require('events');
var event = new events.EventEmitter();
var client = null;

exports.connection = function(options) {

  this.db           = options.db;
  this.host         = options.host || 'localhost';
  this.port         = options.port || mongodb.Connection.DEFAULT_PORT;
  
  var server = new mongodb.Server(this.host, this.port, { });
  new mongodb.Db(this.db, server, { safe: false, auto_reconnect: true }).open(function (err, c) {
    if (!err) {
      client = c;
      console.log('database connected');
      event.emit('connect');
    } else {
      console.log('database connection error', err);
      event.emit('error');
    }
  });
};

exports.get = function(fn) {
  if(client) {
    fn(client);
  } else {
    event.on('connect', function() {
      fn(client);
    });
  }
};