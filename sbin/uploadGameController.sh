#!/bin/sh
set -x

TARGET_HOST="pi@game-controller.local"
TARGET_DIR="/home/pi/robot-futbol-league"

ssh $TARGET_HOST "mkdir -p $TARGET_DIR"
ssh $TARGET_HOST "mkdir -p $TARGET_DIR/logs"


scp -r src/commons $TARGET_HOST:$TARGET_DIR
scp -r src/game-controller $TARGET_HOST:$TARGET_DIR
scp -r src/marvelmind-streamer $TARGET_HOST:$TARGET_DIR
scp -r sbin $TARGET_HOST:$TARGET_DIR

# build the C code for marvelmind
ssh $TARGET_HOST "cd $TARGET_DIR/marvelmind-streamer && make clean && make"

# install commons as a package (need to do each time?)
scp -r src/setup.py $TARGET_HOST:$TARGET_DIR
ssh $TARGET_HOST "cd $TARGET_DIR && sudo python3 -m pip install -e ."

# TODO : This isn't working.  For unknown reason, marvelmind_streamer will
#   not connect to the websocket when run from rc.local
#
# # startup to run on boot
# ssh $TARGET_HOST sudo cp $TARGET_DIR/sbin/rclocal/game-controller /etc/rc.local
# ssh $TARGET_HOST sudo chmod +x /etc/rc.local
