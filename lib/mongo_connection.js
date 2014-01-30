var mongodb = require('mongodb');
var events = require('events');
var event = new events.EventEmitter();
var client = null;

exports.connection = function(options) {
  var self = this;
  this.db           = options.db;
  this.host         = options.host || 'localhost';
  this.port         = options.port || mongodb.Connection.DEFAULT_PORT;
  this.user         = options.user || 'admin';
  this.password     = options.password || 'admin';

  var server = new mongodb.Server(this.host, this.port, { });
  new mongodb.Db(this.db, server, { safe: true, auto_reconnect: true }).open(function (err, db) {
    if (!err) {
      db.authenticate(self.user, self.password,function(err,c){
        if(err) console.log(err);
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