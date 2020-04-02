let data;
let grid = document.getElementById("grid");

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
    console.log("hi")
    console.log(this.id)
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
    grid.appendChild(school).id = "grid" + i;

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
