include /usr/include/cantera/Cantera.mak

CC=gcc
CXX=g++
RM=rm -f
CCFLAGS=-g -std=c++11
LDLIBS=$(CANTERA_LIBS)

all: 
	$(CXX) $(CCFLAGS) new_code.cpp $(LDLIBS) -o new_code
	
clean:
	$(RM) new_code