

var express = require('express'),
  spdy = require('spdy'),
  config = require('./config/config'),
  glob = require('glob'),
  fs = require('fs'),
  path = require('path');


var models = require('express-cassandra');

//Tell express-cassandra to use the models-directory, and
//use bind() to load the models using cassandra configurations.
models.setDirectory( __dirname + '/app/models').bind(
    {
        clientOptions: {
          contactPoints: config.contactPoints,
          protocolOptions: { port: 9042 },
          keyspace: 'users_service',
          queryOptions: {consistency: models.consistencies.one}
        },
        ormOptions: {
            //If your keyspace doesn't exist it will be created automatically
            //using the default replication strategy provided here.
            defaultReplicationStrategy : {
                class: 'SimpleStrategy',
                replication_factor: 2
            },
            migration: 'safe',
            createKeyspace: true
        }
    },
    function(err) {
        if(err) console.log(err.message);
        else console.log(models.timeuuid());
    }
);

var model_files = glob.sync(config.root + '/app/models/*.js');
model_files.forEach(function (model) {
  require(model);
});
var app = express();

app.set('models', models); 


module.exports = require('./config/express')(app, config);


const options = {
    // we don't need an ssl option
    // key: fs.readFileSync('./http2-express/server.key'),
    // cert:  fs.readFileSync('./http2-express/server.crt')
    spdy: {
        plain: true,
        ssl: false
    }
}

spdy
  .createServer(options, app)
  .listen(config.port, (error) => {
    if (error) {
      console.error(error)
      return process.exit(1)
    } else {
      console.log('Listening on port: ' + config.port + '.')
    }
  })

