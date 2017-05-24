#!/usr/bin/python
import sys, helpers, os
from flask import Flask, render_template, request, jsonify, session, flash, url_for, redirect, abort, g, send_file, Response
#from User import User
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy_utils import ScalarListType
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_login import login_user , logout_user , current_user , login_required, LoginManager
from flask_mail import Mail, Message


app = Flask(__name__)
app.secret_key = 'Thisissecret'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://Canteraforweb:Canteraforweb@cantera.cbe2dj9ba1cm.us-west-2.rds.amazonaws.com:5432/postgres'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
engine = db.engine
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'cantera4web@gmail.com'
app.config['MAIL_PASSWORD'] = 'canterashaw'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

class User(db.Model):
    __tablename__ = "users"
    id = db.Column('user_id', db.Integer, primary_key=True)
    username = db.Column('username', db.String(20), unique=True, index=True)
    password = db.Column('password', db.String(10))
    email = db.Column('email', db.String(50), unique=True, index=True)
    save = db.Column('save', db.String(50000))
    savearr = db.Column(ScalarListType())
    namearr = db.Column(ScalarListType())

    def __init__(self, username, password, email, save, savearr, namearr):
        self.username = username
        self.password = password
        self.email = email
        self.save = save
        self.savearr = savearr
        self.namearr = namearr

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def __repr__(self):
        return '<User %r>' % (self.username)

db.create_all()
db.session.commit()

@app.route('/index',methods=['GET','POST'])
def index():
    if request.method == 'GET':
        return render_template('index.html')
    print request.form['btn']
    if request.form['btn'] == 'login':
        username = request.form['username']
        password = request.form['password']
        registered_user = User.query.filter_by(username=username,password=password).first()
        if registered_user is None:
            flash('Username or Password is invalid' , 'error')
            return redirect(url_for('index'))
        login_user(registered_user)
        flash('Logged in successfully')
        return redirect(url_for('editor'))
    elif request.form['btn'] == 'register':
            user = User(request.form['username'], request.form['password'], request.form['email'], "","","")
            db.session.add(user)
            db.session.commit()
            flash('User successfully registered')
            login_user(user)
            return redirect(url_for('editor'))
    else:
        return redirect(url_for('index'))

@app.route('/projectwizard')
def project_wizard():
    return render_template("project_wizard.html")


@app.route('/',methods=['GET','POST'])
def editor():
    helpers.clean_tmp()
    with open('tmp/output.txt', 'w') as output_file:
        output_file.write("")
        output_file.close()
    if current_user.is_authenticated:
        return render_template("user/editor3.html")
    else:
        return render_template("anon/editor3.html")

@app.route('/about')
def about():
    if current_user.is_authenticated:
        return render_template("user/about.html")
    else:
        return render_template("anon/about.html")

@app.route('/helpcpp')
def helpcpp():
    if current_user.is_authenticated:
        return render_template("user/helpcpp.html")
    else:
        return render_template("anon/helpcpp.html")

@app.route('/help')
def help():
    if current_user.is_authenticated:
        return render_template("user/help.html")
    else:
        return render_template("anon/help.html")
    
@app.route('/forget', methods=['GET', 'POST'])
def forget():
    if request.method == 'GET':
        return render_template('forget.html')
    username = request.form['username']
    registered_user = User.query.filter_by(username=username).first()
    if registered_user is None:
        flash('Username is invalid', 'error')
        return redirect(url_for('forget'))
    if registered_user.is_authenticated:
        msg = Message('Hello', sender='cantera4web@gmail.com', recipients=[registered_user.email])
        msg.body = "Your password is "+ registered_user.password
        mail.send(msg)
        return "Your password has been sent. Hit the back button to return to the website."    

@app.route('/execute',methods=['GET','POST'])
def execute():
    if(os.path.exists("/tmp/userplt.png")):
        os.remove("/tmp/userplt.png")
    if (os.path.exists("/tmp/userplt2.png")):
        os.remove("/tmp/userplt2.png")
    lang = request.args.get('lang', 0, type=str)
    plot = "F"
    output=""
    if lang == "Python":
        code = request.args.get('code', 0, type=str)
        output = helpers.run_code(code)
        if(os.path.exists("/tmp/userplt.png")):
            plot = "T1"
            if (os.path.exists("/tmp/userplt2.png")):
                plot = "T12"
        print(plot)
    else:
        code = request.args.get('code', 0, type=str)
        output = helpers.run_CPP(code)
    with open('tmp/output.txt', 'w') as output_file:
        output_file.write(str(output))
        output_file.close()
    return jsonify(output = output, plot = plot)

