/// Initiate leaflet map
let int_lat = 30;
let int_lng = -95;
let zoom = 4;

var mymap = L.map('map', {zoomControl: false}).setView([int_lat, int_lng], zoom);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1Ijoid2lueW9lIiwiYSI6ImNrOGV3cndubjAxMjMzZHFxMDR2Y2lkOTkifQ.zXvUx8Z4O7EinbqWiY315g'
}).addTo(mymap)

/// Add custom zoom bar with reset button with easy-button.js
var zoomBar = L.easyBar([
  L.easyButton('<big>+</big>', function(control, mymap) {
    mymap.setZoom(mymap.getZoom() + 1);
  }),
  L.easyButton('<big>-</big>', function(control, mymap) {
    mymap.setZoom(mymap.getZoom() - 1);
  }),
  L.easyButton('fa-home fa-sm', function(control, mymap) {
    mymap.setView([int_lat, int_lng], zoom);
  }),
]);
zoomBar.addTo(mymap);

/// data component
let grid = document.getElementById("grid");
let caseListPopup = document.getElementById("popup");

function preload() {
  geojson = loadJSON("assets/titleIX_L.geojson")
}

function setup() {
  geojson = geojson.features;

  /// Create grid of schools
  let rows = geojson.length / 2;
  makeRows(rows, 2);
}

$(document).ready(function() {
  $("#grid").on("click", ".grid-item", function() {
    /// Get the id of the clicked school
    thisID = $(this).attr("id");
    /// Pass selected school's id, show case list, zoom to school location
    displayCases(thisID);
    clickZoom(thisID);
    $(this).addClass("overlay");
  })
})

function makeRows(rows, cols) {
  grid.style.setProperty('--grid-rows', rows);
  grid.style.setProperty('--grid-cols', cols);

  /// Calculate ranking
  let ranking = 1;

  for (let i = 0; i < geojson.length; i++) {
    /// Creating containers for each school
    let school = document.createElement("div");
    grid.appendChild(school).className = "grid-item";
    grid.appendChild(school).id = i;

    /// Creating the ranking number
    let count = document.createElement("span");
    if (i + 1 < geojson.length) {
      if (geojson[i + 1].properties.incidents.length == geojson[i].properties.incidents.length) {
        count.innerText = ranking;
      } else {
        count.innerText = ranking++;
      }
    }
    if (i == geojson.length - 1) {
      if (geojson[i].properties.incidents.length == geojson[i - 1].properties.incidents.length) {
        count.innerText = ranking;
      } else {
        count.innerText = ranking++;
      }
    }
    school.appendChild(count).id = "count" + i;

    /// Creating div for images
    let image = document.createElement("div");
    image.className = "grid-image"
    school.appendChild(image);

    /// Creating div for school names
    let name = document.createElement("div");
    name.innerText = geojson[i].properties.name;
    name.className = "grid-title"
    school.appendChild(name);
  };

  /// Add custom cluster markers to map, this was originally placed on the very top of codes
  let cluster = L.markerClusterGroup({
    chunkedLoading: true,
    spiderfyOnMaxZoom: false
  });

  /// Add individual markers
  for (let k = 0; k < geojson.length; ++k) {
    let lat = geojson[k].properties.lat;
    let lng = geojson[k].properties.long;
    /// markerLocation format coordinates for leaflet markers
    let markerLocation = new L.LatLng(lat, lng);

    let name = geojson[k].properties.name;
    let spanID = "count" + k;

    /// Styling options from MarkerCluster.js
    var options = {
      isAlphaNumericIcon: true,
      text: document.getElementById(spanID).innerHTML,
      borderColor: '#000',
      textColor: '#000',
      iconSize: [30, 30],
    };

    let marker = L.marker(markerLocation, {
      icon: L.BeautifyIcon.icon(options),
      myCustomID: "marker" + k,
    });

    /// Create popup of school name on hover, if want popups to be shown on click, add .bindPopup after let marker...
    marker.bindPopup(geojson[k].properties.name)
    marker.on("mouseover", function() {
      this.openPopup();
    });
    marker.on("mouseout", function() {
      this.closePopup();
    })

    /// Convert markers into cluster
    cluster.addLayer(marker);
  }
  mymap.addLayer(cluster)
};

/// Display all cases of one school
function displayCases(thisID) {
  let caseList = "";
  for (let j = 0; j < geojson[thisID].properties.incidents.length; j++) {
    caseList += "<div class='one-case'>" + geojson[thisID].properties.incidents[j].date + " " + geojson[thisID].properties.incidents[j].complaint + "</div>";
  }
  caseListPopup.innerHTML = caseList;
}

/// Click on school grid, zoom to selected school
function clickZoom(thisID) {
  let newLat;
  let newLng;

  newLat = geojson[thisID].properties.lat;
  newLng = geojson[thisID].properties.long;
  newZoom = 16;
  mymap.setView([newLat, newLng], newZoom);
}
