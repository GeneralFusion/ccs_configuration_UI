from urllib import request

from flask import Flask, send_from_directory, request, session, render_template, redirect, flash
from flask_login import UserMixin, LoginManager, current_user, login_user, login_required, logout_user
import os

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import scoped_session, sessionmaker

from flask_github import GitHub

import ConfigFunctions

'''
TODO 
-Send client that user selected

-Only send properties that user has perimssion for

-Merge those properties with main file

-Push to Github - DONE

-Use a URL route
'''

reactFolder = 'reactui'
directory = os.getcwd() + f'/{reactFolder}/build/static'

app = Flask(__name__)
db = SQLAlchemy(app)


app.config['SECRET_KEY'] = '3043eb66-4f9f-4d16-a02f-a31fed11cae0'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['GITHUB_CLIENT_ID'] = '161c62318fa3b687d4df'
app.config['GITHUB_CLIENT_SECRET'] = '770009e9f42be603520c91d3b5b9b1e9c910a375'

github = GitHub(app)
AUTHSCOPE = "repo"
loginManager = LoginManager()
loginManager.login_view = 'login'
loginManager.init_app(app)

@loginManager.user_loader
def load_user(userID):
    return User.query.get(int(userID))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    githubName = db.Column(db.String(100))
    isDarkMode = db.Column(db.Boolean())



@app.route('/getData/', methods=['GET','POST'])
def getData():
    if request.method == 'GET':
        parsedYAML = ConfigFunctions.parseYAML('testConfig')
        clients = ConfigFunctions.getClients(parsedYAML) 
        propertiesDB = ConfigFunctions.parseYAML('propertiesDB')
        scopesDB = ConfigFunctions.parseYAML('scopesDB')

        print(clients)
        if(clients == {}):
            return {'Error':'Client not found'}, 512
        return {'clients':clients,'propertiesDB':propertiesDB, 'scopesDB':scopesDB}, 200
    if request.method == 'POST':
        print("Updated client:")
        print(request.json)
        ConfigFunctions.saveClientsToFile('testConfig',request.json);
        #IF EVERYTHING GOOD
        return {'Sucess':"Data posted"}, 200

@app.route('/static/<folder>/<file>')#This function is neccesary
def css(folder,file):
    ''' User will call with with thier id to store the symbol as registered'''
    
    path = folder+'/'+file
    return send_from_directory(directory=directory,path=path)

@app.route('/app')
@login_required
def get_app():
    path = os.getcwd() + f'/{reactFolder}/build'
    return send_from_directory(directory=path, path='index.html')

@app.route('/register', methods=['GET', 'POST'])#Most likely will not be used since Github is authenticating
def register():
    if request.method == 'POST':
        name = request.form['name']
        password = request.form['password']
        permissionLevel = request.form['permissionLevel']
        user = User.query.filter_by(name=name).first()
        if user:
            flash('Email exists')
            return redirect('/register')
        
        newUser = User(id=permissionLevel, name=name, password=password, isDarkMode=False)
        db.session.add(newUser)
        db.session.commit()
        return 'Registered'
    return render_template('register.html')


@app.route('/')
def index():
    return redirect('/login')

@app.route('/login', methods=['GET', 'POST'])#Post method will be removed
def login():
    if request.method == 'POST':
        name = request.form['name']
        password = request.form['password']

        user = User.query.filter_by(name=name).first()
        if not user or not user.password == password:
            flash('Login credentials INCORRECT')
            return redirect('/login')
        login_user(user)
        return redirect('/home')
    if not current_user.is_authenticated:
        print("Not logged in:")
        return github.authorize(AUTHSCOPE)
        #return render_template('login.html')

    print("Logged in:")
    return redirect('/home')

@app.route('/logout')
@login_required
def logout():
    session.pop('token', default=None)#Pop the token out, if token does not exist pop 'None'
    logout_user()
    return "logged out"

@github.access_token_getter
def token_getter():
    return session['token']

@app.route('/github-callback')
@github.authorized_handler
def authorized(oauth_token):
    #Check if token is none

    session['token'] = oauth_token#Store the token in the browser session
    gUser = github.get('/user') #Call github user for current user's details
    user = User.query.filter_by(id=gUser['id']).first()#see if user exists in our database. Search using ID. Which will always be unique
    if user is None:#If user does not exist, create it.
        print("Creating User")
        user = User(id=gUser['id'], name = gUser['name'] if gUser['name'] != None else gUser['login'], githubName=gUser['login'], isDarkMode=True) #Set name property of user to Github name, or the login if name is not set
        db.session.add(user)
    db.session.commit()
    #Login the user (either gotten from database using 'query' or created)
    print(github.get('/user/repos'))
    login_user(user)
    return redirect('/home')

@app.route('/token')
def tokenGet():#Helper function. Every REST request to Git is authorized by getting token through this function
    #Need error ahdnling
    return session['token']




@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == 'POST':
        enableDarkMode = False
        if request.form.get('isDarkMode'):
            enableDarkMode = True
        current_user.isDarkMode = enableDarkMode
        current_user.name = request.form.get('name')
        db.session.commit()
        flash('Changes saved')
        return redirect('/profile')
    return render_template('profile.html', name=current_user.name, isDarkMode=current_user.isDarkMode)









@app.route('/profileInfo', methods=['GET', 'POST'])
@login_required
def profileInfo():
    return {'isDarkMode' : current_user.isDarkMode}

@app.route('/home')
@login_required
def get_home():
    return render_template('home.html', name=current_user.name)




if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, threaded=True)