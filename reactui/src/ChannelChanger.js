import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import ValueChanger from './ValueChanger'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'

function ChannelChanger(props) {
    const [isDisabled, setIsDisabled] = useState(!props.isActive)
    const [buttonText, setButtonText] = useState(isDisabled ? 'Inactive' : 'Active')
    const [isConfirmed, setIsConfirmed] = useState(false)
    const typeDB = props.propertiesDB
    const properties = props.value
    const theme = useTheme()
    const sendChange = (newValue) => {
        props.onValueChange(newValue)
    }

    const handleChange = () => {
        if (isConfirmed) {
            setIsDisabled(!isDisabled)
            setButtonText(isDisabled ? 'Active' : 'Inactive')
            setIsConfirmed(false)
            props.channelUpdate(props.channelNumber)
        } else {
            setButtonText('Are you sure?')
            setIsConfirmed(true)
        }
    }

    return (
        <Grid container spacing={1} sx={{ borderLeft: 'solid 2px', borderRight: 'solid 2px', px: 1 }}>
            <Grid xs={12} md={12}>
                <h3 style={{ marginTop: 0, marginBottom: 0 }}>Channel {props.channelNumber}</h3>
            </Grid>
            <Grid xs={12} md={6}>
                <ValueChanger
                    property={'name'}
                    isDisabled={isDisabled}
                    value={!properties ? typeDB['name']['defaultValue'] : properties['name']}
                    keyHistory={props.keyHistory}
                    propertiesDB={props.propertiesDB}
                    onValueChange={sendChange}
                ></ValueChanger>
            </Grid>
            <Grid xs={12} md={6}>
                <ValueChanger
                    property={'coupling'}
                    isDisabled={isDisabled}
                    value={!properties ? typeDB['coupling']['defaultValue'] : properties['coupling']}
                    keyHistory={props.keyHistory}
                    propertiesDB={props.propertiesDB}
                    onValueChange={sendChange}
                ></ValueChanger>
            </Grid>
            <Grid xs={12} md={6}>
                <ValueChanger
                    property={'bwLimit'}
                    isDisabled={isDisabled}
                    value={!properties ? typeDB['bwLimit']['defaultValue'] : properties[typeDB['bwLimit']['name']]}
                    keyHistory={props.keyHistory}
                    propertiesDB={props.propertiesDB}
                    onValueChange={sendChange}
                ></ValueChanger>
            </Grid>
            <Grid xs={12} md={6}>
                <ValueChanger
                    property={'probe'}
                    isDisabled={isDisabled}
                    value={!properties ? typeDB['probe']['defaultValue']: properties[typeDB['probe']['name']]}
                    keyHistory={props.keyHistory}
                    propertiesDB={typeDB}
                    onValueChange={sendChange}
                ></ValueChanger>
            </Grid>
            <Grid xs={12} md={6}>
                <ValueChanger
                    property={'tdiv'}
                    isDisabled={isDisabled}
                    value={!properties ? typeDB['tdiv']['defaultValue']: properties[typeDB['tdiv']['name']]}
                    keyHistory={props.keyHistory}
                    propertiesDB={typeDB}
                    onValueChange={sendChange}
                ></ValueChanger>
            </Grid>
            <Grid xs={12} md={6}>
                <ValueChanger
                    property={'timeOffset'}
                    isDisabled={isDisabled}
                    value={!properties ? typeDB['timeOffset']['defaultValue']: properties[typeDB['timeOffset']['name']]}
                    keyHistory={props.keyHistory}
                    propertiesDB={typeDB}
                    onValueChange={sendChange}
                ></ValueChanger>
            </Grid>
            <Grid xs={12} md={6}>
                <ValueChanger
                    property={'vdiv'}
                    isDisabled={isDisabled}
                    value={props.setDefaults || !properties ? typeDB['vdiv']['defaultValue'] : properties[typeDB['vdiv']['name']]}
                    keyHistory={props.keyHistory}
                    propertiesDB={typeDB}
                    onValueChange={sendChange}
                ></ValueChanger>
            </Grid>
            <Grid xs={12} md={6}>
                <ValueChanger
                    property={'voltageOffset'}
                    isDisabled={isDisabled}
                    value={props.setDefaults || !properties ? typeDB['voltageOffset']['defaultValue'] : properties[typeDB['voltageOffset']['name']]}
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
                        background: isConfirmed ? theme.status.warning : isDisabled ? theme.status.disable : theme.status.enable,
                        width: '100%',
                        height: 50,
                    }}
                    onClick={handleChange}
                >
                    <h3>{buttonText}</h3>
                </Button>
            </Grid>
        </Grid>
    )
}

export default ChannelChanger
