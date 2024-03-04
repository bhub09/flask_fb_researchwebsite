/*
  Demonstrate how to create a line chart
*/


async function getData() {
  const response = await fetch("static/data/DischargeAverageAndSTDData_Electrolyte_All-CSV.csv");
  const data = await response.text(); // CSV is in TEXT format
  // console.log(data);

  const xDuration = []; // x-axis labels = duration values
  const ySodiumPower = []; // y-axis global power values
  const yAcidicPower = []; // y-axis global power values
  const yDESPower = []; // y-axis global power values
  const yFucoidanPower = []; // y-axis global power values

  // \n = new line character
  // split('\n') will separate table into an array of individual rows
  // slice(start, end) - return a new array starting at index start
  //   up to but not including index end
  const table = data.split("\n").slice(1);
  // console.log(table);

  table.forEach((row) => {
    const columns = row.split(","); // split each row on the commas
    const duration = columns[0];        // assign year value
    xDuration.push(duration);              // push year value into xYears array
    
    const sodiumPower = parseFloat(columns[1]);
    ySodiumPower.push(sodiumPower);         // push temp sodiumPower to store mean sodium power values

    const AcidicPower = parseFloat(columns[2]);
    yAcidicPower.push(AcidicPower);         // push temp AcidicPower to store mean acidic power values

    const DESPower = parseFloat(columns[3]);
    yDESPower.push(DESPower);         // push temp DESPower to store mean DES power values

    const FucoidanPower = parseFloat(columns[4]);
    yFucoidanPower.push(FucoidanPower);         // push temp FucoidanPower to store mean Fucoidan power values
  

    // console.log(duration, sodiumPower, AcidicPower, DESPower, FucoidanPower)
  });

  return { xDuration, ySodiumPower, yAcidicPower, yDESPower, yFucoidanPower};
}

async function createChart() {
  const data = await getData(); // createChart will wait until getData() is finished processing
  const ctx = document.getElementById("myChart");
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.xDuration,
      datasets: [
        {
          label: `Sodium Chloride Hydrogel`,
          data: data.ySodiumPower,
          fill: false,
          backgroundColor: 'rgba(0, 102, 225, 0.2)',
          borderColor: 'rgba(0, 102, 225, 1)',
          borderWidth: 1
        },
        {
          label: `Acidic Hydrogel`,
          data: data.yAcidicPower,
          fill: false,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: `DES Hydrogel`,
          data: data.yDESPower,
          fill: false,
          backgroundColor: 'rgba(255, 204, 153, 0.2)',
          borderColor: 'rgba(255, 165, 0, 1)',
          borderWidth: 1
        },
        {
          label: `Fucoidan Hydrogel`,
          data: data.yFucoidanPower,
          fill: false,
          backgroundColor: 'rgba(0, 153, 51, 0.2)',
          borderColor: 'rgba(0, 153, 51, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true, // Re-size based on screen size
      scales: {         // Display options for x and y axes
        x: {
          title: {
            display: true,
            text: 'Duration',  // x-axis title
            font: {
              size: 20
            },
          },
          ticks: {
            // Labeling of tick marks can be controlled by code and font size
            callback: function(val, index) {
              return index % 2 === 0 ? this.getLabelForValue(val) : '';
            },
            font: {
              size: 12
            }
          }
        },
        y: {
          title: {
            display: true,
            text: 'Power (mW)',
            font: {
              size: 20
            }
          },
          ticks: {
            maxTicksLimit: data.ySodiumPower.length, // limit # of ticks
            font: {
              size: 12
            }
          }
        }
      },
      plugins: {                  // Display options for title and legend
        title: {
            display: true,
            text: 'Power Reading of Electrolytes during Battery Discharge over Time',
            font: {
                size: 24,
            },
            color: '#black',
            padding: {
                top: 10,
                bottom: 30
            }
        },
        legend: {
            align: 'center',
            position: 'bottom',
        }
      }
    }
  });
}

createChart()