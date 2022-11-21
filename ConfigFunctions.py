
from yaml import safe_load, dump
import pathlib
CONFIGURL = pathlib.Path.cwd() / 'gitTestRepo'
def getClients(file, clientNumber):
    clients = {}

    try:#Retrieve clients
        clients = file['clients']
        clients = {clientKey:client for clientKey,client in clients.items() if clientKey == clientNumber} #Only return the client that was requested
    except KeyError:
        print("Error. Client number does not exist")
    print(clients)
    return clients

def getAdminProperties(file, permissionLevel):
    if permissionLevel < 3:
        return None
    return {key:value for key,value in file.items() if key != 'clients' and key != 'savePath'}

def parseYAML(file):
    fileURL = file + '.yml'
    fileLoc = str(CONFIGURL / fileURL)
    print(fileLoc)
    with open(fileLoc, 'r', encoding=None) as stream:
        try:
            loadedYAML = safe_load(stream)
        except:
            print("error")
    return loadedYAML#Add checking for clientNUmber

def saveClientsToFile(file,newClients):
    fileURL = file + '.yml'
    fileLoc = str(CONFIGURL / fileURL)
    #Best way is to go and edit the YAML file directly instead of reloading it and editing
    currentYAML = parseYAML(file)
    currentYAML['clients'] |= newClients # '|' is Dictionary update operator
    with open(fileLoc, 'w') as file:#Use Regex to add '---'
        documents = dump(currentYAML, file)
 