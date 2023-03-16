#!/bin/bash -e
# Removing the old dist
rm -rf ./dist

# Compiling typescript files
yarn tsc
