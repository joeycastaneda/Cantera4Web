# Dev Server Setup
## Prereq Installation
In order ro run the server, you must have the following installed:
* Python
* pip [(here)](https://pip.pypa.io/en/stable/installing/)
* Flask [(here)](http://flask.pocoo.org/docs/0.12/installation/)

## Getting the Github Repo
To grab the server code, go to [here](https://github.com/jaspalch/Cantera4Web) and either use git clone or 
manually download the repo.

## Running the Server
To begin running the server use the following commands in a terminal:

`cd /path/to/Cantera4Web/app/`

`python server.py`

The terminal from which the server was lanuched will show debugging output.
Also, the server will restart automatically if it detects any changes in the 
server.py file.

Open a web browser and go to [http://127.0.0.1:5000/](http://127.0.0.1:5000/) (localhost, port 5000). Hopefully
you can see the webpage! Try inputting some Python code and pressing the "Execute"
button to run it and receive output from the server.
