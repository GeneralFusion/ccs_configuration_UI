import ValueChanger from "./ValueChanger"
import React, { useState } from "react"
import ScopeChanger from "./ScopeChanger"
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material"

function CollapsibleChanger(props) {
  const [refresh, setRefresh] = useState(false)
  const sendChange = (newValue) => {
    // if (newValue[0][newValue[0].length - 1] === "name") { //THIS DOESN'T CHECK WHETHER NAME WAS CHANGED PROPERLY. CHANGE IT SO ONLY NAME UPDATES REFRESH THE COLLAPSIBLE.
    //   setRefresh(!refresh)
    // }
    setRefresh(!refresh)
    props.onValueChange(newValue)
  }
  let items = []
  if (props.property === "Scopes") {
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
  } else {
    for (const [property, value] of Object.entries(props.value)) {
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
}

export default CollapsibleChanger
