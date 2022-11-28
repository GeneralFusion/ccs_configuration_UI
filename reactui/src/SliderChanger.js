import React, { useState, useEffect, useRef } from 'react'
import MuiInput from '@mui/material/Input'
import TextField from '@mui/material/TextField'
import Slider from '@mui/material/Slider'

function SliderChanger(props) {//somehow helper text goes away right away after clicking away
    const handleChangeTimeout = useRef();
    const [errorText, setErrorText] = useState(null)
    const [value, setValue] = useState(Number(props.value))
    const options = props.options
    useEffect(()=>{setValue(valueValid(value))},[])
    const sendChange = () => {
        console.log(props.keyHistory)
        props.onValueChange([props.keyHistory, value])
    }
    const handleChange = (event, newValue) => {
        // const v = valueValid(event.target.value)
        setValue(event.target.value)
        //valueValid(event.target.value)
        // clearTimeout(handleChangeTimeout.current)
        // handleChangeTimeout.current = setTimeout(props.onValueChange, 1200, [props.keyHistory, v])
        
    }
    function valueValid(v){//CHECK IF VALUE IS ALLOWED ACCORDING TO OPTIONS
        let tempValue = v
   
        if (tempValue < options.min) {
            tempValue = options.min
            setErrorText("Set to min")
            
        } else if (tempValue > options.max) {
            tempValue = options.max
            setErrorText("Set to max")
        }
        else{
            let finalNumber = (options.step * Math.round(tempValue / options.step))//Make sure correct incrememnt
            finalNumber = finalNumber.toFixed(Math.abs(Math.log10(options.step)))//Remove any trailing zeros due to float addition bug
            finalNumber = parseFloat(finalNumber)//Convert back to a float
            if(finalNumber !== tempValue){
                console.log("Changed value with steps")
                // setIsError(true)
                setErrorText("Validated")
            }
            else{
                setErrorText('')
            }
            return(finalNumber)
        }

        return(tempValue) //Make value to closest step
    }
    const handleBlur = () => {
        setValue(valueValid(value))
        sendChange(value)
    }
    
    return (
        // <Slider size="small" sx={{width: '90%', mt: 1, color: 'crimson'}} valueLabelDisplay="on" value={value} min={options.min} max={options.max} step={options.step} marks={options.marks} track={options.track} onChange={handleChange} onChangeCommitted={sendChange}></Slider>
        
        <div>
            <TextField
            disabled={props.isDisabled}
            value={value}
            sx={{height: 70}}

            size={'small'}
            helperText={errorText}
            inputProps={{
                step: options.step,
                min: options.min,
                max: options.max,
                type: 'number',
                style: { fontSize: '1em', textAlign: 'center' },
            }}
            onChange={handleChange}
            onBlur={handleBlur}
        ></TextField>

        </div>
    )
}

export default SliderChanger
