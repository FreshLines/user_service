/*
 *
 * Copyright 2015, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

var PROTO_PATH = __dirname + '/../app/proto_buffs/user.proto';

var async = require('async');
var fs = require('fs');
var parseArgs = require('minimist');
var path = require('path');
var _ = require('lodash');
var grpc = require('grpc');
var user = grpc.load(PROTO_PATH).user;
var client = new user.User('localhost:50051',
                                       grpc.credentials.createInsecure());

var users_to_delete = [];

console.log(client);

var COORD_FACTOR = 1e7;

/**
 * Run the getuser demo. Calls getuser with a point known to have a
 * user and a point known not to have a user.
 * @param {function} callback Called when this demo is complete
 */
function runSetUser(callback) {
  var next = _.after(2, callback);
  function userCallback(error, user) {
    if (error) {
        console.log(error);
      callback(error);
      return;
    }
    console.log(user);
    if (user.first_name === '') {
      console.log('Found no user');
    } else {
      users_to_delete.push(user);
      console.log('Found user after create called ' + user.first_name);
    }
    next();
  }
  user1 = {
      first_name: 'Fred',
      last_name: 'Flinstone',
      email: 'fred.flinstone@gmail.com'
  }
  user2 = {
      first_name: 'Barney',
      last_name: 'Rubble',
      email: 'barney.rubble@gmail.com'
  }
  client.setUser(user1, userCallback);
  client.setUser(user2, userCallback);
}

/**
 * Run the listusers demo. Calls listusers with a rectangle containing all
 * of the users in the pre-generated database. Prints each response as it
 * comes in.
 * @param {function} callback Called when this demo is complete
 */
function runListUsers(callback) {
  var call = client.listUsers({});
  call.on('data', function(user) {
      console.log('Found user in list called ' + user.first_name);
  });
  call.on('end', callback);
}

/**
 * Run the getuser demo. Calls getuser with a point known to have a
 * user and a point known not to have a user.
 * @param {function} callback Called when this demo is complete
 */
function runDeleteUser(callback) {
  var next = _.after(2, callback);
  function userCallback(error, user) {
    if (error) {
        console.log(error);
      callback(error);
      return;
    }
    console.log('successfully deleted the user');
    next();
  }
  console.log("aaaaaaaaaaaaaaaaaa");
  console.log(users_to_delete);

  _.each(users_to_delete,function(user) {
    console.log(user);
    client.deleteUser(user, userCallback);
  });
}

// /**
//  * Run the recordRoute demo. Sends several randomly chosen points from the
//  * pre-generated user database with a variable delay in between. Prints the
//  * statistics when they are sent from the server.
//  * @param {function} callback Called when this demo is complete
//  */
// function runRecordRoute(callback) {
//   var argv = parseArgs(process.argv, {
//     string: 'db_path'
//   });
//   fs.readFile(path.resolve(argv.db_path), function(err, data) {
//     if (err) {
//       callback(err);
//       return;
//     }
//     var user_list = JSON.parse(data);

//     var num_points = 10;
//     var call = client.recordRoute(function(error, stats) {
//       if (error) {
//         callback(error);
//         return;
//       }
//       console.log('Finished trip with', stats.point_count, 'points');
//       console.log('Passed', stats.user_count, 'users');
//       console.log('Travelled', stats.distance, 'meters');
//       console.log('It took', stats.elapsed_time, 'seconds');
//       callback();
//     });
//     /**
//      * Constructs a function that asynchronously sends the given point and then
//      * delays sending its callback
//      * @param {number} lat The latitude to send
//      * @param {number} lng The longitude to send
//      * @return {function(function)} The function that sends the point
//      */
//     function pointSender(lat, lng) {
//       /**
//        * Sends the point, then calls the callback after a delay
//        * @param {function} callback Called when complete
//        */
//       return function(callback) {
//         console.log('Visiting point ' + lat/COORD_FACTOR + ', ' +
//             lng/COORD_FACTOR);
//         call.write({
//           latitude: lat,
//           longitude: lng
//         });
//         _.delay(callback, _.random(500, 1500));
//       };
//     }
//     var point_senders = [];
//     for (var i = 0; i < num_points; i++) {
//       var rand_point = user_list[_.random(0, user_list.length - 1)];
//       point_senders[i] = pointSender(rand_point.location.latitude,
//                                      rand_point.location.longitude);
//     }
//     async.series(point_senders, function() {
//       call.end();
//     });
//   });
// }

// /**
//  * Run the routeChat demo. Send some chat messages, and print any chat messages
//  * that are sent from the server.
//  * @param {function} callback Called when the demo is complete
//  */
// function runRouteChat(callback) {
//   var call = client.routeChat();
//   call.on('data', function(note) {
//     console.log('Got message "' + note.message + '" at ' +
//         note.location.latitude + ', ' + note.location.longitude);
//   });

//   call.on('end', callback);

//   var notes = [{
//     location: {
//       latitude: 0,
//       longitude: 0
//     },
//     message: 'First message'
//   }, {
//     location: {
//       latitude: 0,
//       longitude: 1
//     },
//     message: 'Second message'
//   }, {
//     location: {
//       latitude: 1,
//       longitude: 0
//     },
//     message: 'Third message'
//   }, {
//     location: {
//       latitude: 0,
//       longitude: 0
//     },
//     message: 'Fourth message'
//   }];
//   for (var i = 0; i < notes.length; i++) {
//     var note = notes[i];
//     console.log('Sending message "' + note.message + '" at ' +
//         note.location.latitude + ', ' + note.location.longitude);
//     call.write(note);
//   }
//   call.end();
// }

/**
 * Run all of the demos in order
 */
function main() {
  async.series([
    runSetUser,
    runListUsers,
    runDeleteUser,
    // runRecordRoute,
    // runRouteChat
  ]);
}

if (require.main === module) {
  main();
}

exports.runSetUser = runSetUser;

exports.runListUsers = runListUsers;

exports.runDeleteUser = runDeleteUser;