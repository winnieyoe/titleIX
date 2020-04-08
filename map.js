/// Initiate leaflet map
let int_lat = 35;
let int_lng = -95;
let zoom = 4;
let newList;

var mymap = L.map('map', {zoomControl: false}).setView([int_lat, int_lng], zoom);

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//   maxZoom: 18,
//   id: 'mapbox/streets-v11',
//   tileSize: 512,
//   zoomOffset: -1,
//   accessToken: 'pk.eyJ1Ijoid2lueW9lIiwiYSI6ImNrOGV3cndubjAxMjMzZHFxMDR2Y2lkOTkifQ.zXvUx8Z4O7EinbqWiY315g'
// }).addTo(mymap)
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png',
}).addTo(mymap);

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
var slideIndex = [];
var slideId = [];

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
  $("#grid").on("click", ".grid-title", function() {
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

  /// Sort geojson based on total number of incidents
  for (let i=0; i < geojson.length; i++){
    geojson = geojson.sort((a, b) => (b.properties.incidents.length > a.properties.incidents.length) ? 1 : -1);
  }
  // console.log(geojson)

  for (let i = 0; i < geojson.length; i++) {
    /// Creating containers for each school
    let school = document.createElement("div");
    grid.appendChild(school).className = "grid-item";
    grid.appendChild(school).id = geojson[i].properties.name;;

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
    let imgDiv = document.createElement("div");

    let sliderL = document.createElement("button");
    let iconL = document.createElement("i")
    let sliderR = document.createElement("button");
    let iconR = document.createElement("i");

    /// Generate arrays that are needed for the image slideshows
    slideId.push("grid-image" + i);
    slideIndex.push(1);

    for(let u=0; u < geojson[i].properties.urls.length; u++){
      let img = document.createElement("img");
      img.src = geojson[i].properties.urls[0];
      imgDiv.appendChild(img).className = "grid-image grid-image" + i
      school.appendChild(imgDiv);
    }

      // Create Slider Buttons with Custom Icon, append them the main box
      iconL.className = "fas fa-caret-left"
      iconR.className = "fas fa-caret-right"
      sliderL.appendChild(iconL);
      sliderR.appendChild(iconR);
      school.appendChild(sliderL).className = "sliderL";
      school.appendChild(sliderR).className = "sliderR";

      /// Add functions for image sliders to button, need to wrap in function(){}
      sliderL.onclick = function(){plusDivs(-1, i)};
      sliderR.onclick = function(){plusDivs(1, i)};
      showDivs(1, i)

    /// Creating div for school names
    let name = document.createElement("div");
    name.innerText = geojson[i].properties.name;
    name.className = "grid-title"
    name.id = i;
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
      icon: L.BeautifyIcon.icon(options)
    });

    /// Create popup of school name on hover, if want popups to be shown on click, add .bindPopup after let marker...
    marker.bindPopup(geojson[k].properties.name)
    marker.on("mouseover", function() {
      this.openPopup();
    });
    marker.on("mouseout", function() {
      this.closePopup();
    })
    marker.on("click", function(){
      console.log("clicked", name)
      goToByScroll(name);
    })

    /// Convert markers into cluster
    cluster.addLayer(marker);
  }
  mymap.addLayer(cluster)
};

function goToByScroll(id){
  console.log("here", id)
  let element = document.getElementById(id);

  element.scrollIntoView({
    // behavior: "smooth",
    // block: "start",
    // inline: "nearest"
  })
}

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

/// Image slider function click for next image
function plusDivs(n, no) {
  showDivs(slideIndex[no] += n, no);
}

function showDivs(n, no) {
  var i;
  var x = document.getElementsByClassName(slideId[no]);
  if (n > x.length) {slideIndex[no] = 1}
  if (n < 1) {slideIndex[no] = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex[no]-1].style.display = "block";
}
