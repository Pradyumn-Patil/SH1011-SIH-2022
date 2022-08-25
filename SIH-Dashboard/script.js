let talukaData = 'http://localhost/sih/geo%20json/india_taluk.geojson.json'
let disasterURL = 'http://localhost/sih/geo%20json/Disaster_state_district_taluka_yearwise.json'
let stateURL = 'http://localhost/sih/geo%20json/states-centers.json'

//let talukaData = 'http://192.168.0.113/sih/geo%20json/india_taluk.geojson.json'
//let disasterURL = 'http://192.168.0.113/sih/geo%20json/Disaster_state_district_taluka_yearwise.json'
//let stateURL = 'http://192.168.0.113/sih/geo%20json/states-centers.json'

let educationData
let stateCenterData
let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let select = document.getElementById('disaster');

let arrayOfID = []

let drawMap = () => {

  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 950 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
  let state = document.getElementById("state")
  var stateName = state.options[state.selectedIndex].text;
  let stateData = countyData.filter(function (data) {
    return data.properties.NAME_1 === stateName;
  });

  selectedStateData = stateCenterData.filter(function (data) {
    return data.NAME_1 === stateName;
  });


  let stateDisasterData = educationData.filter(function (data) {
    return data.state === stateName;
  });

  let stateeducationData = educationData.filter(function (data) {
    return data.state === stateName;
  });

  var LS = 0,
    EQ = 0,
    CYC = 0,
    FL = 0,
    UFL = 0,
    HWV = 0,
    TSU = 0,
    CHEM = 0,
    NUC = 0,
    BIO = 0;
  for (var i = 0; i < stateeducationData.length; i++) {
    EQ = EQ + stateeducationData[i].EQ
    LS = LS + stateeducationData[i].LS
    CYC = CYC + stateeducationData[i].CYC
    FL = FL + stateeducationData[i].FL
    UFL = UFL + stateeducationData[i].UFL
    HWV = HWV + stateeducationData[i].HWV
    TSU = TSU + stateeducationData[i].TSU
    CHEM = CHEM + stateeducationData[i].CHEM
    NUC = NUC + stateeducationData[i].NUC
    BIO = BIO + stateeducationData[i].BIO
    // caculate total event in a state in a state .
  }

  var scale = selectedStateData[0].scale
  var long = selectedStateData[0].long
  var lat = selectedStateData[0].lat



  var projection = d3.geoMercator()
    .scale(scale)
    .center([long, lat])
    .translate([width / 2 - margin.left, height / 2]);
  d3.select("#canvas")
    .selectAll("path")
    .remove();
  canvas.selectAll('path')
    .data(stateData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath().projection(projection))
    .on("click", clicked)
    .attr('class', 'county')
    .attr('fill', (countyDataItem) => {
      let id = countyDataItem['properties']['ID_3']
      let county = educationData.find((item) => {
        return item['fips'] === id
      })
      let disasterid = select.options[select.selectedIndex].value;
      let percentage = county[disasterid]
      if (percentage <= 15) {
        return 'tomato'
      } else if (percentage <= 30) {
        return 'orange'
      } else if (percentage <= 45) {
        return 'lightgreen'
      } else {
        return 'limegreen'
      }
    })
    .attr('data-fips', (countyDataItem) => {
      return countyDataItem['id']
    })
    .attr('data-education', (countyDataItem) => {
      let id = countyDataItem['properties']['ID_3']
      let county = educationData.find((item) => {
        return item['fips'] === id
      })
      let disasterid = select.options[select.selectedIndex].value;
      let percentage = county[disasterid]
      return percentage
    })
    .on('mouseover', (countyDataItem) => {
      let disasterid = select.options[select.selectedIndex].value;

      tooltip.transition()
        .style('visibility', 'visible')
      let id = countyDataItem['properties']['ID_3']
      let county = educationData.find((item) => {
        return item['fips'] === id
      })
      tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' +
        county['state'] + ' : ' + county[disasterid] + '% for Disaster ID - ' + disasterid)
      tooltip.attr('data-education', county[disasterid])
    })

    .on('mouseout', (countyDataItem) => {
      tooltip.transition()
        .style('visibility', 'hidden')
    })
    document.getElementsByClassName("main-area")[0].remove();
  document.getElementsByClassName("legend")[0].remove();
  document.getElementsByClassName("overlay")[0].remove();
    drawBarChart(stateName,"state")
}


