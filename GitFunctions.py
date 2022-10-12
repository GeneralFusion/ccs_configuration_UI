import subprocess
REPOURL = "C:\Code\ReactUI\z\gitTestRepo"
ADDFILESCMD = ["git", "-C", REPOURL, "add", "."]
COMMITCMD = ["git", "-C", REPOURL, "commit", "-m", "Commting"]
PUSHCMD = ["git", "-C", REPOURL, "push"]
def updateCommitAuthor(name, email):
    subprocess.check_call(["git","-C", REPOURL, "config", "user.name", name])
    subprocess.check_call(["git","-C", REPOURL, "config", "user.email", email])

def updateRepo():    
    subprocess.check_call(ADDFILESCMD)
    try:
        subprocess.check_call(COMMITCMD)
    except:
        print("No files different")
    subprocess.check_call(PUSHCMD)


