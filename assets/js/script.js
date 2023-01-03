// Brewery API info https://www.openbrewerydb.org/documentation

let mapButtonEl = document.getElementById("map-btn")
let breweryButtonEl = document.getElementById("brewery-btn")
var dMeta = {};
var totalRecords;
var allData = [];
//all values
var brewery_type = [];
var city = [];
var country = [];
var postal_code = []
var state = [];
//Unique values
var ubrewery_type = [];
var ucity = [];
var ucountry = [];
var upostal_code = []
var ustate = [];

var brLat = -34.397;
var brLon = 150.644;


//breweryButtonEl.addEventListener("click", getApi)
breweryButtonEl.addEventListener("click", getFilteredBreweries);
mapButtonEl.addEventListener("click", initMap);

function displayData() {
  //alert(allData.length);
  ubrewery_type = Array.from(new Set(brewery_type));
  ucity = Array.from(new Set(city));
  ucountry = Array.from(new Set(country));
  upostal_code = Array.from(new Set(postal_code));
  ustate = Array.from(new Set(state));
}

//This function is activated when loading the body of the document, 
//to read in all available data and prepopulate the arrays with unique values

function getApi() {
  requestUrl = "https://api.openbrewerydb.org/breweries/meta"
  fetch(requestUrl)
    .then(function (response) {
      console.log(response);
      return response.json()
    })
    .then(function (dataM) {
      totalRecords = dataM.total;
      // console.log(data);
      getApiRecords();
    })
}

//Loop through the records and get all data into array
//https://api.openbrewerydb.org/breweries?page=15&per_page=50

var perPage = 50;
function getApiRecords() {
  var nPages = Math.ceil(totalRecords / perPage);
  for (i = 1; i < nPages + 1; i++) {
    var requestUrl = "https://api.openbrewerydb.org/breweries?page=" + i + "&per_page=" + perPage;
    fetch(requestUrl)
      .then(function (response) {
        //console.log(response);
        return response.json()
      })
      .then(function (data) {
        for (j = 0; j < data.length; j++) {

          allData.push(data[j]);


          brewery_type.push(data[j].brewery_type);
          city.push(data[j].city);
          country.push(data[j].country);
          postal_code.push(data[j].postal_code);
          state.push(data[j].state);
        }
        console.log(data);
      });

  }

}


//===============MAP=============================
let map;
// This example displays a marker at the center of Australia.
// When the user clicks the marker, an info window opens.
function initMap() {
  const br = { lat: +brLat, lng: +brLon };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: br,
  });

  const infowindow = new google.maps.InfoWindow({
    content: contentString,
    ariaLabel: "Uluru",
  });
  const marker = new google.maps.Marker({
    position: br,
    map,
    title: breweryId,
  });

  marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
    });
  });
}




window.initMap = initMap;


//Get and manage selected option from the radioButtons
document.querySelectorAll("input[name='mapOption']").forEach((input) => {
  input.addEventListener('change', myfunction);
});
var selectedList = [];
let inputEl = document.getElementById("iInput");
inputEl.value = "";
inputEl.placeholder = "All data";
var selectedRadioId;
function myfunction(event) {

  displayData();
  selectedRadioId = event.currentTarget.id;
  console.log('Checked radio with ID = ' + selectedRadioId);
  if (selectedRadioId === "rAllData") {
    inputEl.value = "";
    selectedList = allData;
    inputEl.placeholder = "All data";
  }

  else if (selectedRadioId === "rCountry") {
    selectedList = Array.from(new Set(country)).sort();
    inputEl.value = "";
    inputEl.placeholder = "Country";
  }
  else if (selectedRadioId === "rState") {
    selectedList = Array.from(new Set(state)).sort();
    inputEl.value = "";
    inputEl.placeholder = "State";
  }
  else if (selectedRadioId === "rCity") {
    selectedList = Array.from(new Set(city)).sort();
    inputEl.value = "";
    inputEl.placeholder = "City";
  }
  else if (selectedRadioId === "rPostCode") {
    selectedList = Array.from(new Set(postal_code)).sort();
    inputEl.value = "";
    inputEl.placeholder = "Post code";
  }
  else {
    alert("This option is not available yet ! ");
  }
  // inputEl = document.getElementById(selectedInputId);
  //populateList(selectedInputId);
  //alert('Checked radio with ID = ' + selectedRadioId)
}




