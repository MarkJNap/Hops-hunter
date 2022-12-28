// Brewery API info https://www.openbrewerydb.org/documentation

let mapButtonEl = document.getElementById("map-btn")
let breweryButtonEl = document.getElementById("brewery-btn")

breweryButtonEl.addEventListener("click", getApi)
mapButtonEl.addEventListener("click", initMap);

function getApi(requestUrl) {
    requestUrl = "https://api.openbrewerydb.org/breweries"
    fetch(requestUrl)
      .then(function (response) {
        console.log(response);
        return response.json()
    })
    .then(function (data) {
        console.log(data);
    })
}

//===============MAP=============================
let map;

// In this example, we center the map, and add a marker, using a LatLng object
// literal instead of a google.maps.LatLng object. LatLng object literals are
// a convenient way to add a LatLng coordinate and, in most cases, can be used
// in place of a google.maps.LatLng object.


function initMap() {
  const mapOptions = {
    zoom: 8,
    center: { lat: -34.397, lng: 150.644 },
  };

  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  const marker = new google.maps.Marker({
    // The below line is equivalent to writing:
    // position: new google.maps.LatLng(-34.397, 150.644)
    position: { lat: -34.397, lng: 150.644 },
    map: map,
  });
  // You can use a LatLng literal in place of a google.maps.LatLng object when
  // creating the Marker object. Once the Marker object is instantiated, its
  // position will be available as a google.maps.LatLng object. In this case,
  // we retrieve the marker's position using the
  // google.maps.LatLng.getPosition() method.
  const infowindow = new google.maps.InfoWindow({
    content: "<p>Marker Location:" + marker.getPosition() + "</p>",
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.open(map, marker);
  });
}


window.initMap = initMap;

