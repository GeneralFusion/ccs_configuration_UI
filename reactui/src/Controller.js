import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton';
import Client from './Client.js'
import React, { useState } from 'react'

import { loadYAML } from './YAML.js'
let mainConfig
//Value:Label Mappings,
//collapsbible, make scopes to names instead of numbers, change to array for order,
function Controller(props) {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const yamlFile = loadYAML('test.yml')

    const homeButton = (<Button href={'/home'}>Home</Button>)
    console.log('Controller rerender')

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
                    properties={clientData}
                    propertiesDB={propertiesDB}
                    scopesDB={scopesDB}
                    onValueChange={changeValue}
                ></Client>
            )
        }
        return tempArray
    }

    const getData = async () => {
        console.log(document.cookie)
        try {
            const req = await fetch(`/getData/`, { method: 'GET' })
            const json = await req.json()
            return json
        } catch (err) {
            console.log('Error fetching data')
        }
    }
    const initController = async () => {
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
        try {
            await fetch(`/getData/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mainConfig),
            })
        } catch (err) {
            console.log(err)
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
                <Button variant="contained" color="primary" onClick={() => saveChanges()} sx={{marginTop: 1, width: 1}}>
                    Save Changes
                </Button>
            </div>
        )
    } else {
        return (
            <div style={{marginTop: '50px'}}>
                {homeButton}
                  <LoadingButton
          onClick={() => {
            setIsLoading(true)
            initController()
          }}
          loading={isLoading}
          loadingIndicator="Loading…"
          variant="contained"
        >
          Fetch data
        </LoadingButton>
            </div>
        )
    }
}

export default Controller
