include /usr/include/cantera/Cantera.mak

CC=gcc
CXX=g++
RM=rm -f
CCFLAGS=-g -std=c++11
LDLIBS=$(CANTERA_LIBS)

all: 
	$(CXX) $(CCFLAGS) -o new_code new_code.cpp $(LDLIBS)
	
clean:
	$(RM) new_code