var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'node'
    },
    port: process.env.PORT || 3000,
    // db: 'mongodb://localhost/node-development'
    contactPoints: ['127.0.0.1']
  },

  test: {
    root: rootPath,
    app: {
      name: 'node'
    },
    port: process.env.PORT || 3000,
    // db: 'mongodb://localhost/node-test'
    contactPoints: ['127.0.0.1']
  },

  production: {
    root: rootPath,
    app: {
      name: 'node'
    },
    port: process.env.PORT || 50051,
    // db: 'mongodb://localhost/node-production'
    contactPoints: ['10.0.2.2'] //we are using minikube, minkube is a virtualbox vm 10.0.2.2 will bring us back to the mac
  }
};

module.exports = config[env];
