#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "marvelmind_streamer.h"
#include "marvelmind_utils.h"
#ifdef WIN32
#include <conio.h>
#else
#include <termios.h>
#include <unistd.h>
#include <fcntl.h>
#endif


int main()
{
    marvelmindStart();

    while(1) {
        marvelmindCycle();
        sleep_ms(1);
    }

    marvelmindFinish();

    return 0;
}
