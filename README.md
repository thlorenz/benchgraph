# benchgraph

Runs {io,node}.js benchmarks and generates pretty graphs

[![assets/linux-net.png](assets/linux-net.png)](https://thlorenz.github.io/benchgraph#linux-net)

## Notes on Benchmarks

The benchmarks were copied from the io.js repo (v2.0.1) and slightly adapted.

Some of them don't run with `node-v0.10` or even `node-v0.12`. When only `0.10` failed the data was included, but the
graph only compares io.js and node-v0.12 obviously.

When both failed the data has not been included at all, namely for the following:

- url *fail due to `v8 module not found`*
- querytstring *fail due to `v8 module not found`*
- crypto/rsa-encrypt-decrypt-throughput
- http/http-server-for-chunky-client *produces no data ATM*

## Adding benchmarks for your OS

If you're running a nix OS you'd like to benchmark, i.e. you may want to try an older kernel, you can easily do that and
include the data.

- run [`./benchgraph-all`](https://github.com/thlorenz/benchgraph/blob/gh-pages/benchgraph-all) on your machine
- a folder with your OS's specs will appear in the [data](https://github.com/thlorenz/benchgraph/tree/gh-pages/data)
  folder
- note its exact name and add it to the list of OSs
  [here](https://github.com/thlorenz/benchgraph/blob/b15ea267ab35f316579d87d95c517063db9439fd/client/js/main.js#L19)
- additionally select [a nice title for
  it](https://github.com/thlorenz/benchgraph/blob/b15ea267ab35f316579d87d95c517063db9439fd/client/js/main.js#L29)
- run `npm run bundle`
- then submit a pull request

In order to test things while you're working on this you can run `npm run watch` and serve the root in order to inspect
the page after every change.

## License

MIT
