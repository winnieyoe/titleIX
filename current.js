//MAPBOX COMPONENTS
mapboxgl.accessToken = 'pk.eyJ1Ijoid2lueW9lIiwiYSI6ImNrOGV3cndubjAxMjMzZHFxMDR2Y2lkOTkifQ.zXvUx8Z4O7EinbqWiY315g';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-95.7, 37.1], // starting position [lng, lat]
  zoom: 4 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

map.on("load", function() {
  map.addSource("titleIX_data", {
    type: "geojson",
    data: "assets/titleIX.geojson"
  })

  map.addLayer({
    "id": "points",
    "source": "titleIX_data",
    "type": "circle",
    "paint": {
      "circle-radius": 12,
      "circle-opacity": 0.8,
    },
  });

  map.addLayer({
    "id": "count",
    "source": "titleIX_data",
    "type": "symbol",
    "layout": {
      "text-field": "{id}",
      "text-size": 10,
    },
    "paint": {
      "text-color": "#FFFFFF"
    }
  })

  //Popup on Hover, Show School Name
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

//Mouseevents on mapbox > The second item has to refer to the right layer
  map.on('mouseenter', 'points', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.name;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    popup
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  });

  map.on('mouseleave', 'points', function() {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
});
