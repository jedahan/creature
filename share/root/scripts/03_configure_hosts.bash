#!/bin/bash
set -ex

grep home.mesh /etc/hosts >/dev/null && return
test "$HOSTNAME" || return
printf "
127.0.0.1 home %s
10.0.42.1 home.mesh
" "$HOSTNAME" >> /etc/hosts
