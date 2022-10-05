console.log("Graph")
let mainChart

window.addEventListener('DOMContentLoaded', () => {
    createGraph()
})

function createGraph(){
    const ctx = document.getElementById('myChart').getContext('2d');
    mainChart = new Chart(ctx, {
        type: 'line',
data: {
  labels: [2,6],
  datasets: [{
    data: [20,10]
  }]
}
    });
}

async function getData(){
    const response = await fetch('/getGraphData')
    const data = await response.json()
    mainChart.data.datasets[0].data = data[0]
    mainChart.data.labels = data[1]
    mainChart.update()

    console.log(data)
}

function addPoint(){
    console.log("adding point")
    const yValue = Math.floor(Math.random() * 1000);
    mainChart.data.datasets[0].data.push(yValue)

    mainChart.update()
    console.log(newpoint)
}
