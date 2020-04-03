///////MAP COMPONENTS//////
let int_lat = 30;
let int_lng = -95;
let zoom= 4;
var mymap = L.map('leaflet', {zoomControl: false})

mymap.setView([int_lat, int_lng], zoom);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoid2lueW9lIiwiYSI6ImNrOGV3cndubjAxMjMzZHFxMDR2Y2lkOTkifQ.zXvUx8Z4O7EinbqWiY315g'
}).addTo(mymap);

var zoomBar = L.easyBar([
  L.easyButton( '<big>+</big>',  function(control, mymap){mymap.setZoom(mymap.getZoom()+1);}),
  L.easyButton( '<big>-</big>',  function(control, mymap){mymap.setZoom(mymap.getZoom()-1);}),
  L.easyButton( 'fa-home fa-sm', function(control, mymap){mymap.setView([int_lat, int_lng], zoom);}),
]);
// add it to the map
zoomBar.addTo(mymap);

$.getJSON("assets/titleIX_L.geojson", function(data){
  L.geoJson(data, {
    pointToLayer: function (feature, latlng){
      return L.circleMarker(latlng, {
        fillColor: "#000",
        fillOpacity: 0.9,
        radius: 12,
        color:"#FFF",
        weight:2,
      })
    },
    onEachFeature: function (feature, layer){
      layer.on("mouseover", function(){
        this.bindPopup(feature.properties.name).openPopup();
      });
      layer.on("mouseout", function(){
        this.closePopup();
      })
    }
  }).addTo(mymap);
});

(function() {
	var control = new L.Control({position:'topright'});
	control.onAdd = function(map) {
			var azoom = L.DomUtil.create('a','resetzoom');
			azoom.innerHTML = "[Reset Zoom]";
			L.DomEvent
				.disableClickPropagation(azoom)
				.addListener(azoom, 'click', function() {
					mymap.setView([int_lat, int_lng], zoom);
				},azoom);
			return azoom;
		};
	return control;
}())
.addTo(mymap);

// $( "#zoom-button" ).click(function() {
//   mymap.setView([int_lat, int_lng], zoom);
// });

///////TABLE COMPONENTS//////
let data;
let grid = document.getElementById("grid");
let popup = document.getElementById("popup");

function preload(){
  data = loadJSON("assets/allData.json")
}

function setup(){
  data = data.mydata;
  // console.log(list.mydata.sort((a, b) => (b.totalNum > a.totalNum) ? 1 : -1))
  // .length only works on array
  // size of objexy, Object.keys(myobj) returns array
  // Map
  let rows = data.length/2;
  makeRows(rows, 2);
}

function draw(){

}

$(document).ready(function(){
  $("#grid").on("click", ".grid-item", function(){
    thisID = $(this).attr("id");
    displayCases(thisID);
    clickZoom(thisID);
    $(this).addClass("overlay");
  })
})

function makeRows(rows, cols) {
  grid.style.setProperty('--grid-rows', rows);
  grid.style.setProperty('--grid-cols', cols);
  let ranking = 1;

  for (let i = 0; i < data.length; i++) {
    //Creating containers for each school
    let school = document.createElement("div");
    // school.setAttribute("onclick", "msg")
    grid.appendChild(school).className = "grid-item";
    grid.appendChild(school).id = i;

    //Creating the ranking number
    let count = document.createElement("span");
    if (i+1 < data.length){
      if (data[i+1].incidents.length == data[i].incidents.length){
        count.innerText = ranking;
      } else {
        count.innerText = ranking++;
      }
    }
    if (i == data.length-1){
      if(data[i].incidents.length == data[i-1].incidents.length){
        count.innerText = ranking;
      } else {
        count.innerText = ranking++;
      }
    }
      school.appendChild(count);

    //Creating div for images
    let image = document.createElement("div");
    image.className = "grid-image"
    school.appendChild(image);

    //Creating div for school names
    let name = document.createElement("div");
    name.innerText = data[i].name;
    name.className = "grid-title"
    school.appendChild(name);
  };
};

function displayCases(thisID){
  let caseList = "";

  for(let j=0; j<data[thisID].incidents.length; j++){
    caseList += "<div class='one-case'>" + data[thisID].incidents[j].date + " " + data[thisID].incidents[j].complaint + "</div>";
    console.log(data[thisID].incidents[j].date)
    // caseList += "<tr><td>" + data[i].incidents[j].date + "</td><td>" + data[i].incidents[j].complaint + "</td></tr>";
  }
  popup.innerHTML = caseList;
}


function clickZoom(thisID){
  let newLat;
  let newLng;
  $.getJSON("assets/titleIX_L.geojson", function(geojson){
    newLat = geojson.features[thisID].properties.lat;
    newLng = geojson.features[thisID].properties.long
    newZoom = 16;
    // console.log(thisID, newLat, newLng)
    mymap.setView([newLat, newLng], newZoom)
  })

}
