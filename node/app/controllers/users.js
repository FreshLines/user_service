var express = require('express'),
  users_router = express.Router();
  

module.exports = function (app) {
  app.use('/users', users_router);
};


// Index
users_router.get('/', function (req, res, next) {
  var query = {
    $limit:10
  };
  req.app.settings.models.instance.User.find(query, function(err, users){
    if(err) throw err;
    //people is an array of model instances containing the persons with name `John`

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(users));

  });

});


// Create
users_router.post('/', function (req, res, next) {
  var user = new req.app.settings.models.instance.User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
  });

  // console.log(req);
  user.save(function(err){
      if(err) {
          console.log(err);
          res.sendStatus(500);
          return;
      }
      res.sendStatus(200);
  });
});

// Create
users_router.delete('/:id', function (req, res, next) {
  req.app.settings.models.instance.User.findOne({id: req.app.settings.models.uuidFromString(req.params.id)}, function(err, user){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    if(!user) {
      console.log(err);
      res.sendStatus(400);
      return;
    }
    user.delete(function(err){
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
    });
    res.sendStatus(200);
  });

});
