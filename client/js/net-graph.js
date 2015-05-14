'use strict';
var chartDrawer = require('./chart-drawer')
  , Graph = require('./graph')

function NetGraph(c3, el, getData, os) {
  if (!(this instanceof NetGraph)) return new NetGraph(c3, el, getData, os);
  Graph.call(this, c3, el, getData, os)
}
NetGraph.prototype = Object.create(Graph.prototype)
NetGraph.prototype.constructor = NetGraph;
NetGraph.prototype.topic = 'net';

NetGraph.prototype._draw = function _draw() {
  chartDrawer(this._c3, this._data, this._el)
    .draw('net/net-c2s')
    .draw('net/net-pipe')
    .draw('net/net-s2c')
    .draw('net/tcp-raw-c2s')
    .draw('net/tcp-raw-pipe')
    .draw('net/tcp-raw-s2c')
}

module.exports = NetGraph;
