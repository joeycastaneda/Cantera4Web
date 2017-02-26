#!/usr/bin/python
import sys, helpers, os
from flask import Flask, render_template, request, jsonify, send_file
from cStringIO import StringIO

app = Flask(__name__)

@app.before_request
def clean_tmp():
    files = [f for f in os.listdir("./tmp") if f != ".gitignore"]
    for f in files:
        os.remove(os.path.join("./tmp", f))

@app.route('/')
def editor():
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

if __name__ == '__main__':
    app.run(debug = True)