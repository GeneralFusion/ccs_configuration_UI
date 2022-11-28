/* eslint-disable default-case */
import SliderChanger from './SliderChanger.js'
import React, {useEffect} from 'react'
import { Box, Paper } from '@mui/material/'
import BooleanChanger from './BooleanChanger.js'
import DropdownChanger from './DropdownChanger.js'
import ListChanger from './ListChanger.js'
import Section from './Section.js'
import CollapsibleChanger from './CollapsibleChanger.js'
import TextChanger from './TextChanger.js'
import ScopeChanger from './ScopeChanger.js'

import { Component } from 'react'


function ValueChanger(props) {
    //Add steps and min and max ranges.
    const styles = {
        bigBox:{
            px: 1,
            textAlign: 'center', 
            border: props.hasBorder ? 'solid 0px' : 'none'
        },
        smallBox:{
            px: 1, 
            height: 70,
            textAlign: 'center', 
            border: props.hasBorder ? 'solid 0px' : 'none'
        },
        smallBoxH2:{
            fontSize: '10px', 
            margin: 1
        }
    }

    const [valueChanger, isLarge] = createValueChanger(props)
    //const fontSize = '10px'//Math.min(190 / props.propertiesDB[props.property].name.length, 13) 
    if(isLarge){
        return (
            <Paper elevation={4}>
                <Box sx={styles.bigBox}>
                    <h2 style={{   }}>{props.propertiesDB[props.property].name}</h2>
                    {valueChanger}
                </Box>
            </Paper>
        )
    }
    else{
        return (
            <Paper elevation={4}>
                <Box sx={ styles.smallBox }>
                    <h2 style={styles.smallBoxH2}>{props.propertiesDB[props.property].name}</h2>
                    {valueChanger}
                </Box>
            </Paper>
        )
    }
    
}

function createValueChanger(props) {
    const sendChange = (newValue) => {
        //console.log(newValue)
        props.onValueChange(newValue)
    }
    const getOptions = (property) => {
        return props.propertiesDB[property]['options'] //Only place to change this
    }
    let valueChangerComponent
    let isLarge = false
    const componentType = props.propertiesDB[props.property]['type']
    //console.log(props.keyHistory)
    const newKeyHistory = [...props.keyHistory, props.property]
    const levelTooLow = props.userLevel < 2 || props.userLevel < props.propertiesDB[props.property]['permission']
    //console.log(newKeyHistory)
    switch (
        componentType //THIS WILL BE THE LOOKUP TABLE
    ) {
        case 'boolean':
            valueChangerComponent = (
                <BooleanChanger
                    isDisabled={props.isDisabled || levelTooLow}
                    onValueChange={sendChange}
                    keyHistory={newKeyHistory}
                    value={props.value}
                ></BooleanChanger>
            )
            break
        case 'slider':
            valueChangerComponent = (
                <SliderChanger
                    sx={{}}
                    isDisabled={props.isDisabled || levelTooLow}
                    onValueChange={sendChange}
                    keyHistory={newKeyHistory}
                    value={props.value}
                    options={getOptions(props.property)}
                ></SliderChanger>
            )
            break
        case 'dropDown':
            valueChangerComponent = (
                <DropdownChanger
                    isDisabled={props.isDisabled || levelTooLow}
                    onValueChange={sendChange}
                    keyHistory={newKeyHistory}
                    value={props.value}
                    options={getOptions(props.property)}
             
                ></DropdownChanger>
            )
            break
        case 'section':
            valueChangerComponent = (
                <Section
                    isDisabled={props.isDisabled || levelTooLow}
                    value={props.value}
                    onValueChange={sendChange}
                    keyHistory={newKeyHistory}
                    userLevel={props.userLevel}
                    property={props.property}
                    propertiesDB={props.propertiesDB}
                    scopesDB={props.scopesDB}
                ></Section>
            )
            isLarge = true
            break
        case 'collapsible':
            valueChangerComponent = (
                <CollapsibleChanger
                    isDisabled={props.isDisabled || levelTooLow}
                    value={props.value}
                    onValueChange={sendChange}
                    keyHistory={newKeyHistory}
                    property={props.property}
                    userLevel={props.userLevel}
                    propertiesDB={props.propertiesDB}
                    scopesDB={props.scopesDB}
                ></CollapsibleChanger>
            )
            isLarge = true

            break
        case 'text':
            valueChangerComponent = (
                <TextChanger
                    isDisabled={props.isDisabled || levelTooLow}
                    value={props.value}
                    onValueChange={sendChange}
                    keyHistory={newKeyHistory}
                    property={props.property}
                    propertiesDB={props.propertiesDB}
                ></TextChanger>
            )
            break
        case 'list':
            valueChangerComponent = (
                <ListChanger
                    isDisabled={props.isDisabled || levelTooLow}
                    value={props.value}
                    onValueChange={sendChange}
                    keyHistory={newKeyHistory}
                    property={props.property}
                    propertiesDB={props.propertiesDB}
                ></ListChanger>
            )
            isLarge = true
            break
        case 'scope'://Most likely never used.
            console.log(`making scope disbaled ${levelTooLow}`)
            isLarge = true
            valueChangerComponent = (
                <ScopeChanger
                    isDisabled={props.isDisabled || levelTooLow}
                    value={props.value}
                    onValueChange={sendChange}
                    keyHistory={newKeyHistory}
                    userLevel={props.userLevel}
                    property={props.property}
                    propertiesDB={props.propertiesDB}
                ></ScopeChanger>
            )
            break
    }
    return [valueChangerComponent, isLarge]
}

export default ValueChanger
