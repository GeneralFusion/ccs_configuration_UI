console.log("Graph")
let g

window.addEventListener('DOMContentLoaded', () => {
    createGraph()
})
class Graph{
    #xData//Private fields
    #yData
    
    #graph
    #title
    #timer
    #isDecimating

    constructor(xData = [], yData =[], panEnabled = true,title="Title", graphType = "line"){//IF Pan is enabled, drag can not be. 
        
        
        this.#graph = new Chart(document.getElementById('myChart').getContext('2d'), {
            type: graphType,
            data: {
                datasets: [
                    {
                        data: [],
                        backgroundColor: 'rgba(255, 0, 100, 0)',
                        borderColor: 'rgba(200, 0, 150, 1)',
                        radius: 0
                    }
                ]
            },
            options: {
                plugins: {
                  zoom: {
                    zoom: {
                      wheel: {
                        enabled: true,
                      },
                      pinch: {
                        enabled: true
                      },
                      drag: {
                        enabled: true
                      },
                      mode: 'x',
                      onZoomComplete: this.#getZoomInfo
                    },
                    pan: {
                        enabled: panEnabled,
                        mode: 'x',
                        modifierKey: 'ctrl'
                    },
                    limits:{
                        x:{
                            min: 'original',
                            max: 'original',
               
                            
                        },
                        y: {
                            min: 'original',
                            max: 'original'
                        }
                      },

                  },
                  title:{
                    display: true,
                    text: title
                  },
                  decimation:{
                    enabled: true,
                    algorithm: 'min-max',
                   
                }
                },
                scales: {
                    x: {
                        type: 'linear',
              
                    },
                    y: {
                        type: 'linear',
                    
                    }
                },

                parsing: false,
                normalized: true,
                
               
              }

        })

        this.#xData = this.#graph.data.datasets[0].data
        this.#yData = this.#graph.data.labels
        this.#title = this.#graph.options.plugins.title
        this.#isDecimating = this.#graph.options.plugins.decimation.enabled
    }
    setTitle(newTitle){
        this.#title.text = newTitle
        console.log(this.#graph.options.plugins.title.text)
    }
    resetZoom(){
        this.#graph.resetZoom('zoom')
    }
    #getZoomInfo =  async () => {

         const {min, max} = this.#graph.scales.x
         clearTimeout(this.#timer)
        this.#timer = setTimeout(async () => {
            const response = await fetch(`/getGraphData?min=${Math.round(min)}&max=${Math.round(max)}`)
            const data = await response.json()
            this.setX(data)
            this.update()
            console.log(`${min} | ${max}`)
        }, 1000)

    }
    update(){
        console.log("Updating: " + this.#yData)
        this.#graph.update('none')
    }

    setX(newXData){
        this.#xData.length = 0

        for(let dataPoint of newXData){
            this.#xData.push(dataPoint)
        }
        
    }

    setY(newYData){
        for(let dataPoint of newYData){
            this.#yData.push(dataPoint)
        }
    }

    

    

}
function createGraph(){
    g = new Graph()
    console.log("created new graph")
}

async function getData(){
    g.setTitle("Loading")
    g.update()
    const response = await fetch('/getGraphData?min=1&max=10000000')
    const data = await response.json()
    g.setTitle("Data Loaded")
    console.log(data)
    g.setX(data)
    g.update()
    
 
}

function resetZoom(){
    g.resetZoom()
}
