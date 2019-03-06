#!/bin/bash
set -ex

require dhcpcd
require dnsmasq

systemctl restart dhcpcd
systemctl restart dnsmasq
