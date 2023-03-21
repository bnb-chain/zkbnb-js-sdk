#!/bin/bash -e
# Removing the old build
rm -rf ./build

# Compiling typescript files
yarn tsc

# Copying abi files information
cp ./src/abi/*.json ./dist/abi
