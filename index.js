var interceptorWeb = require('./lib/webserver');
var launcher = require('missilecommand/launcher');

var webserver = new interceptorWeb(8250);
var commander = new launcher();
commander.connect();

var tracking = false;
var launcherReady = false;
var sensitivity = 20;

var location = {};
location.x = 0;
location.y = 0;

commander.reset(function() {
  console.log('launcher ready');
  launcherReady = true;
});

webserver.on('movement', function(data) {
  if (!launcherReady) {
    return;
  }

  if (!tracking) {
    //console.log('locked');
  }

  data = data || {};

  var deltaX = 160 - data.x;
  var deltaY = 120 - data.y;

  if (!tracking && (Math.abs(deltaX) > sensitivity || Math.abs(deltaY) > sensitivity)) {
    console.log('tracking %s:%s', deltaX, deltaY);
//    console.log(data);
    tracking = true;

    setTimeout(function() {
      tracking = false;


      var multiplier = data.width / 100;

      moveLauncherX(deltaX, deltaY, multiplier);

    }, 10);
  }
});

function moveLauncherX(deltaX, deltaY, multiplier) {
  var moveX = deltaX / sensitivity;

  if (Math.abs(moveX) >= 1) {
    if (moveX > 0) {
      console.log('moving left: ' + deltaX);
      commander.perform(launcher.commands.kLeft, moveX * multiplier, function() {
        moveLauncherY(deltaY, multiplier);
      });
    } else {
      console.log('moving right: ' + deltaX);
      commander.perform(launcher.commands.kRight, Math.abs(moveX * multiplier), function() {
        moveLauncherY(deltaY, multiplier);
      });
    }

    location.x += deltaX;
  } else {
    moveLauncherY(deltaY, multiplier);
  }
}

function moveLauncherY(deltaY, multiplier) {
  var moveY = deltaY / sensitivity;

  if (Math.abs(moveY) >= 1) {
    if (moveY > 0) {
      console.log('moving up: %s', deltaY * multiplier);
      commander.perform(launcher.commands.kUp, moveY);
    } else {
      console.log('moving down: %s', deltaY * multiplier);
      commander.perform(launcher.commands.kDown, moveY);
    }

    location.y += deltaY;
  }
}

webserver.on('fire', function(data) {
  commander.perform(launcher.commands.kFire);
});