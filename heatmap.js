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
	minZoom: 3,
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
  geojson = loadJSON("assets/titleIX_noOnePerson.geojson")
}

function setup() {
  geojson = geojson.features;
	heatmap();
}

function heatmap(){
	for (let k = 0; k < geojson.length; ++k) {
		let lat = geojson[k].properties.lat;
		let lng = geojson[k].properties.long;

		// console.log(lat, lng)
		/// markerLocation format coordinates for leaflet markers
		// let markerLocation = new L.LatLng(lat, lng);
		var heat = L.heatLayer([[lat, lng]], {gradient: {0: 'lime', 1: 'lime'}}, {radius: 10}).addTo(mymap)
	}
}




  /// Add custom cluster markers to map, this was originally placed on the very top of codes
//   let cluster = L.markerClusterGroup({
//     chunkedLoading: true,
//     spiderfyOnMaxZoom: false,
// 		iconCreateFunction: function(cluster) {
// 			return L.divIcon({ html: '<div class="clusterNum">' + cluster.getChildCount() + "<br >" + '<div style="font-size: 0.675rem">' + "cases" + "</div>" + '</div>' });
// 		}
//   });
//
//   /// Add individual markers
//   for (let k = 0; k < geojson.length; ++k) {
//     let lat = geojson[k].properties.lat;
//     let lng = geojson[k].properties.long;
//     /// markerLocation format coordinates for leaflet markers
//     let markerLocation = new L.LatLng(lat, lng);
//
//     let name = geojson[k].properties.name;
//     let spanID = "count" + k;
//
//     /// Styling options from L.BeautifyIcon, Styles individual markers
// 		/// Options have to be placed first or else the style won't be applied to item 0
// 		var options = {
//       isAlphaNumericIcon: true,
//       text: document.getElementById(spanID).innerHTML,
//       borderColor: '#71131B',
// 			backgroundColor:"#71131B",
//       textColor: '#fff',
//       iconSize: [26,26]
//     };
//
// 		let marker = L.marker(markerLocation, {
//       icon: L.BeautifyIcon.icon(options)
//     });
//
//     /// Create popup of school name on hover, if want popups to be shown on click, add .bindPopup after let marker...
//     marker.bindPopup(geojson[k].properties.name)
//     marker.on("mouseover", function() {
//       this.openPopup();
//     });
//     marker.on("mouseout", function() {
//       this.closePopup();
//     })
//     marker.on("click", function(){
//       // console.log("clicked", name)
//       goToByScroll(name);
// 			displayClickedMarkerCases(name);
// 	    // displayCases(name);
//     })
//
//     /// Convert markers into cluster
//     cluster.addLayer(marker);
//   }
//   mymap.addLayer(cluster)
// };
//
