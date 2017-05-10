// var Cassandra = require('express-cassandra');
// var models = Cassandra.createClient({
//     clientOptions: {
//         contactPoints: ['127.0.0.1'],
//         protocolOptions: { port: 9042 },
//         keyspace: 'users_service',
//         queryOptions: {consistency: Cassandra.consistencies.one}
//     },
//     ormOptions: {
//         defaultReplicationStrategy : {
//             class: 'SimpleStrategy',
//             replication_factor: 2
//         },
//         migration: 'safe',
//         createKeyspace: true
//     }
// });

// models.connect(function (err) {
//     if (err) throw err;

//     var User = models.loadSchema('users', {
//         fields:{
//             id  : "uuid",
//             first_name : "text",
//             last_name : "text",
//             email     : "text"
//         },
//         key:["id"]
//     }, function(err, UserModel){
//         //the table in cassandra is now created
//         //the models.instance.Person, UserModel or MyModel can now be used
//         console.log(models.instance.Person);
//         console.log(models.instance.Person === UserModel);
//         console.log(models.instance.Person === MyModel);
//     });
// });



// var User = function (data) {
//   this._data = data;
// }

// User.prototype.data = {}

// User.prototype = {
//   get first_name() {
//     return this._data.first_name;
//   }, 
//   set first_name(first_name) {
//     this._data.first_name = first_name;
//   }
// }

// User.all = function (id, callback) {
//   db.get('users', {id: id}).run(function (err, data) {
//     if (err) return callback(err);
//     callback(null, new User(data));
//   });
// }

// User.findById = function (id, callback) {
//   db.get('users', {id: id}).run(function (err, data) {
//     if (err) return callback(err);
//     callback(null, new User(data));
//   });
// }