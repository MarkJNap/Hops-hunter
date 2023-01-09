// Brewery API info https://www.openbrewerydb.org/documentation

let btnAddToFavourites = document.getElementById("fav-btn");
let btnListBreweries = document.getElementById("brewery-btn");
let btnClearFavourites = document.getElementById("clear-btn")

//dMeta contains meta-data. Is used to fetch data such as total number of recors ( totalRecords) in the API
var dMeta = {};
var totalRecords;

//initialisation of arrays to contain all arecords in each rorespong field
var allData = [];
var breweryIds = [];
var brewery_type = [];
var city = [];
var country = [];
var postal_code = [];
var state = [];

//Unique values arrays. u- prefix stands for "unique"
var ubrewery_type = [];
var ucity = [];
var ucountry = [];
var upostal_code = [];
var ustate = [];

//initialise default coordinates
var brLat = -34.397;
var brLon = 150.644;


btnListBreweries.addEventListener("click", getFilteredBreweries);
btnAddToFavourites.addEventListener("click", addFavouriteBreweryToLocalStorage);
btnClearFavourites.addEventListener("click", clearLocalStorage);

//Gets distinct value arrays to be used primarilly in the autocomplete function
function getDistinctValueArrays() {
  ubrewery_type = Array.from(new Set(brewery_type));
  ucity = Array.from(new Set(city));
  ucountry = Array.from(new Set(country));
  upostal_code = Array.from(new Set(postal_code));
  ustate = Array.from(new Set(state));
}

//This function is activated when loading the body of the document, 
//It reads in all the available data and prepopulates the arrays with unique/discting values

function getApi() {
  requestUrl = "https://api.openbrewerydb.org/breweries/meta"

  fetch(requestUrl)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (dataM) {
      totalRecords = dataM.total;
      // console.log(data);
      getApiRecords();
      initMap();
    })
}

//Loop through all pages in the API and get all records into arrays
//maximum number of records constraint,fetched at once is 50: https://api.openbrewerydb.org/breweries?page=15&per_page=50
//dataAll array contains all records
//other arrays contain corresponding field. array names are self-explanatory

var perPage = 50;
var counter = 0;
function getApiRecords() {
  var nPages = Math.ceil(totalRecords / perPage);
  for (var i = 1; i < nPages + 1; i++) {
    var requestUrl = "https://api.openbrewerydb.org/breweries?page=" + i + "&per_page=" + perPage;
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        for (var j = 0; j < data.length; j++) {
          allData.push(data[j]);
          breweryIds.push(data[j].id);
          brewery_type.push(data[j].brewery_type);
          city.push(data[j].city);
          country.push(data[j].country);
          postal_code.push(data[j].postal_code);
          state.push(data[j].state);
          counter++;
          if (counter == totalRecords) {
            getFavouriteBreweries();
          }
        }
        console.log(data);
      });
  }
}



//===============MAP PLOT FUNCTION=============================
let map;
// This example displays a marker centered at the selected brewery.
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
//===============END OF MAP PLOT FUNCTION=====================



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

  getDistinctValueArrays();
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
}



//-------------------------------------------------------
//Populate input box based on selected option
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

//Remove any elements from the autocomplete list that pop ups under the inlut control
function removeElements() {
  //clear all the item
  let items = document.querySelectorAll(".list-items");
  items.forEach((item) => {
    item.remove();
  });
}
//-------------------------------------------------

//============================
//read persistent data from local storage (i.e. brewery Ids) and populate favourite breweries list
var aFavouriteBreweries;
function getFavouriteBreweries() {
  listEl = document.getElementById("listFavourites");
  //Clear any existing elements in this list 
  removeOptions(listEl);
  //Read the data from the local storage into an object array
  aFavouriteBreweries = [];
  for (const [key, value] of Object.entries(localStorage)) {
    if (breweryIds.includes(value)) {
      console.log(key, value);
      //POPULATE LIST
      aFavouriteBreweries.push(key);
      //ADD BREWERY IN FAV LIST
      var option = document.createElement("option");
      option.text = value;
      listEl.add(option);
    }
  }
}


//add items from favourites list to local storage
function addFavouriteBreweryToLocalStorage() {
  if (!aFavouriteBreweries.includes(breweryId)) {
    aFavouriteBreweries.push(breweryId);
    localStorage.setItem(breweryId, breweryId);

    //UPDATE DISPLAY LIST
    listEl = document.getElementById("listFavourites");
    //Clear FAV List and local storage
    removeOptions(listEl);
    //localStorage.clear();
    //ADD BREWERY IN FAV LIST & and Local storage
    for (var brId of aFavouriteBreweries) {
      var option = document.createElement("option");
      option.text = brId;
      listEl.add(option);
      console.log(option);
    }
  }
}

//clear items from local storage
function clearLocalStorage () {
  //Clear local storage
  localStorage.clear();
  //clear existing favorits list
  aFavouriteBreweries=[];
  //update list control
  var listFavEl = document.getElementById("listFavourites");
  removeOptions(listFavEl);
}

//============================



//Filter and populate selected filtered breweries options list [middle field]
function getFilteredBreweries() {
  listEl = document.getElementById("listControl");
  //Clear Existing Elements
  removeOptions(listEl);

  var result = allData.filter((brewery) => {
    var filterValue = inputEl.value;

    if (selectedRadioId === "rAllData") {
      return allData;
    }
    else if (selectedRadioId === "rCountry") {
      return brewery.country === filterValue;
    }
    else if (selectedRadioId === "rState") {
      return brewery.state === filterValue;
    }
    else if (selectedRadioId === "rCity") {
      return brewery.city === filterValue;
    }
    else if (selectedRadioId === "rPostCode") {
      return brewery.postal_code === filterValue;
    }
  })
  var selectionBox = document.getElementById("iInput");
  var h2M = document.getElementById("h2Middle");
  h2M.innerHTML = "All Breweries in " + selectionBox.value;
  //populate selections 
  if (selectedRadioId === "rAllData" || selectedRadioId == undefined) {
    result = allData;
  }
  for (rec of result) {
    var option = document.createElement("option");
    option.text = rec.id;
    listEl.add(option);
  }
}

//Removes any existing items in the display list
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
  //Set up popup window content
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
    "<p>" + "Latitude: " + selectedBrewery[0].latitude + "<p>" +
    "<p>" + "Longitude: " + selectedBrewery[0].longitude + "<p>" +
    '<p>Website URL : <a href="' + selectedBrewery[0].website_url + '">' +
    '"' + selectedBrewery[0].website_url + '</a></p> ' +
    "</div>" +
    "</div>";
  //plot selected brewery on map
  initMap();
}





