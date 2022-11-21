// console.log("Graph")
// let graph

// window.addEventListener('DOMContentLoaded', () => {
//     createGraph()
// })
// class Graph{
//     #xData//Private fields
//     #yData
    
//     #graph
//     #title
//     #timer
//     #isDecimating

//     constructor(xData = [], yData =[], panEnabled = true,title="Title", graphType = "line"){//IF Pan is enabled, drag can not be. 
        
        
//         this.#graph = new Chart(document.getElementById('myChart').getContext('2d'), {
//             type: graphType,
//             data: {
//                 datasets: [
//                     {
//                         data: [],
//                         backgroundColor: 'rgba(255, 0, 100, 1)',
//                         borderColor: 'rgba(200, 0, 150, 1)',
//                         radius: 1
//                     }
//                 ]
//             },
//             options: {
//                 plugins: {
//                   zoom: {
//                     zoom: {
//                       wheel: {
//                         enabled: true,
//                       },
//                       pinch: {
//                         enabled: true
//                       },
//                       drag: {
//                         enabled: true
//                       },
//                       mode: 'x',
//                       onZoomComplete: this.#getZoomInfo
//                     },
//                     pan: {
//                         enabled: panEnabled,
//                         mode: 'x',
//                         modifierKey: 'ctrl'
//                     },
//                     limits:{
//                         x:{
//                             min: 'original',
//                             max: 'original',
               
                            
//                         },
//                         y: {
//                             min: 'original',
//                             max: 'original'
//                         }
//                       },

//                   },
//                   title:{
//                     display: true,
//                     text: title
//                   },
//                   decimation:{
//                     enabled: false,
//                     algorithm: 'min-max',
                   
//                 }
//                 },
//                 scales: {
//                     x: {
//                         type: 'linear',
              
//                     },
//                     y: {
//                         type: 'linear',
                    
//                     }
//                 },

//                 parsing: false,
//                 normalized: true,
                
               
//               }

//         })

//         this.#xData = this.#graph.data.datasets[0].data
//         this.#yData = this.#graph.data.labels
//         this.#title = this.#graph.options.plugins.title
//         this.#isDecimating = this.#graph.options.plugins.decimation.enabled
//     }
//     setTitle(newTitle){
//         this.#title.text = newTitle
//         console.log(this.#graph.options.plugins.title.text)
//     }
//     resetZoom(){
//         this.#graph.resetZoom('zoom')
//     }
//     #getZoomInfo =  async () => {

//          const {min, max} = this.#graph.scales.x
//          clearTimeout(this.#timer)
//         this.#timer = setTimeout(async () => {
//             const response = await fetch(`/getGraphData?min=${Math.round(min)}&max=${Math.round(max)}`)
//             const data = await response.json()
//             this.setX(data)
//             this.update()
//             console.log(`${min} | ${max}`)
//         }, 400)

//     }
//     update(){
//         console.log("Updating: " + this.#yData)
//         this.#graph.update('none')
//     }

//     setX(newXData){
//         this.#xData.length = 0

//         for(let dataPoint of newXData){
//             this.#xData.push(dataPoint)
//         }
        
//     }

//     setY(newYData){
//         for(let dataPoint of newYData){
//             this.#yData.push(dataPoint)
//         }
//     }

    

    

// }
// function createGraph(){
//     graph = new Graph()
//     console.log("created new graph")
// }

