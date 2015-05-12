'use strict';

function BufferGraph(Flotr, el, getData) {
  if (!(this instanceof BufferGraph)) return new BufferGraph(Flotr, el, getData);
  this.FLotr = Flotr;
  this._el = el;
  this._getData = getData;
  this._topic = 'buffer';
  this._data = null;
}

var proto = BufferGraph.prototype;
module.exports = BufferGraph;

proto._fetch = function fetch(cb) {
  var self = this;
  function ondata(err, res) {
    if (err) return console.error(err);
    self._data = res;
    cb()
  }
  this._getData(this._topic, ondata);
}

proto.draw = function draw() {
  var self = this;
  if (!this._data) this._fetch(doDraw); else doDraw();

  function doDraw() {
    console.dir(self._data);
  }
}
