var LogMetrics = require('../lib/log_metrics')
  , log_metrics = new LogMetrics( { db: 'c_box_local' } );

log_metrics.track( {'user_id': 'user_id', event: 'test_event'} );
