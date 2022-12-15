import React, { useState, useRef } from "react"
import Grid from "@mui/material/Unstable_Grid2/Grid2"
import ValueChanger from "./ValueChanger"
import IconButton from "@mui/material/IconButton"
import CopyButton from "@mui/icons-material/ContentCopy"
import CheckmarkButton from "@mui/icons-material/CheckCircle"

import Button from "@mui/material/Button"
import { useTheme } from "@mui/material/styles"
import { TextField } from "@mui/material"

function ChannelChanger(props) {
  const [isActive, setisActive] = useState(props.isActive)
  const [buttonText, setButtonText] = useState(isActive ? "Active" : "Inactive")
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [showChannelCopyText, setShowChannelCopyText] = useState(false)
  const [errorText, setErrorText] = useState("")
  const channelCopyText = useRef("")
  const typeDB = props.propertiesDB
  const properties = props.value
  const theme = useTheme()
  let channelComponent
  //console.log(`Disabled ${props.isDisabled}`)
  const sendChange = (newValue) => {
    props.onValueChange(newValue)
  }
  const updateChannelCopyText = (e) => {
    channelCopyText.current = e.target.value
  }
  const sendChannelCopy = () => {

    if (/[^\d,-]/gm.test(channelCopyText.current)) {//If input contains invalid characters just ignore it.
      setErrorText("Invalid input")
    } else {
      let cRange = []
      for (let channelRangeInpout of channelCopyText.current.split(",")) {
        //Loop through the comma seperated list of channels and push them onto the cRange array. If there is a range then push that range on.
        let trimmedChannel = channelRangeInpout.trim()
        if (trimmedChannel === "") {
          continue
        }
        if (trimmedChannel.includes("-")) {//If range given.
          const ranges = trimmedChannel.split("-")
          const start = parseInt(ranges[0])
          const end = parseInt(ranges[ranges.length - 1])//Used last elemnent because if user entereed many '-'s then this will acount for that.
          for (let i = start; i <= end; i++) {
            cRange.push(i)
          }
        } else {//If not a range given then just push it on.
          cRange.push(parseInt(trimmedChannel))
        }
      }
      const finalChannels = [...new Set(cRange)]//Make channels gotten into a set (remove duplicates) and back into an array.
      props.onChannelCopy([
        finalChannels,
        props.keyHistory[props.keyHistory.length - 1],
      ])
    }
  }
  const handleChange = () => {
    if (isConfirmed) {
      setisActive(!isActive)
      setButtonText(isActive ? "Inactive" : "Active")
      setIsConfirmed(false)
      props.channelUpdate(props.channelNumber)
    } else {
      setButtonText("Are you sure?")
      setIsConfirmed(true)
    }
  }
  if (isActive) {//Different component tree for if it is disbaled or enabled. Could make it one but would have many inline conditionals. 
    channelComponent = (
      <Grid
        container
        spacing={1}
        sx={{ borderLeft: "solid 2px", borderRight: "solid 2px", px: 1 }}
      >
        <Grid xs={12} md={12}>
          <Grid container>
            <Grid xs={10}>
              <h3 style={{ marginTop: 0, marginBottom: 0 }}>
                Channel {props.channelNumber}
              </h3>
              {showChannelCopyText ? (
                <TextField
                  helperText={errorText}
                  disabled={props.isDisabled}
                  placeholder={"E.g. 1,3,6-8"}
                  onChange={updateChannelCopyText}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={sendChannelCopy}>
                        {<CheckmarkButton />}
                      </IconButton>
                    ),
                  }}
                  inputProps={{
                    style: {
                      textAlign: "left",
                      fontSize: "1em",
                      height: "5px",
                    },
                  }}
                  sx={{ width: "90%" }}
                ></TextField>
              ) : null}
            </Grid>
            <Grid xs={2}>
              <IconButton
                disabled={props.isDisabled}
                sx={{}}
                onClick={() => {
                  setShowChannelCopyText(!showChannelCopyText)
                }}
              >
                {<CopyButton />}
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        <Grid xs={12} md={6}>
          <ValueChanger
            property={"name"}
            isDisabled={props.isDisabled}
            value={properties[typeDB["name"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"coupling"}
            isDisabled={props.isDisabled}
            value={properties[typeDB["coupling"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"bwLimit"}
            isDisabled={props.isDisabled}
            value={properties[typeDB["bwLimit"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"probe"}
            isDisabled={props.isDisabled}
            value={properties[typeDB["probe"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"tdiv"}
            isDisabled={props.isDisabled}
            value={properties[typeDB["tdiv"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"timeOffset"}
            isDisabled={props.isDisabled}
            value={properties[typeDB["timeOffset"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"vdiv"}
            isDisabled={props.isDisabled}
            value={properties[typeDB["vdiv"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"voltageOffset"}
            isDisabled={props.isDisabled}
            value={properties[typeDB["voltageOffset"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={props.propertiesDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={12}>
          <Button
            disabled={props.isDisabled}
            variant="contained"
            sx={{
              ":hover": { background: theme.palette.primary.dark },
              background: isConfirmed
                ? theme.status.warning
                : theme.status.enable,
              width: "100%",
              height: 50,
            }}
            onClick={handleChange}
          >
            <h3>{buttonText}</h3>
          </Button>
        </Grid>
      </Grid>
    )
  } else {
    channelComponent = (
      <Grid
        container
        spacing={1}
        sx={{ borderLeft: "solid 2px", borderRight: "solid 2px", px: 1 }}
      >
        <Grid xs={12} md={12}>
          <Grid container>
            <Grid xs={10}>
              <h3 style={{ marginTop: 0, marginBottom: 0 }}>
                Channel {props.channelNumber}
              </h3>
              {showChannelCopyText ? (
                <TextField
                  disabled={props.isDisabled}
                  onChange={updateChannelCopyText}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={sendChannelCopy}>
                        {<CheckmarkButton />}
                      </IconButton>
                    ),
                  }}
                  inputProps={{
                    style: {
                      textAlign: "left",
                      fontSize: "1em",
                      height: "5px",
                    },
                  }}
                  sx={{ width: "90%" }}
                ></TextField>
              ) : null}
            </Grid>
            <Grid xs={2}>
              <IconButton
                disabled={true}
                sx={{}}
                onClick={() => {
                  setShowChannelCopyText(!showChannelCopyText)
                }}
              >
                {<CopyButton />}
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"name"}
            isDisabled={true}
            value={properties[typeDB["name"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"coupling"}
            isDisabled={true}
            value={properties[typeDB["coupling"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"bwLimit"}
            isDisabled={true}
            value={properties[typeDB["bwLimit"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"probe"}
            isDisabled={true}
            value={properties[typeDB["probe"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"tdiv"}
            isDisabled={true}
            value={properties[typeDB["tdiv"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"timeOffset"}
            isDisabled={true}
            value={properties[typeDB["timeOffset"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"vdiv"}
            isDisabled={true}
            value={properties[typeDB["vdiv"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={typeDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={6}>
          <ValueChanger
            property={"voltageOffset"}
            isDisabled={true}
            value={properties[typeDB["voltageOffset"]["name"]]}
            keyHistory={props.keyHistory}
            propertiesDB={props.propertiesDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
        <Grid xs={12} md={12}>
          <Button
            variant="contained"
            disabled={props.isDisabled}
            sx={{
              ":hover": { background: theme.palette.primary.dark },
              background: isConfirmed
                ? theme.status.warning
                : theme.status.disable,
              width: "100%",
              height: 50,
            }}
            onClick={handleChange}
          >
            <h3>{buttonText}</h3>
          </Button>
        </Grid>
      </Grid>
    )
  }

  return channelComponent
}

export default ChannelChanger
