import React, { useState, useEffect, useRef } from "react"
import TextField from "@mui/material/TextField"

function SliderChanger(props) {
  //Called slider changer because the input is continous like a slider.
  //somehow helper text goes away right away after clicking away
  const handleChangeTimeout = useRef()
  const [errorText, setErrorText] = useState(null)
  const [value, setValue] = useState(Number(props.value))
  const options = props.options
  useEffect(() => {
    //Initially check if the value is valid on creation.
    setValue(valueValid(value))
  }, [])
  const sendChange = () => {
    console.log(props.keyHistory)
    props.onValueChange([props.keyHistory, parseFloat(value)])
  }
  const handleChange = (event) => {
    setValue(event.target.value)//Update the sliderchanger to reflect newly inputted text
    clearTimeout(handleChangeTimeout.current)//If there is 1200ms of inactivity then send the changes up the tree
    handleChangeTimeout.current = setTimeout(props.onValueChange, 1200, [
      props.keyHistory,
      parseFloat(event.target.value),
    ])
  }
  function valueValid(v) {
    //CHECK IF VALUE IS ALLOWED ACCORDING TO OPTIONS
    let inputValue = v

    if (inputValue < options.min) {
      inputValue = options.min
      setErrorText("Set to min")
    } else if (inputValue > options.max) {
      inputValue = options.max
      setErrorText("Set to max")
    } else {
      let finalNumber = options.step * Math.round(inputValue / options.step) //Make sure correct incrememnt
      finalNumber = finalNumber.toFixed(Math.abs(Math.log10(options.step))) //Remove any trailing zeros due to float addition bug
      finalNumber = parseFloat(finalNumber) //Convert back to a float
      if (finalNumber !== inputValue) {
        console.log("Changed value with steps")
        // setIsError(true)
        setErrorText("Validated")
      } else {
        setErrorText("")
      }
      return finalNumber
    }

    return inputValue //Make value to closest step
  }
  const handleBlur = () => {
    setValue(valueValid(value))
    sendChange(value)
  }

  return (
    <div>
      <TextField
        disabled={props.isDisabled}
        value={value}
        sx={{ height: 70 }}
        size={"small"}
        helperText={errorText}
        inputProps={{
          step: options.step,
          min: options.min,
          max: options.max,
          type: "number",
          style: { fontSize: "1em", textAlign: "center" },
        }}
        onChange={handleChange}
        onBlur={handleBlur}
      ></TextField>
    </div>
  )
}

export default SliderChanger
