/* jshint strict:false */
/* global io, rocketInfo */

var socket = io.connect();

var chartEl = document.querySelector('#chart');
var logEl = document.querySelector('#msgs');

var info = rocketInfo(chartEl, logEl);

// info.chart.addData(altitude, time);
// info.chart.addMessage(altitude, time, message);
// info.chart.reset();
// info.chart.baseAlt(altitude);

// info.log.append(message, time);
// info.log.clear();

document.querySelector('#log a').addEventListener('click', info.log.clear);
document.querySelector('#chart a').addEventListener('click', info.chart.reset);

document.querySelector('#reset').addEventListener('click', reset);
document.querySelector('#activate').addEventListener('click', activate);
document.querySelector('#parachute').addEventListener('click', deployParachute);

var recentAlt = 0;

socket.on('ready', function (data) {
  info.log.append('Launcher Ready!', new Date());
});

socket.on('hello', function(data) {
  info.log.append('Hello, Rocket!', new Date());
  socket.emit('start', {
    dataInterval: 100
  });
});

socket.on('reset', function(data) {
  info.log.append('Reset: ' + data, new Date());
  if (data !== undefined) info.chart.baseAlt(data);
});

socket.on('activate', function() {
  info.log.append('Ready to launch', new Date());
});

socket.on('data', function (data) {
  if (data) {
    info.chart.addData(data, new Date());
    recentAlt = data.alt;
  }
});

socket.on('armed', function () {
  info.log.append('Parachute Armed', new Date());
  info.chart.addMessage(recentAlt, new Date(), 'Armed');
});

socket.on('maxAltitude', function (data) {
  info.log.append('Max Altitude: ' + data, new Date());
});

socket.on('parachute', function (data) {
  info.log.append('Deploying Parachute at ' + data, new Date());
  info.chart.addMessage(data.alt, new Date(), 'Parachute');
});

socket.on('testModeEnabled', function () {
  info.log.append('Test mode enabled', new Date());
});

socket.on('testModeDisabled', function () {
  info.log.append('Test mode disabled', new Date());
});


function deployParachute () {
	socket.emit('parachute');
}

function reset() {
	socket.emit('reset');
}

function activate() {
    socket.emit('activate');
}

function servoAngles(init, release) {
	socket.emit('servoAngles', {init:init, release:release});
}
