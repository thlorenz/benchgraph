'use strict';
var chartDrawer = require('./chart-drawer')

function BufferGraph(c3, el, getData) {
  if (!(this instanceof BufferGraph)) return new BufferGraph(c3, el, getData);
  this._c3 = c3;
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
    chartDrawer(self._c3, self._data, self._el)
      .draw('buffers/buffer-creation')
      .draw('buffers/buffer-compare')
//      .draw('buffers/buffer-iterate')
      .draw('buffers/buffer-read')
      .draw('buffers/buffer-write')
      .draw('buffers/dataview-set')
      .draw('buffers/buffer-base64-encode')
  }
}
