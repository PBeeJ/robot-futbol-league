#!/bin/sh
set -x

TARGET_HOST="pi@scoreboard.local"
TARGET_DIR="/home/pi/robot-futbol-league"

ssh $TARGET_HOST "mkdir -p $TARGET_DIR"
ssh $TARGET_HOST "mkdir -p $TARGET_DIR/logs"


scp -r src/scoreboard $TARGET_HOST:$TARGET_DIR
scp -r sbin $TARGET_HOST:$TARGET_DIR

# TODO : This isn't working.  For unknown reason, marvelmind_streamer will
#   not connect to the websocket when run from rc.local
#
# # startup to run on boot
# ssh $TARGET_HOST sudo cp $TARGET_DIR/sbin/rclocal/game-controller /etc/rc.local
# ssh $TARGET_HOST sudo chmod +x /etc/rc.local

