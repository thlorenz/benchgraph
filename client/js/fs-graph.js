'use strict';
var chartDrawer = require('./chart-drawer')
  , Graph = require('./graph')

function FsGraph(c3, el, getData) {
  if (!(this instanceof FsGraph)) return new FsGraph(c3, el, getData);
  Graph.call(this, c3, el, getData)
}
FsGraph.prototype = Object.create(Graph.prototype)
FsGraph.prototype.constructor = FsGraph;
FsGraph.prototype.topic = 'fs';

FsGraph.prototype._draw = function _draw() {
  chartDrawer(this._c3, this._data, this._el)
    .draw('fs/read-stream-throughput')
    .draw('fs/readfile')
    .draw('fs/write-stream-throughput')
}

module.exports = FsGraph;
