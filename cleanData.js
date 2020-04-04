let data;
let merged;
let geojson = {
  type: "FeatureCollection",
  features: [],
}

function preload(){
  data = loadJSON("assets/coordinates.json")
  schools = loadJSON("assets/allData.json")
}

function setup(){
  /// Schools and data are wrapped in {"mydata:[{}],[{}]"}, access the object array this way
  schools = schools.mydata;
  data = data.mydata;

  /// Merge data and school JSON files under same school name, their sequences are different
  merged = mergeObjects(schools, data);

  console.log("1", merged)
  /// Read the JSON file and format the coordinates into decimal degree for mapbox plotting
  for (let i=0; i<merged.length; i++){
    var parts = merged[i].coordinate.split(/[^\d\w\.]+/);
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

    merged[i].coordinates = [lng, lat]

    /// Create geojson object in correct format
    geojson.features.push({
      "type": "Feature",
      "properties":{
        "name": merged[i].name,
        "id": "grid" + i.toString(),
        "state": merged[i].state,
        "lat": lat,
        "long": lng,
        "tuition": merged[i].tuition,
        "incidents": merged[i].incidents
      },
      "geometry": {
        "type": "Point",
        "coordinates": merged[i].coordinates
      }
    })
  }
    console.log("2", geojson)
}

/// Function to merge schools and data object
function mergeObjects(){
  let idMap = {};
  for(var i = 0; i < arguments.length; i++) {
    /// Iterate over individual argument arrays (aka json1, json2)
    for(var j = 0; j < arguments[i].length; j++) {
       var currentID = arguments[i][j]['name'];
       if(!idMap[currentID]) {
          idMap[currentID] = {};
        }
       /// Iterate over properties of objects in arrays (aka id, name, etc.)
      for(key in arguments[i][j]) {
          idMap[currentID][key] = arguments[i][j][key];
      }
    }
  }

  let newArray = [];
  for(property in idMap) {
    newArray.push(idMap[property]);
  }
  return newArray;
}

/// Download json file
// function mousePressed() {
//   saveJSON(geojson, 'titleIX_L.geojson');
// }
