#!/bin/bash

require curl
require grep
require sudo
require npm nodejs

curl -sL https://deb.nodesource.com/setup_10.x | bash -

grep -q NPM_CONFIG_PREFIX /etc/environment || echo NPM_CONFIG_PREFIX="/home/pi/npm" >> /etc/environment
grep -q PATH /etc/environment || echo PATH="$NPM_CONFIG_PREFIX/bin:$PATH" >> /etc/environment
source /etc/environment

sudo -u pi NPM_CONFIG_PREFIX=$NPM_CONFIG_PREFIX mkdir -p $NPM_CONFIG_PREFIX

sudo -u pi NPM_CONFIG_PREFIX=$NPM_CONFIG_PREFIX npm install --global --unsafe-perm dat