//Populate input boxe based on selected option
//=========================================================
//code adaped and modified form https://codingartistweb.com/2021/12/autocomplete-suggestions-on-input-field-with-javascript/

//Execute function on keyup
inputEl.addEventListener("keyup", (e) => {
  //Initially remove all elements ( so if user erases a letter or adds new letter then clean previous outputs)
  removeElements();
  for (let i of selectedList) {
    //convert input to lowercase and compare with each string
    if (i.toLowerCase().startsWith(inputEl.value.toLowerCase()) && inputEl.value != "") {
      //create li element=============
      let listItem = document.createElement("li");
      //One common class name
      listItem.classList.add("list-items");
      listItem.style.cursor = "pointer";
      listItem.setAttribute("onclick", "displayNames('" + i + "')");
      //Display matched part in bold
      let word = "<b>" + i.substr(0, inputEl.value.length) + "</b>";
      word += i.substr(inputEl.value.length);
      //display the value in array
      listItem.innerHTML = word;
      document.querySelector(".list").appendChild(listItem);
    }
  }
});
//}

function displayNames(value) {
  inputEl.value = value;
  removeElements();
}
function removeElements() {
  //clear all the item
  let items = document.querySelectorAll(".list-items");
  items.forEach((item) => {
    item.remove();
  });
}



//Populate selected filtered breweries options list [middle field]
function getFilteredBreweries() {

  listEl = document.getElementById("listControl");
  //Clear Existing Elements
  removeOptions(listEl);

  const result = allData.filter((brewery) => {
    //return person.age < 21 ? true : false
    var filterValue = inputEl.value;
    var h2Mid;
  
    if (selectedRadioId === "rAllData") {
     //h2Middle = "All Breweries";
      return allData;
    }
    else if (selectedRadioId === "rCountry") {
      //h2Middle = "All Breweries in  country ";
      return brewery.country === filterValue;
    }
    else if (selectedRadioId === "rState") {
      //h2Middle = "All Breweries in  state ";
      return brewery.state === filterValue;
    }
    else if (selectedRadioId === "rCity") {
      //h2Middle = "All Breweries in  city ";
      return brewery.city === filterValue;
    }
    else if (selectedRadioId === "rPostCode") {
      //h2Middle = "All Breweries in  postcode ";
      return brewery.postal_code === filterValue;
    }

  })
  var  selectionBox = document.getElementById ("iInput");
 
  //h2Middle = h2Middle + selectionBox.value;

  var  h2M = document.getElementById ("h2Middle");
  h2M.innerHTML = "All Breweries in " + selectionBox.value;

  //populate selections 
 


  for (rec of result) {
    var option = document.createElement("option");
    option.text = rec.id;
    listEl.add(option);
  }
}


function removeOptions(selectElement) {
  var i, L = selectElement.options.length - 1;
  for (i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}


var contentString;
var breweryId;
function getSelectedID(selObj) {
  //alert(selObj.value);
  const selectedBrewery = allData.filter((brewery) => {
    return brewery.id === selObj.value;
  });
  //get brewery attributes
  brLat = selectedBrewery[0].latitude;
  brLon = selectedBrewery[0].longitude;


  breweryId = selectedBrewery[0].id;

  contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h1 id="firstHeading" class="firstHeading"><b>' + selectedBrewery[0].id + '</b></h1>' +
    '<div id="bodyContent">' +
    "<p>" + "Brewery type: " + selectedBrewery[0].brewery_type + "<p>" +
    "<p>" + "Country: " + selectedBrewery[0].country + "<p>" +
    "<p>" + "State: " + selectedBrewery[0].state + "<p>" +
    "<p>" + "City: " + selectedBrewery[0].city + "<p>" +
    "<p>" + "Street: " + selectedBrewery[0].street + "<p>" +
    "<p>" + "Name: " + selectedBrewery[0].name + "<p>" +
    "<p>" + "Phone: " + selectedBrewery[0].phone + "<p>" +
    //'<p><a href=' + '"'+ selectedBrewery[0].website_url+'</a></p> "' +

    "</div>" +
    "</div>";
//plot selected brewery on map
  initMap();
}





