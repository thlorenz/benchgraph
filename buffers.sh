#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export PATH=`npm bin`/:$PATH

# 0.10
export NODE=`nave use 0.10 which node`
export BENCHMARK_NAME=buffer-node
$DIR/graph.sh $NODE $DIR/benchmark/common.js buffers

# 0.12
export NODE=`nave use 0.12 which node`
export BENCHMARK_NAME=buffer-node
$DIR/graph.sh $NODE $DIR/benchmark/common.js buffers

# io.js latest
export NODE=`nave use latest which node`
export BENCHMARK_NAME=buffer-iojs
$DIR/graph.sh node $DIR/benchmark/common.js buffers
