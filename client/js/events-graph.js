'use strict';
var chartDrawer = require('./chart-drawer')
  , Graph = require('./graph')

function EventsGraph(c3, el, getData, os) {
  if (!(this instanceof EventsGraph)) return new EventsGraph(c3, el, getData, os);
  Graph.call(this, c3, el, getData, os)
}
EventsGraph.prototype = Object.create(Graph.prototype)
EventsGraph.prototype.constructor = EventsGraph;
EventsGraph.prototype.topic = 'events';

EventsGraph.prototype._draw = function _draw() {
  chartDrawer(this._c3, this._data, this._el)
    .draw('events/ee-add-remove')
    .draw('events/ee-emit-multi-args')
    .draw('events/ee-emit')
    .draw('events/ee-listener-count')
    .draw('events/ee-listeners-many')
    .draw('events/ee-listeners')
}

module.exports = EventsGraph;
