///////MAP COMPONENTS//////
let int_lat = 30;
let int_lng = -95;
let zoom= 4;

var mymap = L.map('leaflet', {zoomControl: false}).setView([int_lat, int_lng], zoom);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoid2lueW9lIiwiYSI6ImNrOGV3cndubjAxMjMzZHFxMDR2Y2lkOTkifQ.zXvUx8Z4O7EinbqWiY315g'
}).addTo(mymap)

let cluster = L.markerClusterGroup({
  chunkedLoading: true,
  spiderfyOnMaxZoom: false
});


// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: 'pk.eyJ1Ijoid2lueW9lIiwiYSI6ImNrOGV3cndubjAxMjMzZHFxMDR2Y2lkOTkifQ.zXvUx8Z4O7EinbqWiY315g'
// }).addTo(mymap);

///Add custom zoom bar
var zoomBar = L.easyBar([
  L.easyButton( '<big>+</big>',  function(control, mymap){mymap.setZoom(mymap.getZoom()+1);}),
  L.easyButton( '<big>-</big>',  function(control, mymap){mymap.setZoom(mymap.getZoom()-1);}),
  L.easyButton( 'fa-home fa-sm', function(control, mymap){mymap.setView([int_lat, int_lng], zoom);}),
]);
zoomBar.addTo(mymap);

// $.getJSON("assets/titleIX_L.geojson", function(data){
//   L.geoJson(data, {
//     pointToLayer: function (feature, latlng){
//       return new L.circleMarker([latlng.lat, latlng.lng], {
//         fillColor: "#000",
//         fillOpacity: 1,
//         radius: 12,
//         color:"#FFF",
//         weight:2,
//       })
//     },
//     onEachFeature: function (feature, layer){
//       var text = L.tooltip({
//         permanent: true,
//         direction: "center",
//         className: "text",
//       }).setContent("1")
//         .setLatLng(layer.getLatLng());
//         text.addTo(mymap);
//       layer.on("mouseover", function(){
//         this.bindPopup(feature.properties.name).openPopup();
//       });
//       layer.on("mouseout", function(){
//         this.closePopup();
//       })
//     }
//   }).addTo(mymap);
// });


// ///Add custom markers
// $.getJSON("assets/titleIX_L.geojson", function(geojson){
//   $.each(geojson.features, function(k, v){
//     let spanID = "count" + k;
//     console.log(spanID, document.getElementById("count0"))
//     var options = {
//             isAlphaNumericIcon: true,
//             text: k,
//             borderColor: '#000',
//             textColor: '#000',
//             iconSize: [30, 30],
//     };
//
//     let lat = geojson.features[k].properties.lat;
//     let lng = geojson.features[k].properties.long;
//     let markerLocation = new L.LatLng(lat, lng)
//
//     marker = new L.marker(markerLocation, {
//       icon: L.BeautifyIcon.icon(options)
//     }).addTo(mymap)
//
//     marker.bindPopup(geojson.features[k].properties.name)
//     marker.on("mouseover", function(){
//       this.openPopup();
//     });
//     marker.on("mouseout", function(){
//       this.closePopup();
//     })
//   })
// })

// (function() {
// 	var control = new L.Control({position:'topright'});
// 	control.onAdd = function(map) {
// 			var azoom = L.DomUtil.create('a','resetzoom');
// 			azoom.innerHTML = "[Reset Zoom]";
// 			L.DomEvent
// 				.disableClickPropagation(azoom)
// 				.addListener(azoom, 'click', function() {
// 					mymap.setView([int_lat, int_lng], zoom);
// 				},azoom);
// 			return azoom;
// 		};
// 	return control;
// }())
// .addTo(mymap);

// $( "#zoom-button" ).click(function() {
//   mymap.setView([int_lat, int_lng], zoom);
// });

///////TABLE COMPONENTS//////
// let data;
let grid = document.getElementById("grid");
let popup = document.getElementById("popup");

function preload(){
  // data = loadJSON("assets/allData.json")
  geojson = loadJSON("assets/titleIX_L.geojson")
}

