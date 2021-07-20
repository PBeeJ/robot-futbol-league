TARGET_HOST="pi@game-controller.local"
TARGET_DIR="/home/pi/robot-futbol-league"

ssh $TARGET_HOST "mkdir -p $TARGET_DIR"

# TODO add ./setupGameController.sh when this starts getting out of hand
ssh $TARGET_HOST sudo pip3 install websockets

