'use strict';
var chartDrawer = require('./chart-drawer')
  , Graph = require('./graph')

function ArraysGraph(c3, el, getData) {
  if (!(this instanceof ArraysGraph)) return new ArraysGraph(c3, el, getData);
  Graph.call(this, c3, el, getData)
}
ArraysGraph.prototype = Object.create(Graph.prototype)
ArraysGraph.prototype.constructor = ArraysGraph;
ArraysGraph.prototype.topic = 'arrays';

ArraysGraph.prototype._draw = function _draw() {
  chartDrawer(this._c3, this._data, this._el)
    .draw('arrays/var-int')
    .draw('arrays/zero-float')
    .draw('arrays/zero-int')
}

module.exports = ArraysGraph;
