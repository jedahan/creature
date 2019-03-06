#!/bin/bash
set -ex

npm config set unsafe-perm true
npm install -g dat
npm config set unsafe-perm false
