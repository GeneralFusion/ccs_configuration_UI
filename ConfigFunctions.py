
from yaml import safe_load, dump
import pathlib
CONFIGURL = pathlib.Path.cwd() / 'configRepo'
def getClients(file, clientNumber):
    clients = {}
    print("client number is ", clientNumber)
    try:#Retrieve clients
        print("Printing clients: ", flush=True)
        print(file)
        clients = file['clients']
        # str(clientKey) is important.
        clients = {str(clientKey):client for clientKey,client in clients.items() if int(clientKey) == int(clientNumber)} #Only return the client that was requested
    except KeyError:
        print("Error. Client number does not exist")
    
    return clients

def getAdminProperties(file, permissionLevel):
    if int(permissionLevel) < 3:
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

def saveClientsToFile(file,newClients, adminProperties):
    fileURL = file + '.yml'
    fileLoc = str(CONFIGURL / fileURL)
    #Best way is to go and edit the YAML file directly instead of reloading it and editing
    currentYAML = parseYAML(file)
    currentYAML['clients'] |= newClients # '|' is Dictionary update operator
    if adminProperties is not None:
        for adminKey, adminValue in adminProperties.items():
            currentYAML[adminKey] |= adminValue
    print(adminProperties)
    with open(fileLoc, 'w') as file:#Use Regex to add '---'
        documents = dump(currentYAML, file)
 