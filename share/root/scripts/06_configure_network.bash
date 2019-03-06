#!/bin/bash

test "$HOSTNAME" = 'gardena' && suffix=6
test "$HOSTNAME" = 'gardenb' && suffix=7
test "$HOSTNAME" = 'gardenc' && suffix=8
test "$suffix" || suffix=5

sed -e "s/__SUFFIX__/$suffix/" /etc/dhcpcd.conf.template > /etc/dhcpcd.conf
