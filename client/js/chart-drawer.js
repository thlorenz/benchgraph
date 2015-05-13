'use strict';

// utility functions
function getCategories(item) {
  var config  = item.config
    , keys = Object.keys(config)
    , len = keys.length

  function stringify(acc, k, idx) {
    acc += k + ': ' + config[k]
    return idx === (len - 1) ? acc : acc +  ' | '
  }
  return keys.reduce(stringify, '');
}

function getColumnsFor(self) {
  // this is ugly, but reduce takes no `this` damnit!
  return function getColumnsWrap(acc, item) {
    return self._getColumns(acc, item);
  }
}

function attachNewElementTo(el, id) {
  var div = document.createElement('div')
  div.setAttribute('id', id)
  div.setAttribute('class', 'benchgraph-chart')
  el.appendChild(div)
  return div;
}

// Drawer
function ChartDrawer(c3, data, el) {
  if (!(this instanceof ChartDrawer)) return new ChartDrawer(c3, data, el);

  this._c3 = c3;
  this._data = data;
  this._el = el;
}

var proto = ChartDrawer.prototype;
module.exports = ChartDrawer;

proto.draw = function draw(benchmarkName) {
  this._benchmarkName = benchmarkName;
  var title = this._benchmarkName.split('/')[1]
  var columns = this._data.reduce(getColumnsFor(this), [])

  var categories = this._data[0][this._benchmarkName].map(getCategories)

  var chartData = {
      data: { columns: columns, type: 'bar' }
    , axis: {
        x: {
            type: 'category'
          , categories: categories
          , label: {
                text: title
              , position: 'inner-left'
            }
        }
      , y: {
          label: {
            text: 'operations/sec (larger is better)'
          , position: 'outer-middle'
          }
        }
      }
    , bindto: attachNewElementTo(this._el, this._benchmarkName)
    , bar: {
        width: { ratio: 0.4 }
      }
  }
  this._c3.generate(chartData);
  return this
}

proto._getColumns = function _getColumns(acc, item) {
  var dataPoints = item['buffers/buffer-creation'];
  function mapY(x) {
    return parseFloat(x.rate)
  }
  var row = [ item._version ]
    .concat(dataPoints.map(mapY))
  acc.push(row)
  return acc;
}
