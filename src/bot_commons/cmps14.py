import time
import smbus

bus = smbus.SMBus(1)
address = 0x60


def bearing255():
    bear = bus.read_byte_data(address, 1)
    return bear


def bearing3599():
    bear1 = bus.read_byte_data(address, 2)
    bear2 = bus.read_byte_data(address, 3)
    bear = (bear1 << 8) + bear2
    bear = bear/10.0
    return bear


def setI2CAddrTo50():
    bus.write_byte_data(0x60, 0, 0xA0)
    time.sleep(0.022)
    bus.write_byte_data(0x60, 0, 0xAA)
    time.sleep(0.022)
    bus.write_byte_data(0x60, 0, 0xA5)
    time.sleep(0.022)
    bus.write_byte_data(0x60, 0, 0xCE)
    time.sleep(0.022)


while True:
    # this returns the value to 1 decimal place in degrees.
    bearing = bearing3599()
    # this returns the value as a byte between 0 and 255.
    bear255 = bearing255()
    print(f"{bearing}, {bear255}")
    time.sleep(1)
