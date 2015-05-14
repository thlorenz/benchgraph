'use strict';
var chartDrawer = require('./chart-drawer')
  , Graph = require('./graph')

function CryptoGraph(c3, el, getData) {
  if (!(this instanceof CryptoGraph)) return new CryptoGraph(c3, el, getData);
  Graph.call(this, c3, el, getData)
}
CryptoGraph.prototype = Object.create(Graph.prototype)
CryptoGraph.prototype.constructor = CryptoGraph;
CryptoGraph.prototype.topic = 'crypto';

CryptoGraph.prototype._draw = function _draw() {
  chartDrawer(this._c3, this._data, this._el)
    .draw('crypto/aes-gcm-throughput')
    .draw('crypto/cipher-stream')
    .draw('crypto/hash-stream-creation')
    .draw('crypto/hash-stream-throughput')
//    .draw('crypto/rsa-encrypt-decrypt-throughput') -- only io.js data
    .draw('crypto/rsa-sign-verify-throughput')
}

module.exports = CryptoGraph;
