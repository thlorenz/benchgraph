'use strict';

var c3           = require('c3')
  , xhr          = require('xhr')
  , currentList
  , currentShown

var graphs = [
    require('./arrays-graph')
  , require('./buffers-graph')
  , require('./crypto-graph')
  , require('./events-graph')
  , require('./fs-graph')
  , require('./http-graph')
  , require('./net-graph')
  , require('./tls-graph')
]

var oss = [
    'linux_3.16.1-1-arch_x86_64_unknown'
  , 'darwin_14.3.0_x86_64_i386'
]
var versions   = [
    'iojs-v2.0.1'
  , 'node-v0.12.3'
  , 'node-v0.10.38'
]

var osTitle = {
    'darwin_14.3.0_x86_64_i386': 'osx'
  , 'linux_3.16.1-1-arch_x86_64_unknown': 'linux'
}

function urlsFor(os, topic) {
  return versions.map(function toUrl(v) {
    return 'data/' + os + '/' + topic + '-' + v + '.json';
  })
}

function byVersion(a, b) {
  return a._sortIdx - b._sortIdx;
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
      obj._sortIdx = idx;
      data.push(obj);
      if (!--tasks) cb(null, data.sort(byVersion));
    }

    if (abort) return;
    xhr({ uri: url }, onresponse)
  }
  urls.forEach(xhrData);
}

function addNavList(os) {
  // cut off _i386 and similar
  var summary = os.split('_').slice(0, -1).join('_')
  var nav = document.getElementById('mainnav')
  var h3 = document.createElement('h3')
  var p = document.createElement('p')
  var ul = document.createElement('ul')
  h3.innerHTML = osTitle[os]

  p.innerHTML = '<em>' + summary + '</em>'
  ul.setAttribute('id', 'nav-' + os)

  nav.appendChild(h3)
  nav.appendChild(p)
  nav.appendChild(ul)

  return ul;
}

function addNavListEl(os, topic, ul) {
  var el = document.createElement('li')
    , key = osTitle[os] + '-' + topic;

  el.innerHTML =
    '<a href="#' + key + '"' +
      ' id="' + key + '"' +
      ' data-os="' + os + '"' +
      ' data-topic="' + topic + '">' +
      topic +
    '</a>'

  ul.appendChild(el)
  return el
}

function addOSContentPane(os) {
  var content = document.getElementById('content')
  var section = document.createElement('section')
  section.setAttribute('id', os)
  content.appendChild(section)
  return section
}

function addGraphEl(os, topic, section) {
  var el = document.createElement('article')
    , key = osTitle[os] + '-' + topic;

  el.setAttribute('id', key)
  el.classList.add('hidden')

  section.appendChild(el);
  return el;
}

var panesPerOs = {}

function initOs(os) {
  var panes = {}
  panesPerOs[os] = panes
  var ul = addNavList(os)
  var section = addOSContentPane(os)

  graphs.forEach(initGraph)

  function initGraph(Graph) {
    var topic = Graph.prototype.topic;
    var navEl = addNavListEl(os, topic, ul)

    var graphEl = addGraphEl(os, topic, section)

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

function changeLocation(os, topic) {
  // do so without scrolling window
  var x = window.pageXOffset
    , y = window.pageYOffset
  document.location.hash = osTitle[os] + '-' + topic;
  window.scrollTo(x, y)
}

function selectLink(link) {
  var li = link.parentElement
    , os = link.dataset.os
    , topic = link.dataset.topic

  if (currentList) currentList.classList.remove('selected-item');
  li.classList.add('selected-item')
  currentList = li;
  changeLocation(os, topic)
  showPane(os, topic)
}

function onmainnavClick(e) {
  selectLink(e.target)
  // changing location manually to avoid window scrolling
  e.preventDefault()
}

var mainnavEl = document.getElementById('mainnav')
mainnavEl.onclick = onmainnavClick;

// try to auto select an item if it was provided via the url hash
var initialLinkEl;
var hash = document.location.hash
if (hash) initialLinkEl = document.querySelector(hash)
if (!initialLinkEl) initialLinkEl = document.querySelector('#mainnav li>a')
selectLink(initialLinkEl)
