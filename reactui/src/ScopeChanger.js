import React, { useState, useEffect, useRef } from 'react'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import Box from '@mui/material/Box'
import { Accordion, AccordionSummary, AccordionDetails, Button, TextField } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/AddCircle'
import RemoveIcon from '@mui/icons-material/RemoveCircle'

import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ValueChanger from './ValueChanger'
import ChannelChanger from './ChannelChanger.js'
import SliderChanger from './SliderChanger.js'

let childKey = 0 //This is to ensure that the key of the channel changes each re render. So the channel will actually be remade.
//FOR DTACQ - CHANNELS ARE ONLY REMOVED WHEN DEACTIVATED IF THEY ARE AT THE END.


function ScopeChanger(props) {
    const properties = props.value
    const newKeyHistory = [...props.keyHistory, props.scopeIndex]
    const [currentType, setCurrentType] = useState(properties['type'])
    const [addingChannel, setAddingChannel] = useState(false)
    const scopeProperties = useRef({ ...props.value })
    const setDefaults = useRef(false)

    let channels = []

    console.log(childKey)

    const typeDB = props.scopesDB[currentType]
    const saveChange = (newValue) => {
        const keyHistory = newValue[0]
        const keyHistoryLength = keyHistory.length
        let firstIndex = keyHistoryLength - 1
        while (keyHistory[firstIndex] !== 'Scopes') {
            firstIndex--
        }
        firstIndex += 2 //Add 2 because firstIndex is currently at current 'Scope'. Go to the property
        let tempObj = scopeProperties.current
        for (let i = firstIndex; i < keyHistoryLength - 1; i++) {
            tempObj = tempObj[keyHistory[i]]
        }
        tempObj[keyHistory[keyHistoryLength - 1]] = newValue[1]
        console.log(scopeProperties.current)
    }
    const sendChanges = () => {
        props.onValueChange([[...props.keyHistory, props.scopeIndex], scopeProperties.current])
    }
    const changeScopeType = (newType) => {
        setDefaults.current = true
        console.log(`${currentType} | ${newType[1]}`)//[1] since first part is keyHistory

        setCurrentType(newType[1])
        //saveChange(newType);
    }

    const getDefaultChannel = () => {
        let returnChannel = {}
        for (const [,value] of Object.entries(typeDB['channelProperties'])) {
            returnChannel[value['name']] = value['defaultValue']
        }
        console.log(returnChannel)
        return returnChannel
    }
    const channelUpdate = (channel) => {
        if (!scopeProperties.current['activeChannels'].includes(channel)) {
            console.log('Channel not enabled currently')
            scopeProperties.current['activeChannels'].push(channel)
            scopeProperties.current['channelsConfigSettings'][channel] = getDefaultChannel()
        } else {
            delete scopeProperties.current['channelsConfigSettings'][channel]
            scopeProperties.current['activeChannels'].splice(scopeProperties.current['activeChannels'].indexOf(channel), 1)
        }
        //console.log(scopeProperties.current)

    }
    const addChannel = (amountOfChannels) => {
        // eslint disable-line no-unused-vars
        console.log(amountOfChannels)
        for(let i = 0; i < amountOfChannels; i++){
            const newChannelNumber = scopeProperties.current['activeChannels'].length > 0 ? scopeProperties.current['activeChannels'][scopeProperties.current['activeChannels'].length - 1] + 1 : 1
            channelUpdate(newChannelNumber)
            setAddingChannel(!addingChannel)
        }

        console.log(scopeProperties.current)
    }
    const removeChannel = (amountOfChannels) => {
        const activeChannelsRef = scopeProperties.current['activeChannels']
        let activeChannelLength = activeChannelsRef.length
        if(activeChannelLength > 1 && amountOfChannels - 1 < activeChannelsRef[activeChannelLength - 1] - activeChannelsRef[0]){
            // for(let i = 0; i < amountOfChannels; i++){
            //     channelUpdate(scopeProperties.current['activeChannels'][scopeProperties.current['activeChannels'].length - 1])
            // }
            let i = 0;
            while(i < amountOfChannels){
                let inc = activeChannelsRef[activeChannelLength - 1] - activeChannelsRef[activeChannelLength - 2] 
                channelUpdate(activeChannelsRef[activeChannelLength - 1])
                activeChannelLength--
                i += inc
            }
            //setAddingChannel(!addingChannel)
        }
        setAddingChannel(!addingChannel)
        console.log(scopeProperties.current['activeChannels'])
    }
    const nameUpdates = (newName) => {
        saveChange(newName)
    }

    for (let channelIndex = 1; channelIndex <= (currentType === 'dtacq' ? scopeProperties.current['activeChannels'][scopeProperties.current['activeChannels'].length - 1] : typeDB['maxChannels']); channelIndex++) {
        let isActive = scopeProperties.current['activeChannels'].includes(channelIndex)
        let channelValue = isActive ? scopeProperties.current['channelsConfigSettings'][channelIndex] : getDefaultChannel()
        channels.push(
            <ImageListItem key={++childKey}>
                <ChannelChanger
                    value={channelValue}
                    setDefaults={false}
                    channelNumber={channelIndex}
                    isActive={isActive}
                    keyHistory={[...newKeyHistory, 'channelsConfigSettings', channelIndex]}
                    propertiesDB={typeDB['channelProperties']}
                    onValueChange={saveChange}
                    channelUpdate={channelUpdate}
                ></ChannelChanger>
            </ImageListItem>
        )
        
    }
    console.log(scopeProperties.current)

    childKey++;
    return (
        <Grid container columns={16} spacing={1} sx={{ px: 1 }} >
            {/* ROW 1 */}
            <Grid md={2}>
                <ValueChanger key={++childKey}
                    property={'connectionString'}
                    value={properties['connectionString']}
                    keyHistory={newKeyHistory}
                    propertiesDB={props.propertiesDB}
                    onValueChange={saveChange}
                ></ValueChanger>
            </Grid>
            <Grid md={2}>
                <ValueChanger key={++childKey}
                    property={'waveFormat'}
                    isDisabled={properties['waveFormat'] ? false : true}
                    value={properties['waveFormat'] ? properties['waveFormat'] : 'BYTE'}
                    keyHistory={newKeyHistory}
                    propertiesDB={props.propertiesDB}
                    onValueChange={saveChange}
                ></ValueChanger>
            </Grid>
            <Grid md={2}>
                <ValueChanger key={++childKey}
                    property={'triggerReference'}
                    isDisabled={typeDB['triggerReference']['isDisabled']}
                    value={typeDB['triggerReference']['isDisabled'] || setDefaults.current ? '' : properties[typeDB['triggerReference']['name']]}
                    keyHistory={newKeyHistory}
                    propertiesDB={typeDB}
                    onValueChange={saveChange}
                ></ValueChanger>
            </Grid>
            <Grid md={4}>
                <ValueChanger key={++childKey}
                    property={'name'}
                    value={properties['name']}
                    keyHistory={newKeyHistory}
                    propertiesDB={props.propertiesDB}
                    onValueChange={nameUpdates}
                ></ValueChanger>
            </Grid>
            <Grid md={2}>
                <ValueChanger key={++childKey}
                    property={'filePath'}
                    value={properties['filePath']}
                    keyHistory={newKeyHistory}
                    propertiesDB={props.propertiesDB}
                    onValueChange={saveChange}
                ></ValueChanger>
            </Grid>
            <Grid md={2}>
                <ValueChanger key={++childKey}
                    property={'fileFormat'}
                    value={properties['fileFormat']}
                    keyHistory={newKeyHistory}
                    propertiesDB={props.propertiesDB}
                    onValueChange={saveChange}
                ></ValueChanger>
            </Grid>
            {/* ROW 1 */}
            {/* ROW 2 */}
            <Grid md={2}>
                <ValueChanger
                    property={'type'}
                    value={properties['type']}
                    keyHistory={newKeyHistory}
                    propertiesDB={typeDB}
                    onValueChange={changeScopeType}
                ></ValueChanger>
            </Grid>
            <Grid md={2}>
                <ValueChanger key={++childKey}
                    property={'triggerType'}
                    value={properties['triggerType']}
                    keyHistory={newKeyHistory}
                    propertiesDB={typeDB}
                    onValueChange={saveChange}
                ></ValueChanger>
            </Grid>
            <Grid md={2}>
                <ValueChanger key={++childKey}
                    property={'memSize'}
                    isDisabled={typeDB['memSize']['isDisabled']}
                    value={typeDB['memSize']['isDisabled'] || setDefaults.current ? typeDB['memSize']['defaultValue'] : properties[typeDB['memSize']['name']]}
                    keyHistory={newKeyHistory}
                    propertiesDB={typeDB}
                    onValueChange={saveChange}
                ></ValueChanger>
            </Grid>
            <Grid md={2}>
                <ValueChanger key={++childKey}
                    property={'tdiv'}
                    isDisabled={typeDB['tdiv']['isDisabled']}
                    value={typeDB['tdiv']['isDisabled'] || setDefaults.current ? typeDB['tdiv']['defaultValue'] : properties[typeDB['tdiv']['name']]}
                    keyHistory={newKeyHistory}
                    propertiesDB={typeDB}
                    onValueChange={saveChange}
                ></ValueChanger>
            </Grid>
            <Grid md={2}>
                <ValueChanger key={++childKey}
                    property={'samplingRate'}
                    isDisabled={typeDB['samplingRate']['isDisabled']}
                    value={typeDB['samplingRate']['isDisabled'] || setDefaults.current ? typeDB['samplingRate']['defaultValue'] : properties[typeDB['samplingRate']['name']]}
                    keyHistory={newKeyHistory}
                    propertiesDB={typeDB}
                    onValueChange={saveChange}
                ></ValueChanger>
            </Grid>
            <Grid md={2}>
                <ValueChanger key={++childKey}
                    property={'timeOffset'}
                    isDisabled={typeDB['timeOffset']['isDisabled']}
                    value={typeDB['timeOffset']['isDisabled'] || setDefaults.current ? typeDB['timeOffset']['defaultValue'] : properties[typeDB['timeOffset']['name']]}
                    keyHistory={newKeyHistory}
                    propertiesDB={typeDB}
                    onValueChange={saveChange}
                ></ValueChanger>
            </Grid>
            <Grid md={2}>
                <ValueChanger key={++childKey}
                    property={'triggerLevel'}
                    isDisabled={typeDB['triggerLevel']['isDisabled']}
                    value={
                        typeDB['triggerLevel']['isDisabled'] || setDefaults.current
                            ? typeDB['triggerLevel']['defaultValue']
                            : properties[typeDB['triggerLevel']['name']]
                    }
                    keyHistory={newKeyHistory}
                    propertiesDB={typeDB}
                    onValueChange={saveChange}
                ></ValueChanger>
            </Grid>
            <Grid md={2}>
                <ValueChanger key={++childKey}
                    property={'triggerDelay'}
                    isDisabled={typeDB['triggerDelay']['isDisabled']}
                    value={
                        typeDB['triggerDelay']['isDisabled'] || setDefaults.current
                            ? typeDB['triggerDelay']['defaultValue']
                            : properties[typeDB['triggerDelay']['name']]
                    }
                    keyHistory={newKeyHistory}
                    propertiesDB={typeDB}
                    onValueChange={saveChange}
                ></ValueChanger>
            </Grid>
            {/* ROW 2 */}

            {/* ROW 3 */}

            <Grid md={16}>
                <ImageList
                    sx={{
                        gridAutoFlow: 'column',
                        gridTemplateColumns: 'repeat(auto-fill,minmax(25%,1fr)) !important',
                        gridAutoColumns: 'minmax(25%, 1fr)',
                        overflowY: 'hidden',
          
                    }}
                >
                    {channels}
                </ImageList>
            </Grid>
            <Grid md={16} xs={16}>
                <Button sx={{fontSize: '1em', mr: 1}} variant="contained" onClick={sendChanges}>
                    Save Scope
                </Button>
                {/* <Button disabled={currentType === 'dtacq' ? false : true} sx={{mx: 1}}variant="contained" onClick={addChannel}>
                    Add Channel
                </Button> */}
                <ChannelAmountChanger isDisabled={currentType === 'dtacq' ? false: true} isAdding={true} updateAmount={addChannel}></ChannelAmountChanger>
                <ChannelAmountChanger isDisabled={currentType === 'dtacq' ? false: true} isAdding={false} updateAmount={removeChannel}></ChannelAmountChanger>

            </Grid>

            {/* ROW 3 */}
        </Grid>
    )
}
function ChannelAmountChanger(props){
    const [channelAmount, setChannelAmount] = useState(1)
    
    const UpdateButton = () => (
        <IconButton disabled={props.isDisabled}onClick={e => props.updateAmount(channelAmount)}>
            {props.isAdding ? <AddIcon/> : <RemoveIcon/>}
        </IconButton>
    )



    const handleAddChannelsChange = (event) => {
        if(!isNaN(event.nativeEvent.data)){
            const value = Math.abs(event.target.value)
            setChannelAmount(value)
        }
    }
    return(
        <TextField disabled={props.isDisabled}
        InputProps={{endAdornment: <UpdateButton/>}}
        inputProps={{style: { textAlign: 'left', fontSize: '1em' } }} sx={{width: '115px'}} 
        size="small" label={props.isAdding ? 'Add Channels' : 'Remove Channels'}  value={channelAmount} onChange={handleAddChannelsChange}></TextField>
    )
}


export default ScopeChanger
