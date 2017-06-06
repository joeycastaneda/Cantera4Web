from flask_sqlalchemy import SQLAlchemy
from flask import Flask

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column('user_id', db.Integer, primary_key=True)
    username = db.Column('username', db.String(20), unique=True, index=True)
    password = db.Column('password', db.String(10))
    email = db.Column('email', db.String(50), unique=True, index=True)
    #save = db.relationship('Saves', backref='users', cascade="all, delete-orphan", lazy='dynamic')
    save = db.Column('save', db.String(50000))
#class Saves(db.Model):
 #   __tablename__ = "saves"
  #  user_username = db.Column('user_username', db.String(20), db.ForeignKey('users.username'))
   # user_id = db.column('user_id', db.Integer, db.ForeignKey('users.id'))
   # save = db.Column('save', db.String(50000))

    def __init__(self, username, password, email, save):
        self.username = username
        self.password = password
        self.email = email
        self.save = save

    #def __init__(self, user_username, user_id, save):
     #   self.user_username = user_username
      #  self.user_id = user_id
       # self.save = save

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

