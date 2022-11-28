from urllib import request

from flask import Flask, send_file,abort, send_from_directory, request, session, render_template, redirect, flash
from flask_login import UserMixin, LoginManager, current_user, login_user, login_required, logout_user
import os

from flask_sqlalchemy import SQLAlchemy


from flask_github import GitHub
import ConfigFunctions, GitFunctions

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
app.config['SECRET_KEY'] = '3043eb66-4f9f-4d16-a02f-a31fed11cae0'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:uv@database:3306/users'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#Public IP one
#app.config['GITHUB_CLIENT_ID'] = '161c62318fa3b687d4df'
#app.config['GITHUB_CLIENT_SECRET'] = '770009e9f42be603520c91d3b5b9b1e9c910a375'

#Local IP one
app.config['GITHUB_CLIENT_ID'] = '6829544e92a4074b8434'
app.config['GITHUB_CLIENT_SECRET'] = 'e28a5cb4f07cb2788e266442c232569720314081'

#app.config['DEBUG'] = False
db = SQLAlchemy(app)


WRITEPERMISSIONLEVEL = 2 #Permission level required to write to repo from app


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
class RepoURL(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    url = db.Column(db.String(200))

@app.route('/createDB')
def createDB():
    with app.app_context():
        print("Creating Table")
        db.create_all()
@app.route('/getData/', methods=['GET','POST'])
def getData():
    if request.method == 'GET':
        try: #attempt to get client number from session. If no client number then use '1'
            currentClientNumber = session['clientNumber']
        except KeyError:
            currentClientNumber = '1'
        GitFunctions.pullRepo()

        USERLEVEL = current_user.permissionLevel
     
        parsedYAML = ConfigFunctions.parseYAML('testConfig')
        clients = ConfigFunctions.getClients(parsedYAML, currentClientNumber)
        propertiesDB = ConfigFunctions.parseYAML('propertiesDB')
        scopesDB = ConfigFunctions.parseYAML('scopesDB')
        #adminProperties = ConfigFunctions.getAdminProperties(parsedYAML, current_user.permissionLevel)
        adminProperties = ConfigFunctions.getAdminProperties(parsedYAML, USERLEVEL)
        print(adminProperties)
        #print(clients)
        if(clients == {}):
            return {'Error':'Client not found'}, 512
        return {'clients':clients,'adminProperties': adminProperties,'propertiesDB':propertiesDB, 'scopesDB':scopesDB, 'permissionLevel': USERLEVEL}, 200
        #return {'clients':clients,'propertiesDB':propertiesDB, 'scopesDB':scopesDB, 'permissionLevel': current_user.permissionLevel}, 200
    if request.method == 'POST':
        (request.json)#???????????????????????????????????
        if current_user.permissionLevel >= WRITEPERMISSIONLEVEL:
            print("Updated client:")
            print(request.json)
            ConfigFunctions.saveClientsToFile('testConfig',request.json['config'], request.json['adminConfig'])
            print(request.json['commitMessage'])
            #IF EVERYTHING GOOD
            if saveRepo(request.json['commitMessage']):
                return 'Sucess', 201
            return 'No GitHub access', 513 #Most likely email not provided
        return 'Not Authorized', 514 #Permission level insufficient 
@app.route('/static/<folder>/<file>')#This function is neccesary to serve react 
def css(folder,file):
    
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
    return render_template('/landingPage.html')

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
                print("found GF Org")
                break
        if foundGF:
            if(gUser['email'] is None):
                print("USER MUST PROVIDE EMAIL")
            user = User(id=gUser['id'], name = gUser['name'] if gUser['name'] != None else gUser['login'], githubName=gUser['login'], email=gUser['email'], permissionLevel=1,isDarkMode=True) #Set name property of user to Github name, or the login if name is not set
            db.session.add(user)
        else:
            return render_template('noOrganization.html')
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

def saveRepo(commitMessage):
  
    try:
        GitFunctions.updateCommitAuthor(name=current_user.name, email=current_user.email)
        GitFunctions.updateRepo(commitMessage)
        return True
    except:
        print("Error pushing.")

    return False   

# @app.route('/getGraphData')
# @login_required
# def getGraphData():
#     #pointsAmount = 1000000
#     startIndex = int(request.args.get('min'))
#     endIndex = int(request.args.get('max'))
#     channels = request.args.getlist('channel')
#     amountOfPoints = 50_000
#     print(channels)
#     data = DataFunctions.getSampleData(startIndex=startIndex, endIndex=endIndex, amountOfPoints=amountOfPoints, channels=channels)
#     infoObject = {
#         'channels': channels,
#         'startIndex': startIndex,
#         'endIndex': endIndex,
#         'amountOfPoints': len(data)
#     }
#     return [data, infoObject]
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
        return render_template('adminNotAllowed.html')
    if request.method == 'POST':
        for i in request.form:
            print(i)
            print(request.form.get(i))
            User.query.get(i).permissionLevel = request.form.get(i)
        db.session.commit()
        return redirect('/adminPage')
    if request.method == 'GET':
        users = User.query.all() 
        return render_template('adminPage.html', users=users)
def isAdmin(user):
    return user.permissionLevel > 3
@app.route('/home')
@login_required
def home():
    return render_template('home.html', name=current_user.name)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=80)