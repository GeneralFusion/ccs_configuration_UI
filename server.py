from urllib import request

from flask import Flask, make_response,abort, send_from_directory, request, session, render_template, redirect, flash
from flask_login import UserMixin, LoginManager, current_user, login_user, login_required, logout_user
import os

from flask_sqlalchemy import SQLAlchemy


from flask_github import GitHub
import ConfigFunctions, DataFunctions, GitFunctions

'''
TODO 
-Send client that user selected - DONE

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
AUTHSCOPE = "read:org read:user"
loginManager = LoginManager()
loginManager.login_view = 'login'
loginManager.init_app(app)

@loginManager.user_loader
def load_user(id):
    return User.query.get(int(id))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    permissionLevel = db.Column(db.Integer())
    name = db.Column(db.String(100))
    githubName = db.Column(db.String(100))
    email = db.Column(db.String(100))
    isDarkMode = db.Column(db.Boolean())



@app.route('/getData/', methods=['GET','POST'])
def getData():
    if request.method == 'GET':
        try: #attempt to get client number from session. If no client number then use '1'
            currentClientNumber = session['clientNumber']
        except KeyError:
            currentClientNumber = '1'
        parsedYAML = ConfigFunctions.parseYAML('testConfig')
        clients = ConfigFunctions.getClients(parsedYAML, currentClientNumber)
        propertiesDB = ConfigFunctions.parseYAML('propertiesDB')
        scopesDB = ConfigFunctions.parseYAML('scopesDB')

        print(clients)
        if(clients == {}):
            return {'Error':'Client not found'}, 512
        return {'clients':clients,'propertiesDB':propertiesDB, 'scopesDB':scopesDB}, 200
    if request.method == 'POST':
        (request.json)#???????????????????????????????????
        if current_user.permissionLevel > 0:
            print("Updated client:")
            ConfigFunctions.saveClientsToFile('testConfig',request.json)
            #IF EVERYTHING GOOD
            if saveRepo():
                return 'Sucess', 201
            return 'No GitHub access', 513
        return 'Not Authorized', 514
@app.route('/static/<folder>/<file>')#This function is neccesary to serve react 
def css(folder,file):
    ''' User will call with with thier id to store the symbol as registered'''
    
    path = folder+'/'+file
    return send_from_directory(directory=directory,path=path)

@app.route('/currentClient/<clientNumber>')
@login_required
def currentClient(clientNumber):
    session['clientNumber'] = clientNumber
    return redirect('/app')



@app.route('/app')
@login_required
def getApp():
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


@app.route('/')#redirect to login 
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

@app.route('/t')
@login_required
def getT():
    return session['token']

@app.route('/github-callback')
@github.authorized_handler
def authorized(oauth_token):
    #Check if token is none

    session['token'] = oauth_token#Store the token in the browser session
    gUser = github.get('/user') #Call github user for current user's details
    user = User.query.filter_by(id=gUser['id']).first()#see if user exists in our database. Search using ID. Which will always be unique
    noEmail = True
    if user is None:#If user does not exist, create it.
        print("Checking if user belongs to GF")
        orgs = github.get('/user/orgs')
        foundGF = False
        for org in orgs:
            print(org['id'])
            if org['id'] == 115666129:
                foundGF = True
                break
        if foundGF:
            if(gUser['email'] is None):
                print("USER MUST PROVIDE EMAIL")
            user = User(id=gUser['id'], name = gUser['name'] if gUser['name'] != None else gUser['login'], githubName=gUser['login'], email=gUser['email'], permissionLevel=1,isDarkMode=True) #Set name property of user to Github name, or the login if name is not set
            db.session.add(user)
        else:
            return 'YOU ARE NOT ALLOWED HERE'
    db.session.commit()
    #Login the user (either gotten from database using 'query' or created)

    login_user(user)
    if(not user.email):
        return redirect('/profile')
    return redirect('/home')






@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == 'POST':
        enableDarkMode = False
        if request.form.get('isDarkMode'):
            enableDarkMode = True
        current_user.isDarkMode = enableDarkMode
        current_user.name = request.form.get('name')
        current_user.email = request.form.get('email')
        db.session.commit()
        flash('Changes saved')
        return redirect('/profile')
    return render_template('profile.html', name=current_user.name, email=current_user.email if current_user.email is not None else '', isDarkMode=current_user.isDarkMode)


@app.route('/profileInfo', methods=['GET', 'POST'])
@login_required
def profileInfo():
    return {'isDarkMode' : current_user.isDarkMode}

@app.route('/graph')
@login_required
def graph():
    return render_template('graph.html')

def saveRepo():
  
    try:
        GitFunctions.updateCommitAuthor(name=current_user.name, email=current_user.email)
        GitFunctions.updateRepo()
        return True
    except:
        print("Error pushing.")

    return False   

@app.route('/getGraphData')
@login_required
def getGraphData():
    #pointsAmount = 1000000

    print("Sent Data")
    print(request.args.get('min'))
    print(request.args.get('max'))
    startIndex = int(request.args.get('min'))
    endIndex = int(request.args.get('max'))
    return DataFunctions.getSampleData(startIndex=startIndex, endIndex=endIndex, amountOfPoints=100)
@app.route('/removeUser')
@login_required
def removeUser():
    userID = request.args.get('id')
    if current_user.id == int(userID):
        return "You can't remove yourself"
    print("REMOVING USER " + userID)
    User.query.filter_by(id=userID).delete()
    db.session.commit()
    return redirect('/adminPage')
@app.route('/adminPage', methods=['GET', 'POST'])
@login_required
def adminPage():
    if not isAdmin(current_user) and current_user.githubName != 'uvkhosa':
        return 'no.'
    if request.method == 'POST':
        for i in request.form:
            print(i)
            print(request.form.get(i))
            User.query.get(i).permissionLevel = request.form.get(i)
            db.session.commit()
            return redirect('/adminPage')

        return redirect('/adminPage')
    if request.method == 'GET':
        users = User.query.all() 
        return render_template('adminPage.html', users=users)
    return 'no.'
def isAdmin(user):
    return user.permissionLevel > 1
@app.route('/home')
@login_required
def home():
    return render_template('home.html', name=current_user.name)

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, threaded=True)