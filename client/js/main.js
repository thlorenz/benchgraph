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
  , osTitle = {
      'darwin_14.3.0_x86_64_i386': 'osx'
  }
  , graphs = [ ArraysGraph, BuffersGraph, CryptoGraph, EventsGraph, FsGraph, TlsGraph ]
  , topics = graphs.map(function getTopic(x) { return x.prototype.topic })
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

function addNavListEl(os, topic) {
  var el = document.createElement('li')
    , key = osTitle[os] + '-' + topic;

  el.innerHTML =
    '<a href="#' + key + '"' +
      ' data-os="' + os + '" ' +
      'data-topic="' + topic + '">' +
      topic +
    '</a>'

  var ul = document.getElementById('nav-' + os);
  ul.appendChild(el)
  return el
}

function addGraphEl(os, topic) {
  var el = document.createElement('article')
    , key = osTitle[os] + '-' + topic;

  el.setAttribute('id', key)
  el.classList.add('hidden')

  var section = document.getElementById(os);
  section.appendChild(el);
  return el;
}

var panesPerOs = {}

function initOs(os) {
  var panes = {}
  panesPerOs[os] = panes

  graphs.forEach(initGraph)

  function initGraph(Graph) {
    var topic = Graph.prototype.topic;
    var navEl = addNavListEl(os, topic)

    var graphEl = addGraphEl(os, topic)

    var g = new Graph(c3, graphEl, getData, os)
    panes[topic] = function show() {
      g.draw();
      if (currentShown) currentShown.classList.add('hidden')
      graphEl.classList.remove('hidden')
      currentShown = graphEl
      return graphEl
    }
  }
}

oss.forEach(initOs)

// Navigation
function showPane(os, topic) {
  panesPerOs[os][topic]();
}

function selectLink(link) {
  var li = link.parentElement
    , os = link.dataset.os
    , topic = link.dataset.topic

  if (currentList) currentList.classList.remove('selected-item');
  li.classList.add('selected-item')
  currentList = li;
  showPane(os, topic)
}

function onmainnavClick(e) {
  selectLink(e.target)
}

var mainnavEl = document.getElementById('mainnav')
mainnavEl.onclick = onmainnavClick;

var initialLinkEl = document.querySelector('#mainnav li>a')
selectLink(initialLinkEl)
