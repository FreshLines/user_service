var grpc = require('grpc');



module.exports = function(config) {
    var grpc_config = function(config) {

console.log(config);
        var user_protobuff = grpc.load(config.root + '/app/proto_buffs/user.proto').user;

        var server =  { 
            getServer: getServer
        };

        /**
         * Get a new server with the handler functions in this file bound to the methods
         * it serves.
         * @return {Server} The new server object
         */
        function getServer() {
            var server = new grpc.Server();
            //Can we add these later?
            server.addProtoService(user_protobuff.User.service, {
                // setUser: setUser,
                // deleteUser: deleteUser,
                // listUsers: listUser
            });
            return server;
        }

        return server;
    }(config);
    return grpc_config;
}