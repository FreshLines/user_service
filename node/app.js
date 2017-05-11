

var express = require('express'),
  spdy = require('spdy'),
  config = require('./config/config'),
  glob = require('glob'),
  fs = require('fs'),
  path = require('path'),
  grpc = require('grpc');
  
var grpc_config = require('./config/grpc.js')(config);


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
console.log(grpc_config.getServer);

var routeServer = grpc_config.getServer();

console.log(routeServer);

app.set('routeServer', routeServer); 

console.log(app.models);
console.log(app.routeServer);

console.log(app.get('routeServer'));


//TODO:  Get rid of express completely.
//For sake of demo leveraging for collecting models and controllers
module.exports = require('./config/express')(app, config);


// const options = {
//     // we don't need an ssl option
//     // key: fs.readFileSync('./http2-express/server.key'),
//     // cert:  fs.readFileSync('./http2-express/server.crt')
//     spdy: {
//         plain: true,
//         ssl: false
//     }
// }

// spdy
//   .createServer(options, app)
//   .listen(config.port, (error) => {
//     if (error) {
//       console.error(error)
//       return process.exit(1)
//     } else {
//       console.log('Listening on port: ' + config.port + '.')
//     }
//   })


if (require.main === module) {
  // If this is run as a script, start a server on an unused port
  
  routeServer.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  // var argv = parseArgs(process.argv, {
  //   string: 'db_path'
  // });
  // fs.readFile(path.resolve(argv.db_path), function(err, data) {
  //   if (err) throw err;
  //   feature_list = JSON.parse(data);
  //   routeServer.start();
  // });
  console.log('Listening on port: 50051')
  routeServer.start();
}