// async function getData(){
//     graph.setTitle("Loading")
//     graph.update()
//     const response = await fetch('/getGraphData?min=1&max=10000000')
//     const data = await response.json()
//     graph.setTitle("Data Loaded")
//     console.log(data)
//     graph.setX(data)
//     graph.update()
    
 
// }
let data, graph, timer
let dontFetch = true
let firstFetch,isPanning = false
let selectedChannelsQuery = ''
let selectedChannels = []
let checkBoxes = new Array(8).fill(false)
let mouseCoords = [0,0]//Check if distance dragged is not nothing
async function resetZoom(){
    //graph.resetZoom()
    dontFetch = true
    graph.updateOptions({title: 'Resetting Graph...'})

    await getData()
    graph.resetZoom()
    graph.updateOptions({title: 'GRAPH'})

}
const updateData =  async () => {
    const [min, max] = graph.xAxisRange()
    console.log("Fetching " + min + " to " + max)
    graph.updateOptions({title: 'Retrieving Data...'})
    document.getElementById("loadingBar").style.display = 'block'
    const response = await fetch(`/getGraphData?min=${Math.round(min)}&max=${Math.round(max)}${selectedChannelsQuery}`)
    document.getElementById("loadingBar").style.display = 'none'
    const [datax, infoObject] = await response.json()
    updateInfoDiv(infoObject)
    console.log("Gotten Data " + Math.round(max - min) + " points")
    data = datax
    dontFetch = true
    graph.updateOptions({'file':data, title: 'GRAPH'})
    




}
async function getData(){
    [selectedChannelsQuery, selectedChannels] = getSelectedChannels()
    document.getElementById("getDataButton").innerHTML = "Fetching Data..."
    document.getElementById("title").innerHTML = `Selected Channels: ${selectedChannels}`    
    enableVisibility(['loadingBar'])
    const response = await fetch(`/getGraphData?min=1&max=50000000${selectedChannelsQuery}`)
    const [data, infoObject] = await response.json()
    enableVisibility(['zoomButton', 'shiftDragInfo'])
    document.getElementById("loadingBar").style.display = 'none'
    updateInfoDiv(infoObject)
    document.getElementById("getDataButton").innerHTML = "Get Data"
    createButtons(selectedChannels)
    graph = new Dygraph(
        document.getElementById("myGraph"),
        // For possible data formats, see http://dygraphs.com/data.html
        // The x-values could also be dates, e.graph. "2012/03/15"
       data
        ,
        {
          // options go here. See http://dygraphs.com/options.html
          labelsDiv: document.getElementById("labelsDiv"),
          legend:'always',
          labels: ['Time'].concat(selectedChannels.map(channelNumber => `Channel ${channelNumber}`)),//Making the labels say the channel names.
          animatedZooms: true,
          title: 'Graph :)',
          width: document.getElementById("graphColumn").offSetWidth,
          height: 400,
          colors: ['#00fff7', '#ff00ee', '#ffff00', '#22ff00', '#fca103', '#fc0303', '#fc037b'],
          drawAxesAtZero: true,
          axisLineColor: 'white',
          axes: {
            x: {
                axisLabelFormatter: (x) => {
                    if(x % 1e6 == 0 || x % 1e5 == 0){
                        return x / 1e6 + 'ms'
                    }
                    return x / 1e3 + 'μs'
                }
            }
            },


          zoomCallback: updateData,//MAYBE GET RID OF THIS!?!?!?
          animatedZooms: false,

          //drawCallback: panningData
        });
    
    firstFetch = true
    document.getElementById("buttonsDiv").scrollIntoView({behavior:'smooth'})
    //graph.resetZoom()
    
 
}
// function panningData(x,initial){//Conditionals make sure that unncesesary rerenders dont happen
//     // console.log(console.log(x.xAxisRange()))

//     clearTimeout(timer)
//     if(initial){
//         return
//     }
//     if(dontFetch){
//         dontFetch = false
//         console.log("Panning Cancelled")
//         return
//     }
    
//     timer = setTimeout(() => {
//         console.log("Panning Complete")
//         updateData()
//     }, 1000)
// }
//This part is for panning
window.addEventListener("keydown", (e) => {
    if(e.shiftKey){
        isPanning = true
    }
})
window.addEventListener("keyup", (e) => {
    if(e.shiftKey){
        isPanning = false
    }
})
document.getElementById("myGraph").addEventListener('mousedown', (e) => {
    mouseCoords = [e.clientX, e.clientY]
})
document.getElementById("myGraph").addEventListener('mouseup', (e) => {
    if(!isPanning){
        return
    }
    const distanceDragged = Math.sqrt(Math.abs(((mouseCoords[0] - e.clientX)) + ((mouseCoords[1] - e.clientY)) ))//Not the real formula.
    if(distanceDragged > 3){//3 is arbitrary
        console.log("Update")
        updateData()
    }    
})
function updateInfoDiv(infoObject){
    const infoString = `x: ${infoObject.startIndex} to x: ${infoObject.endIndex}. ${infoObject.amountOfPoints} points. Channels ${infoObject.channels}`
    document.getElementById("infoObject").innerHTML = infoString
}
function enableVisibility(elements){//Helper function to easily set display to block for multiple elements
    for(let element of elements){
        document.getElementById(element).style.display = 'block'
    }
}
function checkBoxCheck(num){
    checkBoxes[num - 1] = !checkBoxes[num - 1] 
}
function getSelectedChannels(){
    const channelsSelect = document.getElementById("channelsSelect")
    let selectedChannels = ""
    let selectedChannelsArr = []
    for(let i in checkBoxes){
        if(checkBoxes[i]){
            channelNum = parseInt(i) + 1
            selectedChannels += "&channel=" + channelNum
            selectedChannelsArr.push(channelNum)
        }
        
    }
    return [selectedChannels, selectedChannelsArr]
}
function createButtons(channels){
    const buttonsDiv = document.getElementById("buttonsDiv")
    buttonsDiv.textContent = ''
    for(let i = 0; i < channels.length; i++){
        const but = document.createElement("button")
        but.classList.add('button', 'is-fullwidth', 'is-primary', 'mb-6')
        but.innerHTML = `Channel ${channels[i]}`

        but.onclick = (e) => {
            graph.setVisibility(i, !graph.visibility()[i])
            if(!graph.visibility()[i]){
                but.classList.add('is-danger')
            }
            else{
                but.classList.remove('is-danger')

            }
            //but.innerHTML = graph.visibility()[i] ? `Channel ${channels[i]}` : `Enable Channel ${channels[i]}`
        }
        buttonsDiv.appendChild(but)
    }

}
function uncheckBoxes(){
    const checkBoxesElements = document.querySelectorAll('input[type=checkbox]')
    for(let checkbox of checkBoxesElements){
        checkbox.checked = false
    }
}
window.addEventListener('DOMContentLoaded', () => {
    uncheckBoxes()//Some browser will not uncheck boxes on refresh. Since we only know what channels are selected after the user clicks the boxes, we nee dthis to reset everything 
})
