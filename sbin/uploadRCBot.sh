#!/bin/sh

if [ -z "$1" ]
  then
    echo "Error: missing input argument

    usage:
    sbin/uploadRCBot <hostname>

    example:
    sbin/uploadRCBot player-bot-2.local

    "
    exit 1
fi


TARGET_HOST="pi@$1"
TARGET_DIR="/home/pi/robot-futbol-league"

set -x
ssh $TARGET_HOST "mkdir -p $TARGET_DIR"
ssh $TARGET_HOST "mkdir -p $TARGET_DIR/rc"
ssh $TARGET_HOST "mkdir -p $TARGET_DIR/logs"
ssh $TARGET_HOST "mkdir -p $TARGET_DIR/bot_commons"

scp -r src/rc $TARGET_HOST:$TARGET_DIR
scp -r src/bot_commons $TARGET_HOST:$TARGET_DIR
scp -r src/setup.config $TARGET_HOST:$TARGET_DIR
scp -r src/setup.py $TARGET_HOST:$TARGET_DIR

ssh $TARGET_HOST "cd $TARGET_DIR && sudo python3 -m pip install -e ."

# # startup to run on boot
scp sbin/rclocal/rcbot $TARGET_HOST:/etc/rc.local
ssh $TARGET_HOST sudo chmod +x /etc/rc.local
