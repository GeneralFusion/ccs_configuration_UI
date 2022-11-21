import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import { textAlign } from '@mui/system'
function TextChanger(props) {

    const handleChange = (event) => {
        props.onValueChange([props.keyHistory, event.target.value])

    }

    return (
        <TextField
            disabled={props.isDisabled}
            size="small"
            sx={{ mb: 0 }}
            inputProps={{ style: { textAlign: 'center', fontSize: '1em' } }}
            defaultValue={props.value}
            onBlur={handleChange}
        ></TextField>
    )
}

export default TextChanger
