#!/usr/bin/python
import sys, helpers, os
from flask import Flask, render_template, request, jsonify, session, flash, url_for, redirect, abort, g, send_file
from cStringIO import StringIO

app = Flask(__name__)

@app.before_request
def clean_tmp():
    files = [f for f in os.listdir("./tmp") if f != ".gitignore"]
    for f in files:
        os.remove(os.path.join("./tmp", f))

@app.route('/')
def hello():
    return render_template("editor.html")

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/help')
def help():
    return render_template("help.html")

@app.route('/execute')
def execute():
    if(os.path.exists("/tmp/userplt.png")):
        os.remove("/tmp/userplt.png")
    code = request.args.get('code', 0, type=str)
    output = helpers.run_code(code)
    plot = "F"
    if(os.path.exists("/tmp/userplt.png")):
        plot = "T"
    return jsonify(output = output, plot = plot)

@app.route('/tmp/userplt.png')
def get_plot(): 
    return send_file('/tmp/userplt.png', mimetype='image/png')

@app.route('/example')
def get_example_code():
    filename = "examples/" + request.args.get('filename', 0, type=str)
    if(os.path.exists(filename)):
        code = helpers.read_file(filename)
        return jsonify(code = code)
    else:
        return jsonify(code = "Error: example not found")
        
@app.route('/example_img')
def get_example():
    filename = "examples/" + request.args.get('filename', 0, type=str)
    if(os.path.exists(filename)):
        return send_file(filename, mimetype='image/png')
    else:
        return send_file("examples/error.png", mimetype='image/png')


if __name__ == '__main__':\
    app.secret_key = 'Thisissecret'
    app.run(debug = True)
