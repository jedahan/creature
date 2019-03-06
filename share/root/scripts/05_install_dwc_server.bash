#!/bin/bash
set -ex

require git
require npm

sudo -u pi git clone https://github.com/CezarMocan/dwc-creature-server.git /home/pi/dwc-creature-server
cd /home/pi/dwc-creature-server
sudo -i pi npm install
