#!/bin/bash
set -ex

# enable iptables - we do this before upgrading because kernel might be upgraded
modprobe ip_tables
grep -q 'ip_tables' /etc/modules || echo 'ip_tables' >> /etc/modules

DEBIAN_FRONTEND=noninteractive apt update
DEBIAN_FRONTEND=noninteractive apt upgrade -y
