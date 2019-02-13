MAKEFLAGS += --warn-undefined-variables
SHELL := /bin/bash

# Raspbian distributes its root and boot filesystems separately
# pi-maker expects one combined tarfile, so most of this makefile
# boilerplate is just to get the correct root filesystem.
# To customize the build, check out the `share` directory

# which version of raspbian to use, found from http://vx2-downloads.raspberrypi.org/raspbian_lite/archive/
DATE := 2018-11-15-21:03

# what image name would you like?
IMAGE_NAME := creature

# change if you want a different docker container to build everything
TAG?=latest
BUILDER?=pi-maker:$(TAG)

# Probably do not want to customize these
IMAGE := build/$(IMAGE_NAME).raspbian.img
BOOT := build/boot.tar
ROOT := build/root.tar
COMBINED := build/combined.tar

.DEFAULT_GOAL := $(IMAGE_NAME).raspbian.img

clean:
	rm -f build/{combined,root}.tar
	
build:
	docker pull pi-maker

$(ROOT).xz:
	curl -L http://vx2-downloads.raspberrypi.org/raspbian_lite/archive/$(DATE)/root.tar.xz -o $@
	
$(BOOT).xz:
	curl -L http://vx2-downloads.raspberrypi.org/raspbian_lite/archive/$(DATE)/boot.tar.xz -o $@
	
$(ROOT): $(ROOT).xz
	cp $^ $^.bak
	test -f $@ || unxz $^
	mv $^.bak $^
  	
$(COMBINED): $(ROOT) $(BOOT).xz
	cd build && \
	mkdir -p boot && \
	tar -xf boot.tar.xz -C boot && \
	sudo chown -R 0 boot && \
	sudo chgrp -R 0 boot && \
	cp root.tar combined.tar && \
	tar -rf combined.tar boot && \
	sudo rm -rf boot
	
# pi-maker requires OS_IMAGE, IMAGE_SIZE, and SETUP_SCRIPT
# to customize, check out the `share/` directory
%.raspbian.img: $(COMBINED)
	docker run -it --privileged \
		-e OS_IMAGE="combined.tar" \
		-e IMAGE_SIZE="4G" \
		-e SETUP_SCRIPT=/setup \
		-v ${PWD}/share:/share \
		-v ${PWD}/build:/build \
		$(BUILDER)
	mv build/$@ .
	echo "$@ built successfully! flash with etcher $@"
