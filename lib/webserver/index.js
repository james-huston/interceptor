var connect = require('connect');
var io = require('socket.io');
var fs = require('fs');
var events = require('events');
var util = require('util');

exports = module.exports = InterceptorWeb;

function InterceptorWeb(port) {
  this.port = port || 8300;

  this.webServer = connect.createServer(
    connect.static('./web')
  ).listen(this.port);
  this.socketServer = io.listen(this.webServer);

  this.socketServer.on('connection', this.socketHandler.bind(this));

  events.EventEmitter.call(this);
}

util.inherits(InterceptorWeb, events.EventEmitter);

InterceptorWeb.prototype.socketHandler = function (socket) {
  var self = this;
  socket.on('movement', function (data) {
    self.emit('movement', data);
  });

  socket.on('fire', function(data) {
    self.emit('fire', data);
  });
};
