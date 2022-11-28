import ValueChanger from './ValueChanger'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import Stack from '@mui/material/Stack'
import React, { useState } from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Menu } from '@mui/material'
import ScopeChanger from './ScopeChanger'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'

function CollapsibleChanger(props) {
    const [refresh, setRefresh] = useState(false);
    const sendChange = (newValue) => {
        setRefresh(!refresh);//May need to check if value changed was name
        props.onValueChange(newValue)
    }

    let items = []
    if(props.property == 'Scopes'){
        for (const [itemNumber, itemValue] of Object.entries(props.value)) {
            items.push(
                <Accordion key={itemNumber} TransitionProps={{ unmountOnExit: true }}>
                    <AccordionSummary>{itemValue.name}</AccordionSummary>
                    <AccordionDetails>
                        <ScopeChanger
                            value={itemValue}
                            propertiesDB={props.propertiesDB}
                            isDisabled={props.isDisabled}
                            keyHistory={props.keyHistory}
                            scopesDB={props.scopesDB}
                            userLevel={props.userLevel}
                            scopeIndex={itemNumber}
                            onValueChange={sendChange}
                        ></ScopeChanger>
                    </AccordionDetails>
                </Accordion>
            )
        }
    }
    else{
        for (const [property, value] of Object.entries(props.value)){
            items.push(
                <Accordion key={property} TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary>{property}</AccordionSummary>
                <AccordionDetails>
                    <ValueChanger
                        property={property}
                        keyHistory={props.keyHistory}
                        value={value}
                        propertiesDB={props.propertiesDB}
                        userLevel={props.userLevel}
                        onValueChange={sendChange}
                    ></ValueChanger>
                </AccordionDetails>
            </Accordion>
            )
        } 
    }


    return <div>{items}</div>

    //     const [currentIndex, setCurrentIndex] = useState(-1);
    //     let valueChangerList = [];
    //     let dropdownItems = [
    //     <MenuItem key={-1} value={-1}>
    //         Hide {props.property}
    //     </MenuItem>
    //     ];

    //     const sendChange = (newValue) => {
    //         // console.log(currentIndex);
    //         // console.log(props.property);
    //         // console.log(newValue);
    //         // let x = new Object;
    //         // x[currentIndex] = new Object();
    //         // x[currentIndex][newValue[0]] = newValue[1];
    //         // console.log(x);
    //         console.log(newValue)
    //         props.onValueChange(newValue)
    //     }
    //     const handleChange = (event) => {
    //         setCurrentIndex(event.target.value);
    //     }
    //     console.log(props.value);

    //     for(const [itemNumber, itemValue] of Object.entries(props.value)){
    //         let tempArray = [];
    //         dropdownItems.push(
    //             <MenuItem key={itemNumber} value={itemNumber}>
    //                 {itemValue.name}
    //             </MenuItem>
    //         )
    //         for(const [property, value] of Object.entries(itemValue)){
    //             tempArray.push(
    //                 <Grid key={property} xs={12} sm={6} md={4} xl={3} sx={{pr: 1, pb: 1}}>
    //                     <ValueChanger hasBorder={true} key={props.propertiesDB[property]['id']} property={property} value={value} keyHistory={[...props.keyHistory, currentIndex]} propertiesDB={props.propertiesDB} onValueChange={sendChange}></ValueChanger>
    //                 </Grid>
    //             )
    //         }
    //         valueChangerList.push(
    //             <Accordion key={itemNumber} defaultExpanded={false} expanded={currentIndex == itemNumber}>
    //                 <AccordionSummary>
    //                     {itemValue.name}
    //                 </AccordionSummary>
    //                 <AccordionDetails>
    //                     <Grid container>
    //                         {tempArray}
    //                     </Grid>
    //                 </AccordionDetails>
    //             </Accordion>

    //         )
    //     }

    //     /*keys are how react knows to re-render.
    //     Since every item has same properties and COULD have same value,
    //     we must use something unique. Which is the index + currentIndex to always
    //     make sure we have an offset. We guarantee this offset and uniqueness of keys by multiplying the currentIndex by the items length.
    //     If items 1,2,3 have 3 properties. (index starts at 1) The keys for item 1: 3,4,5. For item 2: 6,7,8 item:3 9,10,11
    //     */
    //     // for(const [property, value] of Object.entries(props.value[currentIndex])){//Change the one to set to the first element. //MAKE THIS A DROP DOWN TO SELECT WHICH PROPERTIES
    //     //     console.log(value);
    //     //     valueChangerList.push(
    //     //         <ValueChanger hasBorder={true} key={keyIndex} property={property} value={value} keyHistory={[...props.keyHistory, currentIndex]} propertiesDB={props.propertiesDB} onValueChange={sendChange}></ValueChanger>
    //     //     )
    //     //     keyIndex++;
    //     // }
    //    // const [valueChangerList, setValueChangerList] = useState(ta);

    //     return(

    //         <Stack spacing={1} sx={{pl: 0,}}>
    //             <Select value={currentIndex} onChange={handleChange} sx={{}}>
    //                 {dropdownItems}
    //             </Select>
    //             {valueChangerList}
    //         </Stack>

    //     )
}

export default CollapsibleChanger
