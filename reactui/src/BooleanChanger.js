import React, { useState } from 'react'

import Switch from '@mui/material/Switch'

function BooleanChanger(props) {
    const [value, setValue] = useState(props.value)
    const sendChange = () => {
        //Use opposite since its a switch
        props.onValueChange([props.keyHistory, !value])
    }

    const handleChange = (event, newValue) => {
        setValue(newValue)
        sendChange()
    }
    return <Switch sx={{}} disabled={props.isDisabled} checked={value} onChange={handleChange}></Switch>
}

export default BooleanChanger