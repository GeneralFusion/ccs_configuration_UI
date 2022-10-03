import React, { useState } from 'react'
import MuiInput from '@mui/material/Input'

import Slider from '@mui/material/Slider'

function SliderChanger(props) {
    const [value, setValue] = useState(Number(props.value))
    const options = props.options
    const sendChange = () => {
        props.onValueChange([props.keyHistory, value])
    }
    const handleChange = (event, newValue) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value))
    }
    const handleBlur = () => {
        let tempValue = value
        if (value < options.min) {
            tempValue = options.min
        } else if (value > options.max) {
            tempValue = options.max
        }
        setValue(options.step * Math.round(tempValue / options.step)) //Make value to closest step
        sendChange(value)
    }

    return (
        // <Slider size="small" sx={{width: '90%', mt: 1, color: 'crimson'}} valueLabelDisplay="on" value={value} min={options.min} max={options.max} step={options.step} marks={options.marks} track={options.track} onChange={handleChange} onChangeCommitted={sendChange}></Slider>
        <MuiInput
            disabled={props.isDisabled}
            value={value}
            sx={{}}
            inputProps={{
                step: options.step,
                min: options.min,
                max: options.max,
                type: 'number',
                style: { fontSize: '1em', textAlign: 'center' },
            }}
            onChange={handleChange}
            onBlur={handleBlur}
        ></MuiInput>
    )
}

export default SliderChanger
