import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import ValueChanger from './ValueChanger'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'

function ChannelChanger(props) {
    const [isActive, setisActive] = useState(props.isActive)
    const [buttonText, setButtonText] = useState(isActive ? 'Active' : 'Inactive')
    const [isConfirmed, setIsConfirmed] = useState(false)
    const typeDB = props.propertiesDB
    const properties = props.value
    const theme = useTheme()
    let c
    const sendChange = (newValue) => {
        props.onValueChange(newValue)
    }

    const handleChange = () => {
        if (isConfirmed) {
            setisActive(!isActive)
            setButtonText(isActive ? 'Inactive' : 'Active')
            setIsConfirmed(false)
            props.channelUpdate(props.channelNumber)
        } else {
            setButtonText('Are you sure?')
            setIsConfirmed(true)
        }
    }
    if(isActive){
        c = (<Grid container spacing={1} sx={{ borderLeft: 'solid 2px', borderRight: 'solid 2px', px: 1 }}>
    <Grid xs={12} md={12}>
        <h3 style={{ marginTop: 0, marginBottom: 0 }}>Channel {props.channelNumber}</h3>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'name'}
            isDisabled={false}
            value={properties[typeDB['name']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'coupling'}
            isDisabled={false}
            value={properties[typeDB['coupling']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'bwLimit'}
            isDisabled={false}
            value={properties[typeDB['bwLimit']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'probe'}
            isDisabled={false}
            value={properties[typeDB['probe']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'tdiv'}
            isDisabled={false}
            value={properties[typeDB['tdiv']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'timeOffset'}
            isDisabled={false}
            value={ properties[typeDB['timeOffset']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'vdiv'}
            isDisabled={false}
            value={properties[typeDB['vdiv']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'voltageOffset'}
            isDisabled={false}
            value={properties[typeDB['voltageOffset']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={props.propertiesDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={12}>
        <Button
            variant="contained"
            sx={{
                ':hover': { background: theme.palette.primary.dark },
                background: isConfirmed ? theme.status.warning : theme.status.enable,
                width: '100%',
                height: 50,
            }}
            onClick={handleChange}
        >
            <h3>{buttonText}</h3>
        </Button>
    </Grid>
</Grid>)
    }
    else{
        c = (<Grid container spacing={1} sx={{ borderLeft: 'solid 2px', borderRight: 'solid 2px', px: 1 }}>
    <Grid xs={12} md={12}>
        <h3 style={{ marginTop: 0, marginBottom: 0 }}>Channel {props.channelNumber}</h3>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'name'}
            isDisabled={true}
            value={properties[typeDB['name']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'coupling'}
            isDisabled={true}
            value={properties[typeDB['coupling']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'bwLimit'}
            isDisabled={true}
            value={properties[typeDB['bwLimit']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'probe'}
            isDisabled={true}
            value={properties[typeDB['probe']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'tdiv'}
            isDisabled={true}
            value={properties[typeDB['tdiv']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'timeOffset'}
            isDisabled={true}
            value={ properties[typeDB['timeOffset']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'vdiv'}
            isDisabled={true}
            value={properties[typeDB['vdiv']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'voltageOffset'}
            isDisabled={true}
            value={properties[typeDB['voltageOffset']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={props.propertiesDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={12}>
        <Button
            variant="contained"
            sx={{
                ':hover': { background: theme.palette.primary.dark },
                background: isConfirmed ? theme.status.warning :theme.status.disable ,
                width: '100%',
                height: 50,
            }}
            onClick={handleChange}
        >
            <h3>{buttonText}</h3>
        </Button>
    </Grid>
</Grid>)
    }
    
    return (
        c
    )
}

export default ChannelChanger
