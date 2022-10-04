import React, { useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddItemIcon from '@mui/icons-material/PostAdd';
import Box from '@mui/material/Box'
 

import { textAlign } from '@mui/system'
import { Container, IconButton, Button } from '@mui/material'
function ListChanger(props) {
    const isArray = !props.propertiesDB[props.property].hasKeys
    const [values, setValues] = useState(isArray ? props.value : Object.entries(props.value))
    console.log(values)
    const handleTextChange = (event, i, isKey=null) => {//j is set to null by default. Unless we have a key value item
        let tempArray = [...values]//Arrays are passed as reference so force to be value
        if(isArray){
            tempArray[i] = event.target.value
            console.log(tempArray)
        }
        else{
            tempArray[i][isKey ? 0 : 1] = event.target.value//i s which field. j is whether key or value
        }

        setValues(tempArray)
    }

    const handleDeleteButton = (i) => {
        console.log("delete: " + i)
        let tempArray = [...values];
        tempArray.splice(i, 1)
        setValues(tempArray)
    }
    
    const addItem = () => {
        
        setValues(currentValues => [...currentValues, isArray ? '' : ['','']])
    }
    
    const saveChange = () => {

        props.onValueChange([props.keyHistory, isArray ? values : Object.fromEntries(values)])
        

    }
    let items = []

        if(isArray){
            for(let i in values){
                items.push(
                    <ListItem key={i} 
                secondaryAction={
                    <IconButton disabled={props.isDisabled}onClick={x => {handleDeleteButton(i) } }>
                        <DeleteIcon/>
                    </IconButton>
                }>
                     <TextField disabled={props.isDisabled }size="small" 
                     value={values[i]} 
                     sx={{width: '100%', mx: 1}} 
                     onChange={e => handleTextChange(e,i)}>
        
                    </TextField>   
                    
                </ListItem>
                )
            }
            return (
                <Container maxWidth="xs">
                    <List sx={{borderRadius: 2,bgcolor: 'background.paper' }} dense={true}>
                            {items}
                       
                            <IconButton disabled={props.isDisabled} onClick={addItem}>
                                <AddItemIcon/>
                            </IconButton>
                       
                        </List>
                    <Button disabled={props.isDisabled} variant="contained" size="small" sx={{width: '100%'}} onClick={saveChange}>
                        Save 
                    </Button>
                </Container>
          
        
                
            )
        }
        else{
            for(let i in values){
                items.push(
                    <ListItem key={i} 
                    secondaryAction={
                        <IconButton disabled={props.isDisabled}onClick={() => {handleDeleteButton(i) } }>
                            <DeleteIcon/>
                        </IconButton>
                    }>
                         <TextField disabled={props.isDisabled }size="small" 
                         value={values[i][0]} 
                        
                         onChange={e => handleTextChange(e, i, true)}>
            
                        </TextField>
    
                        <TextField disabled={props.isDisabled } size="small" 
                         value={values[i][1]} 
                        
                         onChange={e => handleTextChange(e, i, false)}>
            
                        </TextField>   
                        
                    </ListItem>
                )
            }
            return(
                <Container maxWidth="xs">
                <List sx={{borderRadius: 2,bgcolor: 'background.paper' }} dense={true}>
                        {items}
                   
                        <IconButton disabled={props.isDisabled} onClick={addItem}>
                            <AddItemIcon/>
                        </IconButton>
                   
                    </List>
                <Button disabled={props.isDisabled} variant="contained" size="small" sx={{width: '100%'}} onClick={saveChange}>
                    Save 
                </Button>
            </Container>
            )
        }
}

export default ListChanger
