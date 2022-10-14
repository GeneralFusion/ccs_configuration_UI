from importlib.resources import path
import subprocess
import os
import pathlib
CWD = pathlib.Path.cwd()
REPOURL = str(CWD / 'gitTestRepo')
BRANCH = 'newBranch'
CHECKOUTBRANCHCMD = ["git", "-C", REPOURL, "checkout", BRANCH]
ADDFILESCMD = ["git", "-C", REPOURL, "add", "."]
COMMITCMD = ["git", "-C", REPOURL, "commit", "-m", "Commting"]
PUSHCMD = ["git", "-C", REPOURL, "push"]
PULLCMD = ["git", "-C", REPOURL, "pull"]
RESETCMD = ["git", "-C", REPOURL, "reset", "--hard", "HEAD"]
def updateCommitAuthor(name, email):
    subprocess.check_call(["git","-C", REPOURL, "config", "user.name", name])
    subprocess.check_call(["git","-C", REPOURL, "config", "user.email", email])

def pullRepo():
    subprocess.check_call(CHECKOUTBRANCHCMD)
    subprocess.check_call(RESETCMD)
    subprocess.check_call(PULLCMD)
    
def updateRepo():    
    subprocess.check_call(ADDFILESCMD)
    subprocess.check_call(CHECKOUTBRANCHCMD)

    try:
        subprocess.check_call(COMMITCMD)
    except:
        print("No files different")
    
    subprocess.check_call(PUSHCMD)

