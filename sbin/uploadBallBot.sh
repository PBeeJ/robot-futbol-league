#!/bin/sh
set -x

TARGET_HOST="pi@ball-bot.local"
TARGET_DIR="/home/pi/robot-futbol-league"

ssh $TARGET_HOST "mkdir -p $TARGET_DIR"
ssh $TARGET_HOST "mkdir -p $TARGET_DIR/ball-bot"
ssh $TARGET_HOST "mkdir -p $TARGET_DIR/commons"
ssh $TARGET_HOST "mkdir -p $TARGET_DIR/bot_commons"

scp -r src/ball-bot $TARGET_HOST:$TARGET_DIR
scp -r src/commons $TARGET_HOST:$TARGET_DIR
scp -r src/bot_commons $TARGET_HOST:$TARGET_DIR
scp -r src/setup.config $TARGET_HOST:$TARGET_DIR
scp -r src/setup.py $TARGET_HOST:$TARGET_DIR

ssh $TARGET_HOST "cd $TARGET_DIR && sudo python3 -m pip install -e ."