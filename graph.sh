#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

BENCHMARK_NAME=${BENCHMARK_NAME:unnamed}
NODE_VERSION=`$NODE --version`
export PATH=`npm bin`/:$PATH
export OUTPUT_FORMAT=ndjson

# invoke node executable which is first arg and pass along remaining args
# i.e. ./graph ../node --arg will do '../node --arg'
$1 "${@:2}" | ndja name > "$DIR/data/$BENCHMARK_NAME-$NODE_VERSION.json"
