import React from 'react'
import ValueChanger from './ValueChanger'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import Paper from '@mui/material/Paper'
const xs = {
    small: 12,
    normal: 12,
    large: 12,
}
const sm = {
    small: 4,
    normal: 6,
    large: 12,
}
const md = {
    small: 2,
    normal: 2,
    large: 12,
}
const xl = {
    small: 1,
    normal: 1,
    large: 1,
}
function Client(props) {
    let valueChangerGlobalList = []
    let connectedDevicesList = []
    let databasesList = []
    let servicesList = []
    const sendChange = (changes) => {
        console.log(changes)
        props.onValueChange([props.clientNumber, changes])
    }

    for (const [property, value] of Object.entries(props.properties)) {
        const size = props.propertiesDB[property]['size'] || 'large'
        const component = (
            <Grid key={property} xs={xs[size]} sm={sm[size]} md={md[size]} xl={xl[size]} sx={{mb: '2px'}}>
                <ValueChanger
                    property={property}
                    keyHistory={[]}
                    value={value}
                    propertiesDB={props.propertiesDB}
                    scopesDB={props.scopesDB}
                    onValueChange={sendChange}
                ></ValueChanger>
            </Grid>
        )

        switch(property){//replace this with DB check
            case('connectedDevices'):
                connectedDevicesList.push(component)
                break;
            case('services'):
                servicesList.push(component)
                break;
            case('databases'):
                databasesList.push(component)
                break;
            case('slackChannels'):
                servicesList.push(component)
                break;
            default:
                valueChangerGlobalList.push(component)
                break;
        }
    }

    return (
        <div>
            <h2>Client: {props.clientName}</h2>
            <Paper elevation={5}>
                <Grid container spacing={1} alignItems="center" sx={{ px: 1 }}>
                    {valueChangerGlobalList}
                </Grid>
            </Paper>

            <Paper elevation={1}>{connectedDevicesList}</Paper>
            <Paper elevation={1}>{servicesList}</Paper>
            <Paper elevation={1}>{databasesList}</Paper>


        </div>
    )
}

export default Client