function clicked(d) {
  let id = d['properties']['ID_3']

  document.getElementsByClassName("main-area")[0].remove();
  document.getElementsByClassName("legend")[0].remove();
  document.getElementsByClassName("overlay")[0].remove();
  drawBarChart(id,'taluka')
}

d3.json(talukaData).then(
  (data, error) => {
    if (error) {


    } else {

      countyData = data.features.filter(function (data) {
        return data.properties.NAME_0 === 'India';
      });
      d3.json(stateURL).then(
        (data, error) => {
          if (error) {
            console.log(log)
          } else {
            stateCenterData = data
          }
        }

      )
      d3.json(disasterURL).then(
        (data, error) => {
          if (error) {
            console.log(log)
          } else {
            educationData = data
            // drawMap()    used to call drav map
            
          }
        }

      )

    }
  }
)


let zoomDisasterdata

let zoomtooltip = d3.select('#zoomtooltip')

let zoomselect = document.getElementById('zoomdisaster');


let drawZoomMap = () => {
  
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 950 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    centered;
    
    var svg = d3.select("#canvas")
            .attr("width", width)
            .attr("height", height)
            .append('g')

    var projection = d3.geoMercator()
        .scale(1000)
        .center([80,22])
        .translate([width / 2 - margin.left, height / 2]);
        d3.select("g")
        .selectAll("path")
        .remove();
        var path = d3.geoPath()
            .projection(projection);
        var appending = svg.selectAll('g')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', path)
        .on("click", clicked)
        .attr('class', 'county')
        .attr('fill', (countyDataItem) => {

          
          let id = countyDataItem['properties']['ID_3']
          let county = zoomDisasterdata.find((item) => {
              return item['fips'] === id
          })
          let disasterid = zoomselect.options[zoomselect.selectedIndex].value;

          let percentage = county[disasterid]
          if(percentage <= 15){
              return 'tomato'
          }else if(percentage <= 30){
              return 'orange'
          }else if(percentage <= 45){
              return 'lightgreen'
          }else{
              return 'limegreen'
          }
      })
      .attr('data-fips', (countyDataItem) => {
        return countyDataItem['id']
    })
    .attr('data-education', (countyDataItem) => {
      let id = countyDataItem['properties']['ID_3']
      let county = zoomDisasterdata.find((item) => {
          return item['fips'] === id
      })
      let disasterid = zoomselect.options[zoomselect.selectedIndex].value;
      let percentage = county[disasterid]
      return percentage
  })
  .on('mouseover',(countyDataItem)=>{
    let disasterid = zoomselect.options[zoomselect.selectedIndex].value;

    zoomtooltip.transition()
                    .style('visibility', 'visible')
    let id = countyDataItem['properties']['ID_3']
      let county = zoomDisasterdata.find((item) => {
          return item['fips'] === id
      })
      zoomtooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
                    county['state'] + ' : ' + county[disasterid] + '% for Disaster ID - ' + disasterid )
      zoomtooltip.attr('data-education', county[disasterid] )
  })

  .on('mouseout', (countyDataItem) => {
    zoomtooltip.transition()
        .style('visibility', 'hidden')
})

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
      var centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 4;
      centered = d;
  } else {
      x = width / 2 - margin.left;
      y = height / 2;
      k = 1;
      centered = null;
  }

  svg.selectAll("path")
          .classed("active", centered && function(d) { return d === centered; });
let nwidth = width / 2 - margin.left 
  svg.transition()
          .duration(750)
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", 1.5 / k + "px");
}

}

let zoomdisasterURL = 'http://localhost/sih/geo%20json/disasters.json'

d3.json(talukaData).then(
    (data,error)=>{
       if(error){
        console.log(log)
        
       } else{

        countyData = data.features.filter(function (data) {
          return data.properties.NAME_0 === 'India';
      });

        d3.json(zoomdisasterURL).then(
            (data,error)=>{
              if(error){
                console.log(log)
              } else {
                zoomDisasterdata = data
            
              }
            }
    
        )
       }
    }
)