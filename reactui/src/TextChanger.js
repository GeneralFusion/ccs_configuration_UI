import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import { textAlign } from '@mui/system'
function TextChanger(props) {
    let isWaiting = false
    let timeout
    const handleChange = (event) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            isWaiting = false
            props.onValueChange([props.keyHistory, event.target.value])
        }, 1000)
    }

    return (
        <TextField
            disabled={props.isDisabled}
            size="small"
            sx={{ mb: 0 }}
            inputProps={{ style: { textAlign: 'center', fontSize: '1em' } }}
            defaultValue={props.value}
            onChange={handleChange}
        ></TextField>
    )
}

export default TextChanger
