#!/bin/sh
set -x

TARGET_HOST="pi@game-controller.local"
TARGET_DIR="/home/pi/robot-futbol-league"

ssh $TARGET_HOST "mkdir -p $TARGET_DIR"

scp -r src/game-controller $TARGET_HOST:$TARGET_DIR
scp -r src/marvelmind-streamer $TARGET_HOST:$TARGET_DIR

ssh $TARGET_HOST "cd $TARGET_DIR/marvelmind-streamer && make clean && make"
