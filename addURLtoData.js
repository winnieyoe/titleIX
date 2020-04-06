let table;
let schools = [];
let allData;
let mergedlinks;

function preload(){
  table = loadTable("assets/urls.csv", "csv", "header");
  allData = loadJSON("assets/allData.json");
}

function setup(){
  allData = allData.mydata;

  for (let i=0; i<table.getRowCount(); i++){
    let name = table.getRow(i).get("name");
    let url = table.getRow(i).get("url");

    let isSchoolExisted = false;

    let school = {
      name: name,
      urls: [url],
    }

    for (let i = 0; i < schools.length; i++) {
        if (schools[i].name === name) {
          schools[i].urls.push(url);
          isSchoolExisted = true;
          break
        }
      }
      if (!isSchoolExisted) { //if it hasn't existed
        schools.push(school);
      }
  }
    console.log(schools, allData)
    mergedlinks = mergeObjects(schools, allData)
    console.log(mergedlinks)
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

/// Download file
function mousePressed() {
  saveJSON(mergedlinks, 'allData_URLs.json');
}