function setup(){
  // data = data.mydata;
  geojson = geojson.features;
  // console.log(list.mydata.sort((a, b) => (b.totalNum > a.totalNum) ? 1 : -1))
  // .length only works on array
  // size of objexy, Object.keys(myobj) returns array
  // Map
  let rows = geojson.length/2;
  makeRows(rows, 2);
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

  for (let i = 0; i < geojson.length; i++) {
    //Creating containers for each school
    let school = document.createElement("div");
    // school.setAttribute("onclick", "msg")
    grid.appendChild(school).className = "grid-item";
    grid.appendChild(school).id = i;

    //Creating the ranking number
    let count = document.createElement("span");
    if (i+1 < geojson.length){
      if (geojson[i+1].properties.incidents.length == geojson[i].properties.incidents.length){
        count.innerText = ranking;
      } else {
        count.innerText = ranking++;
      }
    }
    if (i == geojson.length-1){
      if(geojson[i].properties.incidents.length == geojson[i-1].properties.incidents.length){
        count.innerText = ranking;
      } else {
        count.innerText = ranking++;
      }
    }
      school.appendChild(count).id = "count" + i;

    //Creating div for images
    let image = document.createElement("div");
    image.className = "grid-image"
    school.appendChild(image);

    //Creating div for school names
    let name = document.createElement("div");
    name.innerText = geojson[i].properties.name;
    name.className = "grid-title"
    school.appendChild(name);
  };


  /////Add custom markers
  for (let k=0; k< geojson.length; ++k){
    let lat = geojson[k].properties.lat;
    let lng = geojson[k].properties.long;
    let markerLocation = new L.LatLng(lat, lng);
    let name = geojson[k].properties.name;

    let spanID = "count" + k;
    var options = {
      isAlphaNumericIcon: true,
      text: document.getElementById(spanID).innerHTML,
      borderColor: '#000',
      textColor: '#000',
      iconSize: [30, 30],
    };

    let marker = L.marker(markerLocation, {
       icon: L.BeautifyIcon.icon(options)
    });
    marker.bindPopup(geojson[k].properties.name)
        marker.on("mouseover", function(){
          this.openPopup();
        });
        marker.on("mouseout", function(){
          this.closePopup();
        })

  cluster.addLayer(marker);
  }
  mymap.addLayer(cluster)
  // $.getJSON("assets/titleIX_L.geojson", function(geojson){
  //   $.each(geojson.features, function(k, v){
  //     //Create individual markers
  //     let spanID = "count" + k;
  //     var options = {
  //       isAlphaNumericIcon: true,
  //       text: document.getElementById(spanID).innerHTML,
  //       borderColor: '#000',
  //       textColor: '#000',
  //       iconSize: [30, 30],
  //     };
  //
  //     let lat = geojson.features[k].properties.lat;
  //     let lng = geojson.features[k].properties.long;
  //     let markerLocation = new L.LatLng(lat, lng)
  //
  //     marker = new L.marker(markerLocation, {
  //       icon: L.BeautifyIcon.icon(options)
  //     }).addTo(mymap)
  //
  //     marker.bindPopup(geojson.features[k].properties.name)
  //     marker.on("mouseover", function(){
  //       this.openPopup();
  //     });
  //     marker.on("mouseout", function(){
  //       this.closePopup();
  //     })
  //   })
  // })
};

function displayCases(thisID){
  let caseList = "";

  for(let j=0; j<geojson[thisID].properties.incidents.length; j++){
    caseList += "<div class='one-case'>" + geojson[thisID].properties.incidents[j].date + " " + geojson[thisID].properties.incidents[j].complaint + "</div>";
    // caseList += "<tr><td>" + data[i].incidents[j].date + "</td><td>" + data[i].incidents[j].complaint + "</td></tr>";
  }
  popup.innerHTML = caseList;
}


function clickZoom(thisID){
  let newLat;
  let newLng;

  newLat = geojson[thisID].properties.lat;
  newLng = geojson[thisID].properties.long
  newZoom = 16;
  mymap.setView([newLat, newLng], newZoom)

  // $.getJSON("assets/titleIX_L.geojson", function(geojson){
  //   newLat = geojson.features[thisID].properties.lat;
  //   newLng = geojson.features[thisID].properties.long
  //   newZoom = 16;
  //   console.log(thisID, newLat, newLng)
  //   // console.log(thisID, newLat, newLng)
  //   mymap.setView([newLat, newLng], newZoom)
  // })
}
