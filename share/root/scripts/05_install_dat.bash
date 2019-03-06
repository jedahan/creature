#!/bin/bash

require npm nodejs

source /etc/environment
sudo -u pi NPM_CONFIG_PREFIX=$NPM_CONFIG_PREFIX npm install --global dat
