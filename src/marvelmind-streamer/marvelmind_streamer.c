#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#ifdef WIN32
#include <windows.h>
#endif // WIN32
#include "marvelmind_streamer.h"
#include "marvelmind_devices.h"
#include "marvelmind_utils.h"
#include "marvelmind_pos.h"

typedef enum {
    waitPort, waitDevice, connected
} ConState;
ConState conState= waitPort;

MMDeviceType deviceTypeUSB= unknown;

MarvelmindDeviceVersion usbDevVersion;

/////////////////////////////////////////////////////////////////////

static void switchToConState(ConState newConState);

// Reopen port
static void marvelmindReopenPort() {
    mmClosePort();
    switchToConState(waitPort);
}

// Change connection state
static void switchToConState(ConState newConState) {
    switch(newConState) {
        case waitPort: {
            printf("Waiting for port...\r\n");
            break;
        }
        case waitDevice: {
            printf("Trying connect to device...\r\n");
            break;
        }
        case connected: {
            printf("Device is connected via USB.\r\n");
            printMMDeviceVersionAndId(&usbDevVersion);

            deviceTypeUSB= getMMDeviceType(usbDevVersion.fwVerDeviceType);
            printMMDeviceType(&deviceTypeUSB);
            break;
        }
    }
    conState= newConState;
}

// Working cycle if modem is connected via USB
void marvelmindModemCycle() {
    static uint8_t failCounter= 0;

    marvelmindDevicesReadIfNeeded();

    switch(marvelmindLocationsReadIfNeeded()) {
        case readSuccess: {
            failCounter= 0;
            break;
        }
        case readFail: {
            failCounter++;
            if (failCounter>10) {
                marvelmindReopenPort();
                break;
            }
            break;
        }
        case notRead: {
            break;
        }
    }
}

// Working cycle if beacon is connected via USB
void marvelmindBeaconCycle() {
    //TODO
}

// Marvelmind communication state machine
void marvelmindCycle() {
        switch(conState) {
        case waitPort: {
            //if (mmOpenPortByName("com10")) {
            if (mmOpenPort()) {
                switchToConState(waitDevice);
                break;
            }
            sleep_ms(1);
            break;
        }
        case waitDevice: {
            if (mmGetVersionAndId(MM_USB_DEVICE_ADDRESS, &usbDevVersion)) {
                switchToConState(connected);
            }
            sleep_ms(1);
            break;
        }
        case connected: {
            switch(deviceTypeUSB) {
                case modem: {
                    marvelmindModemCycle();
                    break;
                }
                case beacon:
                case hedgehog: {
                    marvelmindBeaconCycle();
                    break;
                }

                case unknown: {
                    break;
                }
            }
            break;
        }
    }
}

void marvelmindStart() {
    marvelmindAPILoad();// Load Marvelmind API library

    initMarvelmindDevicesList();
    initMarvelmindPos();
    switchToConState(waitPort);// Start waiting port connection
}

void marvelmindFinish() {
    mmClosePort();// Close port (if was opened)

    marvelmindAPIFree();// Free Marvelmind API library memory
}
