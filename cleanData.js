let data;
let geojson = {
  type: "FeatureCollection",
  features: [],
}

function preload(){
  data = loadJSON("assets/coordinates.json")
}

function setup(){
  //Read the JSON file and format the coordinates into decimal degree for mapbox plotting
  for (let i=0; i<354; i++){
    // data[i].dd = formatDD(data[i].coordinate);
    var parts = data[i].coordinate.split(/[^\d\w\.]+/);
    var lat = parts[0];
    var lat_d = parts[1];
    var lng = parts[2];
    var lng_d = parts[3];

    if(lat_d == "S" || lat_d == "W"){
      lat = lat * -1;
    }
    if(lng_d == "S" || lng_d == "W"){
      lng = lng * -1;
    }

    lat = parseFloat(lat);
    lng = parseFloat(lng);

    // data[i].lat = lat;
    // data[i].lng = lng;
    data[i].coordinates = [lng, lat]

    //Create geoJSON format
    geojson.features.push({
      "type": "Feature",
      "properties":{
        "name": data[i].name,
        "id": "grid" + i.toString(),
        "lat": lat,
        "long": lng,
      },
      "geometry": {
        "type": "Point",
        "coordinates": data[i].coordinates
      }
    })
  }
  console.log(geojson)
  // GeoJSON.parse(data, {Point: ['lat', 'lng']}, function(geojson) {
  //   newdata = JSON.stringify(geojson);
  // });

  // console.log(newdata)
}

function mousePressed() {
  saveJSON(geojson, 'titleIX_L.geojson');
}

// function formatDD(input) {
//     var parts = input.split(/[^\d\w\.]+/);
//     var lat = parts[0];
//     var lat_d = parts[1];
//     var lng = parts[2];
//     var lng_d = parts[3];
//
//     if(lat_d == "S" || lat_d == "W"){
//       lat = lat * -1;
//     }
//
//     if(lng_d == "S" || lng_d == "W"){
//       lng = lng * -1;
//     }
//
//     return{
//       dd: lng + "," + lat
//     }
// }
