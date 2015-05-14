'use strict';
var chartDrawer = require('./chart-drawer')
  , Graph = require('./graph')

function BuffersGraph(c3, el, getData) {
  if (!(this instanceof BuffersGraph)) return new BuffersGraph(c3, el, getData);
  Graph.call(this, c3, el, getData)
}
BuffersGraph.prototype = Object.create(Graph.prototype)
BuffersGraph.prototype.constructor = BuffersGraph;
BuffersGraph.prototype.topic = 'buffers';

BuffersGraph.prototype._draw = function _draw() {
  chartDrawer(this._c3, this._data, this._el)
    .draw('buffers/buffer-creation')
    .draw('buffers/buffer-compare')
    .draw('buffers/buffer-read')
    .draw('buffers/buffer-write')
    .draw('buffers/dataview-set')
    .draw('buffers/buffer-base64-encode')
}

module.exports = BuffersGraph;
