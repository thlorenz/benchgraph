'use strict';

var c3           = require('c3')
  , xhr          = require('xhr')
  , ArraysGraph  = require('./arrays-graph')
  , BuffersGraph = require('./buffers-graph')
  , CryptoGraph  = require('./crypto-graph')
  , EventsGraph  = require('./events-graph')
  , FsGraph      = require('./fs-graph')
  , TlsGraph     = require('./tls-graph')
  , oss          = [ 'darwin_14.3.0_x86_64_i386' ]
  , versions     = [ 'iojs-v2.0.1', 'node-v0.10.38', 'node-v0.12.3' ]
  , currentList
  , currentShown

function urlsFor(os, topic) {
  return versions.map(function toUrl(v) {
    return 'data/' + os + '/' + topic + '-' + v + '.json';
  })
}

function byVersion(a, b) {
  return a._version > b._version
}

function getData(os, topic, cb) {
  var urls = urlsFor(os, topic);
  var tasks = urls.length;
  var data = [], abort;

  function xhrData(url, idx) {
    function onresponse(err, res, body) {
      if (abort) return;
      if (err) { abort = true; return cb(err) }
      var obj = JSON.parse(body);
      obj._version = versions[idx];
      data.push(obj);
      if (!--tasks) cb(null, data.sort(byVersion));
    }

    if (abort) return;
    xhr({ uri: url }, onresponse)
  }
  urls.forEach(xhrData);
}

var arraysEl  = document.getElementById(ArraysGraph.prototype.topic)
  , buffersEl = document.getElementById(BuffersGraph.prototype.topic)
  , cryptoEl  = document.getElementById(CryptoGraph.prototype.topic)
  , eventsEl  = document.getElementById(EventsGraph.prototype.topic)
  , fsEl      = document.getElementById(FsGraph.prototype.topic)
  , tlsEl     = document.getElementById(TlsGraph.prototype.topic)

var os = oss[0]
var arraysGraph  = new ArraysGraph(c3, arraysEl, getData, os)
  , buffersGraph = new BuffersGraph(c3, buffersEl, getData, os)
  , cryptoGraph  = new CryptoGraph(c3, cryptoEl, getData, os)
  , eventsGraph  = new EventsGraph(c3, eventsEl, getData, os)
  , fsGraph      = new FsGraph(c3, fsEl, getData, os)
  , tlsGraph     = new TlsGraph(c3, tlsEl, getData, os)

var panes = {
    arrays: function show() {
      arraysGraph.draw();
      return arraysEl;
    }
  , buffers: function show() {
      buffersGraph.draw();
      return buffersEl;
    }
  , crypto: function show() {
      cryptoGraph.draw();
      return cryptoEl;
    }
  , events: function show() {
      eventsGraph.draw();
      return eventsEl;
    }
  , fs: function show() {
      fsGraph.draw();
      return fsEl;
    }
  , tls: function show() {
      tlsGraph.draw();
      return tlsEl;
    }
}

function showPane(id) {
  if (currentShown) currentShown.classList.add('hidden')
  currentShown = panes[id]()
  currentShown.classList.remove('hidden')
}

function selectLink(link) {
  var li = link.parentElement
    , show = link.dataset.show;

  if (currentList) currentList.classList.remove('selected-item');
  li.classList.add('selected-item')
  currentList = li;
  showPane(show)
}

function onmainnavClick(e) {
  selectLink(e.target)
}

var mainnavEl = document.getElementById('mainnav')
mainnavEl.onclick = onmainnavClick;

var initialLinkEl = document.getElementById('initial-link');
selectLink(initialLinkEl)
