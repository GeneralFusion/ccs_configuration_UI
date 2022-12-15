import ValueChanger from "./ValueChanger"
import Grid from "@mui/material/Unstable_Grid2"
function Section(props) {
  console.log(props.property)
  console.log(props.value)
  let valueChangerList = []
  let listChangerList = []

  const sendChange = (newValue) => {
    console.log(props.property)
    console.log(newValue)
    props.onValueChange(newValue)
  }
  for (const [property, value] of Object.entries(props.value)) {
    if (props.propertiesDB[property]["type"] === "list") {
      listChangerList.push(
        <Grid key={property} md={6}>
          <ValueChanger
            sx={{}}
            key={property}
            property={property}
            value={value}
            userLevel={props.userLevel}
            keyHistory={props.keyHistory}
            propertiesDB={props.propertiesDB}
            scopesDB={props.scopesDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
      )
    } else {
      valueChangerList.push(
        <Grid keys={property} md={12}>
          <ValueChanger
            sx={{}}
            key={property}
            property={property}
            value={value}
            userLevel={props.userLevel}
            keyHistory={props.keyHistory}
            propertiesDB={props.propertiesDB}
            scopesDB={props.scopesDB}
            onValueChange={sendChange}
          ></ValueChanger>
        </Grid>
      )
    }
  }
  return (
    <Grid container>
      {valueChangerList}
      {listChangerList}
    </Grid>
  )
}
export default Section
