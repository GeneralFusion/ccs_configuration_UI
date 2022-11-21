import Button from '@mui/material/Button'
import { CircularProgress, LinearProgress, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import Client from './Client.js'
import ValueChanger from './ValueChanger.js'
import React, { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { Container } from '@mui/material';
import { margin } from '@mui/system';


let clientsConfig, adminPropertiesConfig
//Value:Label Mappings,
//collapsbible, make scopes to names instead of numbers, change to array for order,
function Controller(props) {

    const theme = useTheme()
    const [clients, setClients] = useState([]);
    const [adminProperties, setAdminProperties] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [saveButton, setSaveButton] = useState({text: 'Save Changes', color: 'primary'})
    const [commitMessage, setCommitMessage] = useState("")
    const styles = {
        commitComment :{ 
            height: 70, 
            width: '100%', 
            marginTop: 1
        },
        saveButton: {
            marginTop: 0, 
            width: 1

        }
    }
    //MAKE SURE NO DOBULE CLIKING
    const homeButton = (<Button href={'/home'}>Home</Button>)
    console.log('Controller rerender')
    useState(async () => {
        await initController()
    },[])

    const changeValue = ([clientNumber, [keyHistory, newValue]]) => {
        //Array destructuring. Will take the array of property and value and make it into two variables.
        if(clientNumber === -1){
            console.log("admin property")
            return 
        }
        let client = clientsConfig[clientNumber]
        //console.log(client);
        console.log(keyHistory)
        console.log(newValue)
        for (let i = 0; i < keyHistory.length - 1; i++) {
            //Go through keyhistory (except last one). Now client is pointing to the last object which is the {proprety: value}.
            client = client[keyHistory[i]]
        }
        client[keyHistory[keyHistory.length - 1]] = newValue
        //     console.log(client);
        console.log(clientsConfig)
    }
    const generateClients = (json, propertiesDB, scopesDB, userLevel) => {
        let tempArray = []
        for (const [clientNumber, clientData] of Object.entries(json)) {
            tempArray.push(
                <Client
                    sx={{}}
                    key={clientNumber}
                    userLevel={userLevel}
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

    const generateAdminProperties = (properties, userLevel, propertiesDB) => {
        let tempAdminProperties = []
        for (const [property, value] of Object.entries(properties)){
            tempAdminProperties.push(
                <ValueChanger
                property={property}
                keyHistory={[-1, []]}
                value={value}
                userLevel={userLevel}
                propertiesDB={propertiesDB}
                onValueChange={changeValue}
                >

                </ValueChanger>
            )
        }
        return tempAdminProperties
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
        const userLevel = data['permissionLevel']
        const adminProps = data['adminProperties']
        if(adminProps){
            setAdminProperties(generateAdminProperties(adminProps, userLevel, propertiesDB))
        }
        
        clientsConfig = data['clients']

        let tempClients = generateClients(data['clients'], propertiesDB, scopesDB, userLevel) //Properties DB seems to be passes by reference
        setClients(tempClients)
    }

    const saveChanges = async () => {
        console.log('Saving: ')
        setSaveButton({text:'Saving Changes...', color: 'secondary'})
        
            const resp = await fetch(`/getData/`, {//Send new config to server
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({config: clientsConfig, commitMessage: commitMessage})
                ,
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
                setSaveButton({text: resp.status === 513 ? 'Email not provided' : 'Not Authorized', color:'error'})
            }
        
    }

    if (clients.length > 0) {
        return (
            <div style={{ textAlign: 'center', marginBottom: 20}}>
                {homeButton}
                <h1>Controls</h1>
                {adminProperties}
                {clients}
                {/* <Client properties={properties} onValueChange={changeValue}></Client> */}
                {/* <ValueChanger onValueChange={sendChange} name="temperature" value={10}></ValueChanger> */}
                <TextField inputProps={{ style: { textAlign: 'center', fontSize: '1em' }}} sx={styles.commitComment} placeholder='Commit Message' onChange={e => setCommitMessage(e.target.value)}value={commitMessage}></TextField>
                <Button variant="contained" color={saveButton.color} onClick={() => saveChanges()} sx={styles.saveButton}>
                    {saveButton.text}
                </Button>
                {saveButton.text === 'Saving Changes...' && <LinearProgress/>}
            </div>
        )
    } else {
        return(
            <Container sx={{textAlign:'center'}}>

            <h1>Fetching Information...</h1>
            <LinearProgress></LinearProgress>
            </Container>

        )
    }
}

export default Controller
