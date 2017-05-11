// var express = require('express'),
//   users_router = express.Router();
  

// module.exports = function (app) {
//   app.use('/users', users_router);
// };
var grpc = require('grpc');
var _ = require('lodash');
var models;

module.exports = function (app) {
  models = app.settings.models;
  var routeServer = app.get('routeServer');
  console.log("okok");
  console.log(routeServer.handlers['/user.User/SetUser'].func)
  console.log("okok");
  routeServer.handlers['/user.User/SetUser'].func = setUser
  routeServer.handlers['/user.User/ListUsers'].func = listUsers
  routeServer.handlers['/user.User/DeleteUser'].func = deleteUser
};


function setUser(call,callback) {
  console.log("okokok");
  console.log(call.request);
  console.log("okokok");

  delete call.request['id'];

  var user = new models.instance.User(call.request);

  console.log(user.first_name);

  // console.log(grpc);
  user.save(function(err){
      if(err) {
          console.log(err);
          // res.sendStatus(500);
          // return;
          return grpc.status.UNKNOWN;
      }

      //Lets find the latest user now that its been inserted
      models.instance.User.find({email: user.email}, function(err, inserted_users){
          //user is an array of plain objects taken from the materialized view

          if(err) {
              console.log(err);
              // res.sendStatus(500);
              // return;
              return grpc.status.UNKNOWN;
          }

          
          UserResponse = {
            id: inserted_users[0].id + '',
            first_name: inserted_users[0].first_name,
            last_name: inserted_users[0].last_name,
            email: inserted_users[0].email
          }

          callback(null, UserResponse);
      });

  });




  

  

  // return user;

}

function deleteUser(call,callback) {
  console.log(call.request['id']);
  models.instance.User.findOne({id: models.uuidFromString(call.request['id'])}, function(err, user){
    if(err) {
      console.log(err);
      //TODO: better response codes for these items
      return grpc.status.UNKNOWN;
    }
    if(!user) {
      console.log(err);
      return grpc.status.UNKNOWN;
    }
    user.delete(function(err){
      if(err) {
        console.log(err);
        return grpc.status.UNKNOWN;
      }
    });

    DeletedResponse = {

    }
    
    callback(null, DeletedResponse);
  });

}


function listUsers(call,callback) {
   var query = {
    $limit:10
  };
  models.instance.User.find(query, function(err, users){
    if(err) {
        console.log(err);
        // res.sendStatus(500);
        // return;
        return grpc.status.UNKNOWN;
    }

    console.log(users);

    _.each(users, function(user) {
      console.log(JSON.stringify(user));
      // call.write(JSON.stringify(user));

      UserResponse = {
        id: user.id + '',
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      }

      call.write(UserResponse);
    });
    call.end();
  });
  
}


            // deleteUser: deleteUser,
            // listUsers: listUser

// // Index
// users_router.get('/', function (req, res, next) {
//   var query = {
//     $limit:10
//   };
//   req.app.settings.models.instance.User.find(query, function(err, users){
//     if(err) throw err;
//     //people is an array of model instances containing the persons with name `John`

//     res.writeHead(200, {"Content-Type": "application/json"});
//     res.end(JSON.stringify(users));

//   });

// });


// // Create
// users_router.post('/', function (req, res, next) {
//   var user = new req.app.settings.models.instance.User({
//       first_name: req.body.first_name,
//       last_name: req.body.last_name,
//       email: req.body.email
//   });

//   // console.log(req);
//   user.save(function(err){
//       if(err) {
//           console.log(err);
//           res.sendStatus(500);
//           return;
//       }
//       res.sendStatus(200);
//   });
// });

// // Create
// users_router.delete('/:id', function (req, res, next) {
//   req.app.settings.models.instance.User.findOne({id: req.app.settings.models.uuidFromString(req.params.id)}, function(err, user){
//     if(err) {
//       console.log(err);
//       res.sendStatus(500);
//       return;
//     }
//     if(!user) {
//       console.log(err);
//       res.sendStatus(400);
//       return;
//     }
//     user.delete(function(err){
//       if(err) {
//         console.log(err);
//         res.sendStatus(500);
//         return;
//       }
//     });
//     res.sendStatus(200);
//   });

// });
