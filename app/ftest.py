import sys
from flask import Flask, render_template, request, jsonify
from cStringIO import StringIO

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template("test.html")

@app.route('/execute')
def execute():
    code = request.args.get('code', 0, type=str)
    old_stdout = sys.stdout
    redirected_output = sys.stdout = StringIO()
    exec(code)
    sys.stdout = old_stdout
    return jsonify(output = redirected_output.getvalue())

if __name__ == '__main__':
    app.run(debug = True)