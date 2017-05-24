import cantera as ct
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import sys, helpers, os

def plot(userplt):
    if (os.path.exists("/tmp/userplt.png")):
        userplt.savefig("/tmp/userplt2.png", bbox_inches='tight', dpi=110)
    else:
        userplt.savefig("/tmp/userplt.png", bbox_inches='tight', dpi=110)

def plot1(userplt):
    userplt.savefig("/tmp/userplt.png", bbox_inches='tight', dpi=110)

def plot2(userplt2):
    userplt2.savefig("/tmp/userplt2.png", bbox_inches='tight', dpi=110)

