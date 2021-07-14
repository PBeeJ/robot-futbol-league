all: marvelmind_streamer

marvelmind_streamer:
	gcc -g -c main.c -o main.o
	gcc -g -c -Wno-attributes marvelmind_api.c -o marvelmind_api.o
	gcc -g -c marvelmind_devices.c -o marvelmind_devices.o
	gcc -g -c marvelmind_streamer.c -o marvelmind_streamer.o
	gcc -g -c marvelmind_pos.c -o marvelmind_pos.o
	gcc -g -c marvelmind_utils.c -o marvelmind_utils.o
	gcc -o marvelmind_streamer main.o marvelmind_api.o marvelmind_devices.o marvelmind_streamer.o marvelmind_pos.o marvelmind_utils.o -ldl

clean:
	rm -rf *.o
	rm -f ./marvelmind_streamer
