#!/bin/sh

set -x

TARGET_DIR="/home/pi/robot-futbol-league"

ssh $1 $TARGET_HOST "mkdir -p $TARGET_DIR"
scp -r sbin $1:$TARGET_DIR

ssh $1 sudo apt-get update
ssh $1 sudo apt-get upgrade
ssh $1 sudo apt-get install python3-pip
ssh $1 sudo pip3 install --upgrade setuptools

ssh $1 sudo pip3 install websockets
ssh $1 sudo pip3 install adafruit-circuitpython-lsm6ds
ssh $1 sudo pip3 install adafruit-circuitpython-lis3mdl

ssh $1 sudo $TARGET_DIR/sbin/setupAdafruitBlinka.sh
