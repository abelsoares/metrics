var LogMetrics = require('../lib/log_metrics')
,   log_metrics = new LogMetrics( { db: 'c_box_local' } );
var assert = require("assert");


describe('Test Metrics', function(){
  describe('Track Event', function(){
    it('should return true if params OK', function(done){
      log_metrics.track( {'user_id': 'user_id', event: 'test_event_from_test'}, function(err, success){
        assert.equal(success, true);
        done();  
      });
    });

    it('should return false if params NOT OK', function(done){
      log_metrics.track( {'user_id': '', event: 'test_event_from_test'}, function(err, success){
        assert.equal(success, false);
        done();  
      });
    });

    it('should return false if params NOT OK', function(done){
      log_metrics.track( {'user_id': 'user_id', event: ''}, function(err, success){
        assert.equal(success, false);
        done();  
      });
    });
  });
});