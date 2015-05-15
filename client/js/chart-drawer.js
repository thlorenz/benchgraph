'use strict'
var CHUNK_SIZE = 8

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

function chunkify(arr, size) {
  var chunks = []
  while (arr.length > 0)
    chunks.push(arr.splice(0, size))

  return chunks
}

function chunkifyColumns(col) {
  var chunks = chunkify(col, CHUNK_SIZE)
  function prependVersion(c) {
    return [ col._version ].concat(c)
  }
  return chunks.map(prependVersion);
}

function prependVersion(row) {
  return [ row._version ].concat(row);
}

function chunkifyColumns(cols) {
  function chunkifyRow(row) {
    var len = row.length, chunks = []
    if (len <= CHUNK_SIZE) return [ prependVersion(row) ];
    var idx = 0, chunk
    while (idx < len) {
      chunk = row.slice(idx, idx + CHUNK_SIZE)
      chunk._version = row._version
      chunks.push(prependVersion(chunk))
      idx += CHUNK_SIZE
    }
    return chunks
  }

  return cols.map(chunkifyRow);
}

function graphify(acc, chunks) {
  function push(chunk, idx) {
    if (!acc[idx]) acc[idx] = [];
    acc[idx].push(chunk);
  }
  chunks.forEach(push);
  return acc;
}

function chunkifyCategories(categories) {
  var len = categories.length, chunks = []
  if (len <= CHUNK_SIZE) return [ categories ];
  var idx = 0, chunk
  while (idx < len) {
    chunks.push(categories.slice(idx, idx + CHUNK_SIZE))
    idx += CHUNK_SIZE
  }
  return chunks
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

proto._drawGraph = function _drawGraph(columns, categories, title, idx, len) {
  if (len > 1) title += ' (' + (idx + 1) + '/' + len + ')'
  var chartData = {
      data: { columns: columns, type: 'bar' }
    , size: { width: 400, height: 250 }
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
    , bindto: attachNewElementTo(this._el, this._benchmarkName + '-' + idx)
    , bar: {
        width: { ratio: 0.7 }
      }
    , legend: {
        position: 'inset'
      , inset: { anchor: 'top-right' }
      }
  }
  this._c3.generate(chartData);
}

proto.draw = function draw(benchmarkName) {
  this._benchmarkName = benchmarkName;
  var title = this._benchmarkName.split('/')[1]

  var categories = this._getCategories()
  var columns = this._data.reduce(getColumnsFor(this), [])

  var chunkifiedColumns = chunkifyColumns(columns);
  var graphs = chunkifiedColumns.reduce(graphify, []);
  var chunkifiedCategories = chunkifyCategories(categories);

  for (var i = 0, len = graphs.length; i < len; i++) {
    this._drawGraph(graphs[i], chunkifiedCategories[i], title, i, len);
  }
  return this
}

proto._getCategories = function _getCategories() {
  var i, len, items;
  // not all versions will have had data so the data item is entirely missing for them
  // here we find the first one that has data and pull the category names out of it
  // category names are the same for all versions
  for (i = 0, len = this._data.length; i < len; i++) {
    items = this._data[i] && this._data[i][this._benchmarkName]
    if (items) return items.map(getCategories)
  }
  // if we couln't find a version with data we can't provide any names
  return []
}

proto._getColumns = function _getColumns(acc, item) {
  var dataPoints = item[this._benchmarkName];

  function mapY(x) {
    return parseFloat(x.rate)
  }

  var row = [ item._version ];
  // some benchmarks don't work for older versions, so we won't
  // have any data for those
  if (!dataPoints || !dataPoints.length) row = []
  else row = dataPoints.map(mapY)

  row._version = item._version
  acc.push(row)
  return acc;
}
