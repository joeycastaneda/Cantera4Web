#!/usr/bin/python
import sys, helpers, os.path
from flask import Flask, render_template, request, jsonify, send_file
from cStringIO import StringIO

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template("home.html")

@app.route('/execute')
def execute():
    code = request.args.get('code', 0, type=str)
    if(os.path.exists("/tmp/userplt.png")):
        print "Removed"
        os.remove("/tmp/userplt.png")
    output = helpers.run_code(code)
    plot = "F"
    if(os.path.exists("/tmp/userplt.png")):
        plot = "T"
    return jsonify(output = output, plot = plot)

@app.route('/tmp/userplt.png')
def get_plot(): 
    return send_file('/tmp/userplt.png', mimetype='image/png')

if __name__ == '__main__':
    app.run(debug = True)