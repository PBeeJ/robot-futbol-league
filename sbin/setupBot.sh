#!/bin/sh

set -x

TARGET_DIR="/home/pi/robot-futbol-league"

ssh $1 $TARGET_HOST "mkdir -p $TARGET_DIR"
scp -r sbin $1:$TARGET_DIR

ssh $1 sudo apt-get update
ssh $1 sudo apt-get upgrade
ssh $1 sudo apt-get install -y i2c-tools python-smbus

ssh $1 sudo apt-get install -y python3-pip
ssh $1 sudo pip3 install --upgrade setuptools

ssh $1 sudo pip3 install websockets smbus adafruit-circuitpython-motorkit

ssh $1 sudo $TARGET_DIR/sbin/setupAdafruitBlinka.sh
