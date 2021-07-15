#!/bin/sh
set -x

TARGET_HOST="pi@ball-bot.local"
TARGET_DIR="/home/pi/robot-futbol-league"

ssh $TARGET_HOST "mkdir -p $TARGET_DIR"
# ssh $TARGET_HOST "pip3 install websockets"

scp -r src/ball-bot $TARGET_HOST:$TARGET_DIR

