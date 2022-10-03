import ValueChanger from './ValueChanger'
import Stack from '@mui/material/Stack'
function Section(props) {
    console.log(props.property)
    console.log(props.value)
    let valueChangerList = []
    const sendChange = (newValue) => {
        console.log(props.property)
        console.log(newValue)
        props.onValueChange(newValue)
    }
    let i = 1
    for (const [property, value] of Object.entries(props.value)) {
        valueChangerList.push(
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
        )
    }
    return (
        <Stack spacing={0} sx={{}}>
            {valueChangerList}
        </Stack>
    )
}
export default Section
