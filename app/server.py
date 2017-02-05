#!/usr/bin/python
import sys, helpers
from flask import Flask, render_template, request, jsonify
from cStringIO import StringIO

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template("home.html")

@app.route('/execute')
def execute():
    code = request.args.get('code', 0, type=str)
    output = helpers.run_code(code)
    return jsonify(output = output)

if __name__ == '__main__':
    app.run(debug = True)