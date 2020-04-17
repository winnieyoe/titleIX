/// Initiate leaflet map
let int_lat = 35;
let int_lng = -97;
let zoom = 3.5;
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
let grid_container = document.getElementById("schools");
let case_details = document.getElementById("case-details");
let case_container = document.getElementById("popup");

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
  $("#grid").on("click", ".grid-item", function() {
    /// Get the id of the clicked school
		thisID = $(this).attr("id");
		displayClickedMarkerCases(thisID);
    // thisID = $(this).attr("id");
		//
    // case_container.style.display = "block";
    // grid_container.style.display = "none";
    // displayCases(thisID);

    /// Pass selected school's id, show case list, zoom to school location
		// console.log(thisID)
    // clickZoom(thisID);
  })

  $("#close").on("click", function(){
    case_container.style.display = "none";
    grid_container.style.display = "block";
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

    /// Creating div for images
    let imgDiv = document.createElement("div");
    let containerS = document.createElement("div");
    let sliders = document.createElement("div");
    let sliderL = document.createElement("button");
    let iconL = document.createElement("i")
    let sliderR = document.createElement("button");
    let iconR = document.createElement("i");

    /// Generate arrays that are needed for the image slideshows
    slideId.push("grid-image" + i);
    slideIndex.push(1);

    for(let u=0; u < geojson[i].properties.urls.length; u++){
      let img = document.createElement("div");
      img.style = "background-image:url(" + geojson[i].properties.urls[u] + ")";

      // let img = document.createElement("img");
      // img.src = geojson[i].properties.urls[0];
      imgDiv.appendChild(img).className = "grid-image grid-image" + i
      school.appendChild(imgDiv).className = "images";
    }

      /// Create Slider Buttons with Custom Icon, append them the main box
      iconL.className = "fas fa-angle-left"
      iconR.className = "fas fa-angle-right"
      sliderL.appendChild(iconL);
      sliderR.appendChild(iconR);
      sliders.appendChild(sliderL).className = "slider-button sliderL";
      sliders.appendChild(sliderR).className = "slider-button sliderR";
      containerS.appendChild(sliders).className = "sliders";
      school.appendChild(containerS).className = "slider-container"
      // school.appendChild(sliderL).className = "sliderL";
      // school.appendChild(sliderR).className = "sliderR";

      /// Add functions for image sliders to button, need to wrap in function(){}
      sliderL.onclick = function(){plusDivs(-1, i)};
      sliderR.onclick = function(){plusDivs(1, i)};
      showDivs(1, i)
			$(".slider-button").hover(
				function() {
					$("#grid").prop("onclick", null).off("click")
				},
				function(){
					$("#grid").on("click", ".grid-item", function() {
						/// Get the id of the clicked school
						thisID = $(this).attr("id");
						displayClickedMarkerCases(thisID);
					})
				}
			)

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
			count.className = "count"

    /// Creating div for school names
		let label = document.createElement("div");
		label.className = "grid-label"
    let name = document.createElement("div");
    name.innerText = geojson[i].properties.name;
    name.className = "grid-title";
    name.id = i;
		let cases = document.createElement("div");
		cases.className = "grid-cases";
		cases.innerText = "Cases: " + geojson[i].properties.incidents.length;

		label.appendChild(name);
		label.appendChild(cases);
    school.appendChild(label);
  };

  /// Add custom cluster markers to map, this was originally placed on the very top of codes
  let cluster = L.markerClusterGroup({
    chunkedLoading: true,
    spiderfyOnMaxZoom: false,
  });

  /// Add individual markers
  for (let k = 0; k < geojson.length; ++k) {
    let lat = geojson[k].properties.lat;
    let lng = geojson[k].properties.long;
    /// markerLocation format coordinates for leaflet markers
    let markerLocation = new L.LatLng(lat, lng);

    let name = geojson[k].properties.name;
    let spanID = "count" + k;

    /// Styling options from L.BeautifyIcon, Styles individual markers
    var options = {
      isAlphaNumericIcon: true,
      text: document.getElementById(spanID).innerHTML,
      borderColor: '#71131B',
			backgroundColor:"#71131B",
      textColor: '#fff',
      iconSize: [26,26]
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
      // console.log("clicked", name)
      goToByScroll(name);
			displayClickedMarkerCases(name);
			// case_container.style.display = "block";
	    // grid_container.style.display = "none";
	    // displayCases(name);
    })

    /// Convert markers into cluster
    cluster.addLayer(marker);
  }
  mymap.addLayer(cluster)
};

// $(".grid-item").hover(function(){
// 	console.log("HOVER")
// })

function goToByScroll(id){
  let element = document.getElementById(id);

  element.scrollIntoView({
    // behavior: "smooth",
    // block: "start",
    // inline: "nearest"
  })
}

function displayClickedMarkerCases(id){
	let element = document.getElementById(id);
	let thisID = element.querySelector(".grid-title").id;

	case_container.style.display = "block";
	grid_container.style.display = "none";
	displayCases(thisID);
	clickZoom(thisID);
}

/// Display all cases of one school
function displayCases(thisID) {
	// console.log(thisID)
  let caseList = "";
  for (let j = 0; j < geojson[thisID].properties.incidents.length; j++) {
    caseList += "<div class='one-case'>" + "<div class='case-date'>" + geojson[thisID].properties.incidents[j].date + "</div>" + "<div class='case-type'>" + geojson[thisID].properties.incidents[j].complaint + "</div>" + "</div>" + "<hr>";
  }

	let nameDiv = "<div>" + geojson[thisID].properties.name + ", " + geojson[thisID].properties.state + "</div>";
	let tuitionDiv = "<div>" + "Tuition: " + geojson[thisID].properties.tuition + "</div>";
	let infoDiv = "<div class='info'>" + nameDiv + tuitionDiv + "</div>" + "<hr>";
  cases_num.innerHTML = geojson[thisID].properties.incidents.length;
  case_details.innerHTML = infoDiv + caseList;
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
