'use strict';
var chartDrawer = require('./chart-drawer')
  , Graph = require('./graph')

function TlsGraph(c3, el, getData) {
  if (!(this instanceof TlsGraph)) return new TlsGraph(c3, el, getData);
  Graph.call(this, c3, el, getData)
}
TlsGraph.prototype = Object.create(Graph.prototype)
TlsGraph.prototype.constructor = TlsGraph;
TlsGraph.prototype.topic = 'tls';

TlsGraph.prototype._draw = function _draw() {
  chartDrawer(this._c3, this._data, this._el)
    .draw('tls/throughput')
    .draw('tls/tls-connect')
}

module.exports = TlsGraph;
