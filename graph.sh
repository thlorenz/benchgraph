#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

BENCHMARK_NAME=${BENCHMARK_NAME:unnamed}
NODE_VERSION=`$NODE --version` # darwin_14.3.0_x86_64_i386
OS_VERSION=`uname -smpr | sed 's/ /_/g' | awk '{ print tolower($0) }'`

export PATH=`npm bin`/:$PATH
export OUTPUT_FORMAT=ndjson

mkdir -p $DIR/data/$OS_VERSION

# invoke node executable which is first arg and pass along remaining args
# i.e. ./graph ../node --arg will do '../node --arg'
$1 "${@:2}" | ndja name > "$DIR/data/$OS_VERSION/$BENCHMARK_NAME-$NODE_VERSION.json"