@app.route('/save')
def save():
    code = request.args.get('code', 0, type=str)
    if current_user.is_authenticated:
        current = current_user.username
        conn = engine.connect()
        conn.execute("UPDATE users set save=\'{0}\' where username=\'{1}\'".format(code, current))
        conn.close()
    return (''), 204

@app.route('/numFiles')
def getNumFiles():
    if current_user.is_authenticated:
        return jsonify(count = numFiles())

def numFiles():
    if current_user.is_authenticated:
        user = db.session.query(User).filter_by(username=current_user.username).first()
        newArr = user.namearr[:]
        count = 0
        for item in newArr:
            if (item != ""):
                count += 1
        return count

@app.route('/saveFile')
def saveFile():
    print "numFiles: " + str(numFiles())
    code = request.args.get('code', 0, type=str)
    filename = request.args.get('filename', 0, type=str)
    if current_user.is_authenticated:
        if(filename in current_user.namearr):
            user = db.session.query(User).filter_by(username=current_user.username).first()
            newArr = user.savearr[:]
            newArr[user.namearr.index(filename)] = code
            user.savearr = newArr
            print user.savearr
            db.session.commit()
            print "tmp/" + filename
            if (os.path.exists("/tmp/" + filename)):
                print "Found file"
                with open("/tmp/" + filename, "w") as file:
                    file.write(code)
                    file.close()
        elif (numFiles() < 10):
            user = db.session.query(User).filter_by(username=current_user.username).first()
            newSaveArr = user.savearr[:]
            newNameArr = user.namearr[:]
            for index, name in enumerate(newNameArr):
                if (name == ""):
                    newNameArr[index] = filename
                    #print "tmp/" + filename
                    newSaveArr[index] = code
                    print newNameArr
                    user.savearr = newSaveArr
                    user.namearr = newNameArr
                    print user.namearr
                    db.session.commit()
                    with open("/tmp/" + filename, "w") as file:
                        file.write("")
                        file.close()
                        return (''), 204

    return (''), 204

@app.route('/createFile')
def createFile():
    filename = request.args.get('filename', 0, type=str)
    if current_user.is_authenticated:
        user = db.session.query(User).filter_by(username=current_user.username).first()
        newSaveArr = user.savearr[:]
        newNameArr = user.namearr
        for name in newNameArr:
            if(name == ""):
                newNameArr[0] = filename
                #newSaveArr[newNameArr.index(filename)] = ""
                user.savearr = newSaveArr
                user.namearr = newNameArr
                db.session.commit()
                with open("/tmp/" + filename, "w") as file:
                    file.write("")
                    file.close()
                    return (''), 204
        return (''), 405

@app.route('/deleteFile')
def deleteFile():
    filename = request.args.get('filename', 0, type=str)
    if current_user.is_authenticated:
        user = db.session.query(User).filter_by(username=current_user.username).first()
        newSaveArr = user.savearr[:]
        newNameArr = user.namearr
        newSaveArr[user.namearr.index(filename)] = ""
        newNameArr[user.namearr.index(filename)] = ""
        user.namearr = newNameArr
        user.savearr = newSaveArr
        if (os.path.exists("/tmp/" + filename)):
            os.remove("/tmp/" + filename)
    return (''), 204

@app.route('/getFilenames')
def filenames():

    if current_user.is_authenticated:
        user = db.session.query(User).filter_by(username=current_user.username).first()
        return jsonify(list = user.namearr, code = user.savearr)
    else:
        return (''), 404

@app.route('/restore')
def restore():
    current = current_user.username
    script = User.query.filter_by(username=current).first().save
    return jsonify(script=script)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('index.html')
    user = User(request.form['username'], request.form['password'], request.form['email'], "")
    db.session.add(user)
    db.session.commit()
    flash('User successfully registered')
    return redirect(url_for('login'))


@app.route('/login',methods=['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template('index.html')
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

@app.route('/tmp/userplt2.png')
def get_plot2():
    return send_file('/tmp/userplt2.png', mimetype='image/png')

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

@app.route('/makeoutput')
def make_output():
    output = request.args.get('output', 0, type=str)
    print str(output)
    with open('tmp/output.txt', 'w') as output_file:
        output_file.write(str(output))
        output_file.close()
    return (''), 200

@app.route('/output')
def get_output():
    return send_file("tmp/output.txt", mimetype='text/plain')

@app.route('/getplot')
def dl_plot():
    if (os.path.exists("/tmp/userplt.png")):
        return send_file("/tmp/userplt.png", mimetype='image/png')

if __name__ == '__main__':
    app.run(debug = True)
