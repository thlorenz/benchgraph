'use strict';

function BufferGraph(c3, el, getData) {
  if (!(this instanceof BufferGraph)) return new BufferGraph(c3, el, getData);
  this.c3 = c3;
  this._el = el;
  this._getData = getData;
  this._topic = 'buffer';
  this._data = null;
}

var proto = BufferGraph.prototype;
module.exports = BufferGraph;

proto._fetch = function fetch(cb) {
  var self = this;
  function ondata(err, res) {
    if (err) return console.error(err);
    self._data = res;
    cb()
  }
  this._getData(this._topic, ondata);
}

proto.draw = function draw() {
  var self = this;
  if (!this._data) this._fetch(doDraw); else doDraw();

  function doDraw() {
    console.dir(self._data);
    self._drawCreation();
  }
}

function getColumns(acc, item) {
  var dataPoints = item['buffers/buffer-creation'];
  function mapY(x) {
    return parseFloat(x.rate)
  }
  var row = [ item._version ]
    .concat(dataPoints.map(mapY))
  acc.push(row)
  return acc;
}

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

proto._drawCreation = function _drawCreation() {
  var columns = this._data.reduce(getColumns, [])
  var categories = this._data[0]['buffers/buffer-creation'].map(getCategories)
  var chartData = {
      data: { columns: columns, type: 'bar' }
    , axis: {
        x: {
            type: 'category'
          , categories: categories
          , label: {
                text: 'buffer-creation'
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
    , bindto: this._el
    , bar: {
        width: { ratio: 0.5 }
      }
    }
  this.c3.generate(chartData);
}

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}
/*var data =  [
    require('../../data/buffer-iojs-v2.0.1.json')
  , require('../../data/buffer-node-v0.12.2.json')
  , require('../../data/buffer-node-v0.10.38.json')
]

var res = data.reduce(getColumns, [])*/
