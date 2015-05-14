'use strict';
var chartDrawer = require('./chart-drawer')
  , Graph = require('./graph')

function BufferGraph(c3, el, getData) {
  if (!(this instanceof BufferGraph)) return new BufferGraph(c3, el, getData);
  Graph.call(this, c3, el, getData)
}
BufferGraph.prototype = Object.create(Graph.prototype)
BufferGraph.prototype.constructor = BufferGraph;
BufferGraph.prototype.topic = 'buffers';

BufferGraph.prototype._draw = function _draw() {
  chartDrawer(this._c3, this._data, this._el)
    .draw('buffers/buffer-creation')
    .draw('buffers/buffer-compare')
    .draw('buffers/buffer-read')
    .draw('buffers/buffer-write')
    .draw('buffers/dataview-set')
    .draw('buffers/buffer-base64-encode')
}

module.exports = BufferGraph;
