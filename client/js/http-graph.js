'use strict';
var chartDrawer = require('./chart-drawer')
  , Graph = require('./graph')

function HttpGraph(c3, el, getData, os) {
  if (!(this instanceof HttpGraph)) return new HttpGraph(c3, el, getData, os);
  Graph.call(this, c3, el, getData, os)
}
HttpGraph.prototype = Object.create(Graph.prototype)
HttpGraph.prototype.constructor = HttpGraph;
HttpGraph.prototype.topic = 'http';

HttpGraph.prototype._draw = function _draw() {
  chartDrawer(this._c3, this._data, this._el)
    .draw('http/_chunky_http_client')
    .draw('http/chunked')
    .draw('http/client-request-body')
    .draw('http/cluster')
    .draw('http/end-vs-write-end')
    .draw('http/simple')
}

module.exports = HttpGraph;
