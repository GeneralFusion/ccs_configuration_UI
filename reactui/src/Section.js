import ValueChanger from './ValueChanger'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
function Section(props) {
    console.log(props.property)
    console.log(props.value)
    let valueChangerList = []
    const sendChange = (newValue) => {
        console.log(props.property)
        console.log(newValue)
        props.onValueChange(newValue)
    }
    for (const [property, value] of Object.entries(props.value)) {
        valueChangerList.push(
            <Grid md={property == 'vars' || 
            props.property == 'connectedDevices' || 
            property == 'rowcolConfig' ? 12 : 6}>
            <ValueChanger
                sx={{}}
                key={property}
                property={property}
                value={value}
                keyHistory={props.keyHistory}
                propertiesDB={props.propertiesDB}
                scopesDB={props.scopesDB}
                onValueChange={sendChange}
            ></ValueChanger>
            </Grid>

        )
    }
    return(
        <Grid container>
            {valueChangerList}
        </Grid>
    )
    // return (
    //     <Stack spacing={0} sx={{}}>
    //         {valueChangerList}
    //     </Stack>
    // )
}
export default Section
