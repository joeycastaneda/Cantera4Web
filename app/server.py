#!/usr/bin/python
import sys, helpers, os
from flask import Flask, render_template, request, jsonify, session, flash, url_for, redirect, abort, g, send_file
from User import User
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from flask_login import login_user , logout_user , current_user , login_required, LoginManager

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://Canteraforweb:Canteraforweb@cantera.cbe2dj9ba1cm.us-west-2.rds.amazonaws.com:5432/postgres'
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
db.create_all()
db.session.commit()
engine = create_engine('postgresql://Canteraforweb:Canteraforweb@cantera.cbe2dj9ba1cm.us-west-2.rds.amazonaws.com:5432/postgres')
app.secret_key = 'Thisissecret'

@app.before_request
def clean_tmp():
    files = [f for f in os.listdir("./tmp") if f != ".gitignore"]
    for f in files:
        os.remove(os.path.join("./tmp", f))

@app.route('/',methods=['GET','POST'])
def editor():
    if current_user.is_authenticated:
        return render_template("user/editor.html")
    else:
        return render_template("anon/editor.html")

@app.route('/about')
def about():
    if current_user.is_authenticated:
        return render_template("user/about.html")
    else:
        return render_template("anon/about.html")

@app.route('/help')
def help():
    if current_user.is_authenticated:
        return render_template("user/help.html")
    else:
        return render_template("anon/help.html")

@app.route('/execute',methods=['GET','POST'])
def execute():
    if(os.path.exists("/tmp/userplt.png")):
        os.remove("/tmp/userplt.png")
    lang = request.args.get('lang', 0, type=str)
    plot = "F"
    output=""
    if lang == "Python":
        code = request.args.get('code', 0, type=str)
        output = helpers.run_code(code)
        if(os.path.exists("/tmp/userplt.png")):
            plot = "T"
    else:
        code = request.args.get('code', 0, type=str)
        output = helpers.run_CPP(code)
    return jsonify(output = output, plot = plot)

@app.route('/save')
def save():
    code = request.args.get('code', 0, type=str)
    current = current_user.username
    save_data = User.query.filter_by(username=current).first()
    save_data.save = code
    db.session.commit()
    return (''), 204

@app.route('/restore')
def restore():
    current = current_user.username
    conn = engine.connect()
    result = conn.execute("select save from users where username = '%s';" %current)
    for row in result:
        script = row['save']
    return jsonify(script=script)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    user = User(request.form['username'], request.form['password'], request.form['email'], "")
    db.session.add(user)
    db.session.commit()
    flash('User successfully registered')
    return redirect(url_for('login'))


@app.route('/login',methods=['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    username = request.form['username']
    password = request.form['password']
    registered_user = User.query.filter_by(username=username,password=password).first()
    if registered_user is None:
        flash('Username or Password is invalid' , 'error')
        return redirect(url_for('login'))
    login_user(registered_user)
    flash('Logged in successfully')
    return redirect(request.args.get('next') or url_for('editor'))

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('editor'))

@app.before_request
def before_request():
    g.user = current_user

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

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


if __name__ == '__main__':
    app.run(debug = True)