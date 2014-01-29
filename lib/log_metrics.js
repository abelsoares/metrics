var mongodb = require('mongodb');
var db = require('../lib/mongo_connection');

var Track = exports = module.exports = function Track(options){
  options = options || {};
  if (!options.db) {
    throw new Error('Cannot log to MongoDB without database name.');
  }
  var self = this;

  this.collection   = options.collection || 'log_analytics';

  var MongoConnection = db.connection( options );

  db.get(function(client) {
    items = new mongodb.Collection(client, self.collection);
  });
  
};

Track.prototype = {
  track: function(trackingObj, cb){
    var self = this;
    if(!trackingObj.user_id || !trackingObj.event)  { 
      cb("Missing params in tracking object.", false); return; 
    }
    
    var time = +new Date;
    var now = new Date();

    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var h = now.getHours() + 1;
    var w = this.getWeek(now);

    var time_bucket = [
                        y+"-"+m+"-"+d+" "+h+"-hour",
                        y+"-"+m+"-"+d+"-day",
                        y+"-"+w+"-week",
                        y+"-"+m+"-month",
                        y+"-year"
                      ];
    var data = { "session": trackingObj.session, 
                 "user_id": trackingObj.user_id,
                 "event": trackingObj.event, 
                 "time_bucket": time_bucket,
                 "created_at": time };

    // then anywhere in your code
    db.get(function() {
      items.insert(data, {safe:true}, function(err, result) {
        if(err) { cb(err, false); return; }
        cb( null, true );
      });
    });
  },

  getWeek: function( d ) { 
   
    // Create a copy of this date object  
    var target  = new Date(d.valueOf());  
    
    // ISO week date weeks start on monday  
    // so correct the day number  
    var dayNr   = (d.getDay() + 6) % 7;  
   
    // Set the target to the thursday of this week so the  
    // target date is in the right year  
    target.setDate(target.getDate() - dayNr + 3);  
   
    // ISO 8601 states that week 1 is the week  
    // with january 4th in it  
    var jan4    = new Date(target.getFullYear(), 0, 4);  
   
    // Number of days between target date and january 4th  
    var dayDiff = (target - jan4) / 86400000;    
   
    // Calculate week number: Week 1 (january 4th) plus the    
    // number of weeks between target date and january 4th    
    var weekNr = 1 + Math.ceil(dayDiff / 7);    
   
    return weekNr;    
   
  }
};

/*
// LIKE
{ 
  "session": "session_id",
  "user_id": user_id,
  "event": "like", 
  "time_bucket": time_bucket,
  "created_at": time,
  "properties": {
    "":
  } 
}

// FOLLOW
{ 
  "session": "session_id",
  "user_id": user_id,
  "event": "follow", 
  "time_bucket": time_bucket,
  "created_at": time,
  "properties": {
    "":
  } 
}

// CREATE COLLECTION
{ 
  "session": "session_id",
  "user_id": user_id,
  "event": "create_collection", 
  "time_bucket": time_bucket,
  "created_at": time,
  "properties": {
    "":
  } 
}

// CREATE ITEM
{ 
  "session": "session_id",
  "user_id": user_id,
  "event": "create_item", 
  "time_bucket": time_bucket,
  "created_at": time,
  "properties": {
    "collection_id": id
  }
}

// SHARE
{ 
  "session": "session_id",
  "user_id": user_id,
  "event": "share", 
  "time_bucket": time_bucket,
  "created_at": time,
  "properties": {
    "type": "" // item, collection, profile
  }
}

// VIEW COLLECTION
{ 
  "session": "session_id",
  "user_id": user_id,
  "event": "view_collection", 
  "time_bucket": time_bucket,
  "created_at": time,
  "properties": {
  }
}

// VIEW ITEM
{ 
  "session": "session_id",
  "user_id": user_id,
  "event": "view_item", 
  "time_bucket": time_bucket,
  "created_at": time,
  "properties": {
  }
}

// VIEW PROFILE
{ 
  "session": "session_id",
  "user_id": user_id,
  "event": "view_profile", 
  "time_bucket": time_bucket,
  "created_at": time,
  "properties": {
  }
}

// DELETE COLLECTION
{ 
  "session": "session_id",
  "user_id": user_id,
  "event": "delete_collection", 
  "time_bucket": time_bucket,
  "created_at": time,
  "properties": {
  }
}

// DELETE ITEM
{ 
  "session": "session_id",
  "user_id": user_id,
  "event": "delete_item", 
  "time_bucket": time_bucket,
  "created_at": time,
  "properties": {
  }
}

// CHANGE PROFILE
{ 
  "session": "session_id",
  "user_id": user_id,
  "event": "change_profile", 
  "time_bucket": time_bucket,
  "created_at": time,
  "properties": {
  }
}

// CHANGE IMAGE
{ 
  "session": "session_id",
  "user_id": user_id,
  "event": "change_profile_image", 
  "time_bucket": time_bucket,
  "created_at": time,
  "properties": {
  }
}


*/