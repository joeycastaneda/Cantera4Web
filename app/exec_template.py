import cantera as ct
import matplotlib
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

def plot(userplt):
    userplt.savefig("/tmp/userplt.png", bbox_inches='tight')
