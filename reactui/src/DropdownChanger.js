import React, { useEffect, useState } from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
function DropdownChanger(props) {
    const [value, setValue] = useState(props.value)
    const handleChange = (event) => {
        console.log(props.value)
        setValue(event.target.value)
        props.onValueChange([props.keyHistory, event.target.value])
    }

    let returnSelect
    const style={ mb: 1, minWidth: 5, fontSize: 12 }
    if (props.options.differentLabels) {
        returnSelect = (
            <Select disabled={props.isDisabled} size="small" sx={style} MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
            value={value} onChange={handleChange}>
                {props.options.selections.map((option) => (
                    <MenuItem key={option.value} value={option.value} style={{fontSize: 12}}>
                        {option.label}{' '}
                    </MenuItem>
                ))}
            </Select>
        )
    } else {
        returnSelect = (
            <Select disabled={props.isDisabled} size="small" MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }} sx={style} value={value} onChange={handleChange}>
                {props.options.selections.map((option) => (
                    <MenuItem key={option} value={option} style={{fontSize: 12}}>
                        {option}{' '}
                    </MenuItem>
                ))}
            </Select>
        )
    }
    return returnSelect
}

export default DropdownChanger
