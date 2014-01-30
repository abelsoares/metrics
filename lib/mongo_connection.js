var mongodb = require('mongodb');
var events = require('events');
var event = new events.EventEmitter();
var client = null;

exports.connection = function(options) {

  this.db           = options.db;
  this.host         = options.host || 'localhost';
  this.port         = options.port || mongodb.Connection.DEFAULT_PORT;
  this.user         = options.user || 'admin';
  this.password     = options.password || 'admin';

  var server = new mongodb.Server(this.host, this.port, { });
  new mongodb.Db(this.db, server, { safe: true, auto_reconnect: true }).open(function (err, db) {
    if (!err) {
      db.authenticate(this.user, this.password,function(err,c){
        console.log(err);
        client = db;
        event.emit('connect');
      });
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