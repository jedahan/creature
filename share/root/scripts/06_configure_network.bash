#!/bin/bash

test "$HOSTNAME" = 'home' && suffix=10
test "$HOSTNAME" = 'creature' && suffix=11
test "$suffix" || suffix=5

sed -e "s/__SUFFIX__/$suffix/" /etc/dhcpcd.conf.template > /etc/dhcpcd.conf
