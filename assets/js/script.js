let buttonEl = document.getElementById("testing-btn")




buttonEl.addEventListener("click", getApi)

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