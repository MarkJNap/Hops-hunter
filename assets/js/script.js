// Brewery API info https://www.openbrewerydb.org/documentation

let mapButtonEl = document.getElementById("map-btn")
let breweryButtonEl = document.getElementById("brewery-btn")

breweryButtonEl.addEventListener("click", getApi)

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