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
    const [valueChanger, isLarge] = createValueChanger(props)
    const fontSize = Math.min(190 / props.propertiesDB[props.property].name.length, 13) 
    if(isLarge){
        return (
            <Paper elevation={4}>
                <Box sx={{ px: 1,textAlign: 'center', border: props.hasBorder ? 'solid 0px' : 'none' }}>
                    <h2 style={{ fontSize: 20 }}>{props.propertiesDB[props.property].name}</h2>
                    {valueChanger}
                </Box>
            </Paper>
        )
    }
    else{
        return (
            <Paper elevation={4}>
                <Box sx={{ px: 1, minHeight: 70, maxHeight: 70,height: 70,textAlign: 'center', border: props.hasBorder ? 'solid 0px' : 'none' }}>
                    <h2 style={{ fontSize: fontSize }}>{props.propertiesDB[props.property].name}</h2>
                    {valueChanger}
                </Box>
            </Paper>
        )
    }
    
}

function createValueChanger(props) {
    const sendChange = (newValue) => {
        console.log(newValue)
        props.onValueChange(newValue)
    }
    const getOptions = (property) => {
        return props.propertiesDB[property]['options'] //Only place to change this
    }
    let valueChangerComponent
    let isLarge = false
    const componentType = props.propertiesDB[props.property]['type']
    const newKeyHistory = [...props.keyHistory, props.property]

    switch (
        componentType //THIS WILL BE THE LOOKUP TABLE
    ) {
        case 'boolean':
            valueChangerComponent = (
                <BooleanChanger
                    isDisabled={props.isDisabled}
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
                    isDisabled={props.isDisabled}
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
                    isDisabled={props.isDisabled}
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
                    isDisabled={props.isDisabled}
                    value={props.value}
                    onValueChange={sendChange}
                    keyHistory={newKeyHistory}
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
                    isDisabled={props.isDisabled}
                    value={props.value}
                    onValueChange={sendChange}
                    keyHistory={newKeyHistory}
                    property={props.property}
                    propertiesDB={props.propertiesDB}
                    scopesDB={props.scopesDB}
                ></CollapsibleChanger>
            )
            isLarge = true

            break
        case 'text':
            valueChangerComponent = (
                <TextChanger
                    isDisabled={props.isDisabled}
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
                    isDisabled={props.isDisabled}
                    value={props.value}
                    onValueChange={sendChange}
                    keyHistory={newKeyHistory}
                    property={props.property}
                    propertiesDB={props.propertiesDB}
                ></ListChanger>
            )
            isLarge = true
            break
        case 'scope':
            isLarge = true
            valueChangerComponent = (
                <ScopeChanger
                    isDisabled={props.isDisabled}
                    value={props.value}
                    onValueChange={sendChange}
                    keyHistory={newKeyHistory}
                    property={props.property}
                    propertiesDB={props.propertiesDB}
                ></ScopeChanger>
            )
            break
    }
    return [valueChangerComponent, isLarge]
}

export default ValueChanger
