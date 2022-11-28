import React, { useState, useEffect, useRef } from 'react'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import ValueChanger from './ValueChanger'
import IconButton from '@mui/material/IconButton'
import CopyButton from '@mui/icons-material/ContentCopy'
import CheckmarkButton from '@mui/icons-material/CheckCircle'

import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import TextChanger from './TextChanger'
import { TextField } from '@mui/material'

function ChannelChanger(props) {
    const [isActive, setisActive] = useState(props.isActive)
    const [buttonText, setButtonText] = useState(isActive ? 'Active' : 'Inactive')
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [showChannelCopyText, setShowChannelCopyText] = useState(false)
    const [errorText, setErrorText] = useState('')
    const channelCopyText = useRef('')
    const typeDB = props.propertiesDB
    const properties = props.value
    const theme = useTheme()
    let c
    console.log(`Disabled ${props.isDisabled}`)
    const sendChange = (newValue) => {
        props.onValueChange(newValue)
    }
    const updateChannelCopyText = (e) => {
        channelCopyText.current = e.target.value
    }
    const sendChannelCopy = () => {
       // const data = [channelCopyText.current, props.keyHistory[props.keyHistory.length - 1]]
        //USE A SET TO MAKE SURE NO DUPLICATE CHANNELS. Just convert all the channels to csv right here. 
       
        if(/[^\d,-]/gm.test(channelCopyText.current)){
            setErrorText("Invalid input")
        }
        else{
            let cRange = []
            let x = channelCopyText.current.split(',')
            for(let c of x){
                let trimmedChannel = c.trim()
                if(trimmedChannel === ''){
                    continue
                }
                if(trimmedChannel.includes('-')){
          
                    const ranges = trimmedChannel.split('-')
                    const start = parseInt(ranges[0])
                    const end = parseInt(ranges[ranges.length - 1])
                    for(let i = start; i <= end; i++){
                        cRange.push(i)
                    }
                }
                else{
                    cRange.push(parseInt(trimmedChannel))
                }
            }
            const finalChannels = [...new Set(cRange)] 
            props.onChannelCopy([finalChannels, props.keyHistory[props.keyHistory.length - 1]])
        }
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
        <Grid container>
            <Grid xs={10}>
            <h3 style={{ marginTop: 0, marginBottom: 0 }}>Channel {props.channelNumber}</h3> 
            {showChannelCopyText ? <TextField helperText={errorText}disabled={props.isDisabled} placeholder={'E.g. 1,3,6-8'} onChange={updateChannelCopyText}
        InputProps={{endAdornment: <IconButton onClick={sendChannelCopy}>{<CheckmarkButton/>}</IconButton>}}
        inputProps={{style: { textAlign: 'left', fontSize: '1em', height: '5px' } }} sx={{width: '90%'}}>    
    </TextField> : null}
           
            </Grid>
            <Grid xs={2}>
        <IconButton disabled={props.isDisabled} sx={{}} onClick={() => {setShowChannelCopyText(!showChannelCopyText)}}>
            {<CopyButton/>} 
        </IconButton>
  
        </Grid>
        
        </Grid>
    </Grid>

    <Grid xs={12} md={6}>
        <ValueChanger
            property={'name'}
            isDisabled={props.isDisabled}
            value={properties[typeDB['name']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'coupling'}
            isDisabled={props.isDisabled}
            value={properties[typeDB['coupling']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'bwLimit'}
            isDisabled={props.isDisabled}
            value={properties[typeDB['bwLimit']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'probe'}
            isDisabled={props.isDisabled}
            value={properties[typeDB['probe']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'tdiv'}
            isDisabled={props.isDisabled}
            value={properties[typeDB['tdiv']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'timeOffset'}
            isDisabled={props.isDisabled}
            value={ properties[typeDB['timeOffset']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'vdiv'}
            isDisabled={props.isDisabled}
            value={properties[typeDB['vdiv']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={6}>
        <ValueChanger
            property={'voltageOffset'}
            isDisabled={props.isDisabled}
            value={properties[typeDB['voltageOffset']['name']]}
            keyHistory={props.keyHistory}
            propertiesDB={props.propertiesDB}
            onValueChange={sendChange}
        ></ValueChanger>
    </Grid>
    <Grid xs={12} md={12}>
        <Button
            disabled={props.isDisabled}
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
    <Grid container>
            <Grid xs={10}>
            <h3 style={{ marginTop: 0, marginBottom: 0 }}>Channel {props.channelNumber}</h3> 
            {showChannelCopyText ? <TextField disabled={props.isDisabled}  onChange={updateChannelCopyText}
        InputProps={{endAdornment: <IconButton onClick={sendChannelCopy}>{<CheckmarkButton/>}</IconButton>}}
        inputProps={{style: { textAlign: 'left', fontSize: '1em', height: '5px' } }} sx={{width: '90%'}}>    
    </TextField> : null}
           
            </Grid>
            <Grid xs={2}>
        <IconButton disabled={true} sx={{}} onClick={() => {setShowChannelCopyText(!showChannelCopyText)}}>
            {<CopyButton/>} 
        </IconButton>
  
        </Grid>
        
        </Grid>
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
