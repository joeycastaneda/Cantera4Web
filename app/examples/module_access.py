#Cantera
#Creates a gas mixture called "gas1" from
#a predefined .xml file in Cantera using the
#Solution() function
gas1 = ct.Solution("gri30.xml")
#NumPy
#Creates a list of real numbers from the range
#[0,10) with steps of 0.1 in between using the
#arange() function
a = np.arange(0, 10, 0.1)
#PyPlot
#plots the points (1,2), (2,4), and (3,6) onto
#the active plot
x = [1,2,3]
y = [2,4,6]
plt.plot(x,y)