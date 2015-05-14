'use strict';

function getPrototypeName(obj) {
  if (typeof obj !== 'object' || obj === null) return '!not-an-object!';
  return Object.getPrototypeOf(obj).constructor.name;
}

function drawOn(self) {
  return function drawWrap() {
    self._draw();
    self._drawn = true;
  }
}

function Graph(c3, el, getData) {
  if (!(this instanceof Graph)) return new Graph(c3, el, getData);

  this._c3 = c3;
  this._el = el;
  this._getData = getData;
  this._data = null;
  this._drawn = false;
}

var proto = Graph.prototype;
proto.topic = 'PLEASE OVERRIDE prototype.topic'
module.exports = Graph;

proto._fetch = function fetch(cb) {
  var self = this;
  function ondata(err, res) {
    if (err) return console.error(err);
    self._data = res;
    cb()
  }
  this._getData(this.topic, ondata);
}

proto.draw = function draw() {
  var self = this;
  // we only need to draw once
  // this makes switching between benchmarks much faster after we drew each once
  if (self._drawn) return;
  if (!this._data) this._fetch(drawOn(this)); else drawOn(this);
}

proto._draw = function _draw() { throw new Error('_draw not implemented for ' + getPrototypeName(this) + '!') }
