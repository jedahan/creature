#!/bin/bash

test "$HOSTNAME" = 'home' && suffix=10
test "$HOSTNAME" = 'creature' && suffix=11
test "$suffix" || suffix=5

sed -e "s/SUFFIX/$suffix/" /etc/dhcpcd.conf.template | sudo tee /etc/dhcpcd.conf
