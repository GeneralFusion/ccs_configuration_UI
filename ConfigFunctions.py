from yaml import safe_load, dump

def getClients(file):
    clients = {}
    try:#Retrieve clients
        clients = file['clients']
    except KeyError:
        print("Error. Client number does not exist")
    print(clients)
    return clients

def parseYAML(file):

    with open(f'./{file}.yml', 'r', encoding=None) as stream:
        try:
            loadedYAML = safe_load(stream)
        except:
            print("error")
    return loadedYAML#Add checking for clientNUmber

def saveClientsToFile(file,newClients):
    #Best way is to go and edit the YAML file directly instead of reloading it and editing
    currentYAML = parseYAML(file)
    currentYAML['clients'] |= newClients # '|' is Dictionary update operator
    with open(f'./{file}.yml', 'w') as file:#Use Regex to add '---'
        documents = dump(currentYAML, file)
 