import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton';
import Client from './Client.js'
import React, { useState } from 'react'
import { useTheme } from '@mui/material/styles'

import { loadYAML } from './YAML.js'
let mainConfig
//Value:Label Mappings,
//collapsbible, make scopes to names instead of numbers, change to array for order,
function Controller(props) {
    const theme = useTheme()
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [saveButton, setSaveButton] = useState({text: 'Save Changes', color: 'primary'})
    const yamlFile = loadYAML('test.yml')
    //MAKE SURE NO DOBULE CLIKING
    const homeButton = (<Button href={'/home'}>Home</Button>)
    console.log('Controller rerender')
    useState(async () => {
        await initController()
    },[])

    const changeValue = ([clientNumber, [keyHistory, newValue]]) => {
        //Array destructuring. Will take the array of property and value and make it into two variables.
        let client = mainConfig[clientNumber]
        //console.log(client);
        console.log(keyHistory)
        console.log(newValue)
        for (let i = 0; i < keyHistory.length - 1; i++) {
            //Go through keyhistory (except last one). Now client is pointing to the last object which is the {proprety: value}.
            client = client[keyHistory[i]]
        }
        client[keyHistory[keyHistory.length - 1]] = newValue
        //     console.log(client);
        console.log(mainConfig)
    }
    const generateClients = (json, propertiesDB, scopesDB) => {
        let tempArray = []
        for (const [clientNumber, clientData] of Object.entries(json)) {
            tempArray.push(
                <Client
                    sx={{}}
                    key={clientNumber}
                    clientNumber={clientNumber}
                    clientName={clientData.name}
                    properties={clientData}
                    propertiesDB={propertiesDB}
                    scopesDB={scopesDB}
                    onValueChange={changeValue}
                ></Client>
            )
        }
        return tempArray
    }

    async function getData() {
      
        try {
            const req = await fetch(`/getData/`, { method: 'GET' })
            const json = await req.json()
            return json
        } catch (err) {
            console.log('Error fetching data')
        }
    }
    async function initController() {
        const data = await getData()
        const propertiesDB = data['propertiesDB']
        const scopesDB = data['scopesDB']
        console.log(data)
        mainConfig = data['clients']
        let tempClients = generateClients(data['clients'], propertiesDB, scopesDB) //Properties DB seems to be passes by reference
        setClients(tempClients)
    }

    const saveChanges = async () => {
        console.log('Saving: ')
        setSaveButton({text:'Saving Changes...', color: 'secondary'})
        
            const resp = await fetch(`/getData/`, {//Send new config to server
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mainConfig),
            })
            console.log(resp)
            if(resp.ok){//IF sucessfully pushed to github
                setSaveButton({text: 'Changes Saved!', color: 'sucess'})
                setTimeout(()=>{
                    setSaveButton({text: 'Save Changes', color: 'primary'})
                }, 5000)
            }
            else{
                console.log(resp)
                setSaveButton({text: resp.status === 513 ? 'No Repo Access' : 'Not Authorized', color:'error'})
            }
        
    }

    if (clients.length > 0) {
        return (
            <div style={{ textAlign: 'center', marginBottom: 20}}>
                {homeButton}
                <h1>Controls</h1>
                {clients}
                {/* <Client properties={properties} onValueChange={changeValue}></Client> */}
                {/* <ValueChanger onValueChange={sendChange} name="temperature" value={10}></ValueChanger> */}
                <Button variant="contained" color={saveButton.color} onClick={() => saveChanges()} sx={{marginTop: 1, width: 1}}>
                    {saveButton.text}
                </Button>
            </div>
        )
    } else {
   
    }
}

export default Controller
