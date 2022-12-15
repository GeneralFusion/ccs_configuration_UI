import Button from "@mui/material/Button"
import { LinearProgress, TextField } from "@mui/material"

import Client from "./Client.js"
import ValueChanger from "./ValueChanger.js"
import React, { useState } from "react"
import { Container } from "@mui/material"

const APPURL = "/ccs_ui"
let clientsConfig, adminPropertiesConfig
function Controller(props) {
  const [clients, setClients] = useState([])
  const [adminProperties, setAdminProperties] = useState([])
  const [saveButton, setSaveButton] = useState({
    text: "Save Changes",
    color: "primary",
  })
  const [commitMessage, setCommitMessage] = useState("")
  const styles = {
    commitComment: {
      height: 70,
      width: "100%",
      marginTop: 1,
    },
    saveButton: {
      marginTop: 0,
      width: 1,
    },
  }
  const homeButton = <Button href={`${APPURL}/home`}>Home</Button>
  console.log("Controller rerender")
  useState(async () => {
    await initController()
  }, [])

  const changeValue = (sendValue) => {
    //Array destructuring. Will take the array of property and value and make it into two variables.
    if (!Array.isArray(sendValue[1])) {
      //If admin property
      const [keyHistory, newValue] = sendValue
      let adminPropertiesReference = adminPropertiesConfig
      for (let i = 0; i < keyHistory.length - 1; i++) {
        //Go through keyhistory (except last one). Now client is pointing to the last object which is the {proprety: value}.
        adminPropertiesReference = adminPropertiesReference[keyHistory[i]]
      }
      adminPropertiesReference[keyHistory[keyHistory.length - 1]] = newValue
    } else {
      const [clientNumber, [keyHistory, newValue]] = sendValue
      let client = clientsConfig[clientNumber]
      for (let i = 0; i < keyHistory.length - 1; i++) {
        //Go through keyhistory (except last one). Now client is pointing to the last object which is the {proprety: value}.
        client = client[keyHistory[i]]
      }
      client[keyHistory[keyHistory.length - 1]] = newValue
    }
  }
  const generateClients = (json, propertiesDB, scopesDB, userLevel) => {
    let tempArray = []
    for (const [clientNumber, clientData] of Object.entries(json)) {
      tempArray.push(
        <Client
          sx={{}}
          key={clientNumber}
          userLevel={userLevel}
          clientNumber={clientNumber}
          clientName={clientData.name}
          properties={clientData}
          propertiesDB={propertiesDB}
          scopesDB={scopesDB}
          onValueChange={changeValue}
        ></Client>
      )
    }
    return tempArray
  }

  const generateAdminProperties = (properties, userLevel, propertiesDB) => {
    let tempAdminProperties = []
    for (const [property, value] of Object.entries(properties)) {
      tempAdminProperties.push(
        <ValueChanger
          property={property}
          keyHistory={[]}
          value={value}
          userLevel={userLevel}
          propertiesDB={propertiesDB}
          onValueChange={changeValue}
        ></ValueChanger>
      )
    }
    return tempAdminProperties
  }
  async function getData() {
    try {
      const req = await fetch(`${APPURL}/getData/`, { method: "GET" })
      const json = await req.json()
      return json
    } catch (err) {
      console.log("Error fetching data")
    }
  }
  async function initController() {
    const data = await getData()
    const propertiesDB = data["propertiesDB"]
    const scopesDB = data["scopesDB"]
    const userLevel = data["permissionLevel"]
    const adminProps = data["adminProperties"]
    if (adminProps) {
      setAdminProperties(
        generateAdminProperties(adminProps, userLevel, propertiesDB)
      )
    }

    clientsConfig = data["clients"]
    adminPropertiesConfig = data["adminProperties"]

    let tempClients = generateClients(
      data["clients"],
      propertiesDB,
      scopesDB,
      userLevel
    ) //Properties DB seems to be passes by reference
    setClients(tempClients)
  }

  const saveChanges = async () => {
    console.log("Saving: ")
    setSaveButton({ text: "Saving Changes...", color: "secondary" })

    const resp = await fetch(`${APPURL}/getData/`, {
      //Send new config to server
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        config: clientsConfig,
        adminConfig: adminPropertiesConfig,
        commitMessage: commitMessage,
      }),
    })
    console.log(resp)
    if (resp.ok) {
      //IF sucessfully pushed to github
      setSaveButton({ text: "Changes Saved!", color: "sucess" })
      setTimeout(() => {
        setSaveButton({ text: "Save Changes", color: "primary" })
      }, 5000)
    } else {
      console.log(resp)
      setSaveButton({
        text: resp.status === 513 ? "Email not provided" : "Not Authorized",
        color: "error",
      })
    }
  }

  if (clients.length > 0) {
    return (
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        {homeButton}
        <h1>Controls</h1>
        {adminProperties}
        {clients}
        <TextField
          inputProps={{ style: { textAlign: "center", fontSize: "1em" } }}
          sx={styles.commitComment}
          placeholder="Commit Message"
          onChange={(e) => setCommitMessage(e.target.value)}
          value={commitMessage}
        ></TextField>
        <Button
          variant="contained"
          color={saveButton.color}
          onClick={() => saveChanges()}
          sx={styles.saveButton}
          disabled={saveButton.text !== "Save Changes"}
        >
          {saveButton.text}
        </Button>
        {saveButton.text === "Saving Changes..." && <LinearProgress />}
      </div>
    )
  } else {
    return (
      <Container sx={{ textAlign: "center" }}>
        <h1>Fetching Information...</h1>
        <LinearProgress></LinearProgress>
      </Container>
    )
  }
}

export default Controller
