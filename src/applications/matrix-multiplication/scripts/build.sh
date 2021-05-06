#!/bin/bash

script_dir=$(dirname "$0")
rm -rf $script_dir/../build
mkdir $script_dir/../build
cd $script_dir/../build

cmake -DCMAKE_BUILD_TYPE=Debug ..
cmake --build . --config Debug
