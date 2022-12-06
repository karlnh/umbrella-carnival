const APIKey = "7996bf8150b05facfb3dde1b4384aa60";
// https://home.openweathermap.org/api_keys

const geoAPI = "https://api.openweathermap.org/geo/1.0/direct?q="
const currentWeatherAPI = "https://api.openweathermap.org/data/2.5/weather?&units=imperial"
const forecastAPI = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial"
const optionalCitiesLimit = 5;

const searchHistoryEl = $('#search-history');
const dateSpanEl = $('#date');
const searchEl = $('.search-class');
const searchBoxEl = $('.input');
const cityModal = $('#modal-city-select');
const cityList = $('#city-list');
const cities = $('.cities');
const currentWeatherVariables = $('#weather-now-vars');
const selectedCity = $('#selected-city');
const weatherIconSpan = $('#selected-city-weather-icon-span');
const weatherContainer = $('#weather-container');
const fiveDayForecastEl = $('#five-day-forecast-box');

let search;

function main() {
    // Initialize localStorage if empty:
    let searchesJSON = JSON.parse(localStorage.getItem("searches"));
    if (searchesJSON === null) {
        searchesJSON = [];
        localStorage.setItem("searches", JSON.stringify(searchesJSON));
    } else if (searchesJSON.length === 0) {
        searchHistoryEl.empty(); // making sure search history is empty if local storage is empty
    } else {
        if (searchesJSON.length > 5) { // keep list length to 5
            for (let i = searchesJSON.length; i > 5; i--) {
                searchesJSON.shift();
            }
        }
        for (let i = 0; i < searchesJSON.length; i++) {
            searchesJSON[i];
            searchHistoryEl.prepend(
                "<li " +
                "data-city-name=" + searchesJSON[i].name +
                " data-lat=" + searchesJSON[i].lat + " data-lon=" + searchesJSON[i].lon + ">"
                + searchesJSON[i].name +
                "</li>");
        }
    }
    function getCurrentDate() {
        dateSpanEl.text(dayjs().format("ddd, MMM D"));
        setInterval(function () {
            dateSpanEl.text(dayjs().format("ddd, MMM D"));
        }, 3600000); // updates every hour
    }
    // On click, show modal populated with possible cities.
    function showCityList() {
        searchEl.click(function(event) {
            cityList.empty(); // clear modal list on new search
            if (!$(event.target).hasClass('button')) { // if not the search button clicked
                search = $(event.target).data('city-name');
            } else {
                search = searchBoxEl[0].value;
                cityModal.addClass('is-active'); // show modal
                $('.delete').on('click', function(event) { // close button functionality
                    cityModal.removeClass('is-active'); // hide modal
                });
            }
            fetch(geoAPI+search+"&limit="+optionalCitiesLimit+"&appid="+APIKey)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    // iterating through the data to get cities
                    for (let i = 0; i < data.length; i++) {
                        let city = data[i];
                        if (city.state !== undefined) { // if its a US state
                            cityList.append("<li " +
                            "data-city-name=" + city.name +
                            " data-lat=" + data[i].lat + " data-lon=" + data[i].lon + ">"
                            + city.name + ", " + city.state + ", " + city.country +
                            "</li>");
                            // VSCode is suggesting to turn the previous into the following:
                            // `<li lat=${data[i].lat} lon=${data[i].lon}>${city.name}, ${city.state}, ${city.country}</li>`
                        } else { // if not a US state
                            cityList.append("<li " +
                            "data-city-name=" + city.name +
                            " data-lat=" + data[i].lat + " data-lon=" + data[i].lon + ">"
                            + city.name + ", " + city.country +
                            "</li>"
                            );
                            // VSCode is suggesting to turn the previous into the following:
                            // `<li lat=${data[i].lat} lon=${data[i].lon}>${city.name}, ${city.country}</li>`
                        }     
                    }
                    // if no city by that search can be found...
                    if (cityList[0].childElementCount === 0) {
                        console.log("No city found.");
                        cityList.append('<p>No cities found.</p>');
                    }
                });    
        });
        
    }
    // grabs weather information about clicked city.
    function grabWeatherInfo() {
        cities.on('click', function (event) { // when clicking on a city,
            let element = event.target;
            if (element.matches("li")) { // if we're actually clicking the list element
                cityModal.removeClass('is-active'); // hides modal
                let cityName = $(element).data('city-name');
                let cityLat = $(element).data('lat');
                let cityLon = $(element).data('lon');
                // save search to local storage
                const newCity = {
                    name: cityName,
                    lat: cityLat,
                    lon: cityLon
                }
                searchesJSON.push(newCity);
                localStorage.setItem("searches", JSON.stringify(searchesJSON));
                // fetch the city forecast.
                fetch(currentWeatherAPI+"&lat="+cityLat+"&lon="+cityLon+"&appid="+APIKey)
                    .then(function (response) {
                        if (response.status !== 200) {
                            window.alert("Error in retrieving data from OpenWeatherMap.");
                            console.log(response.status);
                        } else {
                            return response.json();
                        }
                    })
                    .then(function (data) {
                        // set city name and today's weather
                        selectedCity.text(cityName);
                        weatherIconSpan.html(
                            '<img id="weather-icon" src="https://openweathermap.org/img/wn/'+
                            data.weather[0].icon
                            +'.png"/>'
                        );
                        let weatherListEl = currentWeatherVariables[0].children;
                        weatherListEl[0].textContent = data.main.temp + "°F";
                        weatherListEl[1].textContent = data.main.humidity + "%";
                        weatherListEl[2].textContent = data.wind.speed + " miles/hour";
                    });
                fetch(forecastAPI+"&lat="+cityLat+"&lon="+cityLon+"&appid="+APIKey)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        // add 5-day weather forecast box
                        weatherContainer[0].lastChild.remove() // remove the previous weather container
                        weatherContainer.append(
                            '<section id="five-day-forecast-box" class="box">'+
                            '<h3 class="title is-4 has-text-info-dark">'+
                                '5-Day Forecast' + 
                            '</h3>'+
                            '<div id="weather-forecast" class="level">'+
                            '</div>'+
                            '</section>'
                        );
                        for (let i = 0; i < data.list.length; i++) {
                            // starts at 9 am
                            let dateAndTime = data.list[i].dt_txt.split(" ");
                            // let dateAndTime = data.list[i].dt_txt;
                            if (dateAndTime[1] === "12:00:00") {
                                $('#weather-forecast').append(
                                    '<div class="level-item">'+
                                        '<div>'+
                                            '<div>' +
                                                '<p class="heading"><strong>'+ dateAndTime[0] + '</strong></p>'+
                                                '<img id="weather-icon" src="https://openweathermap.org/img/wn/'+ data.list[i].weather[0].icon + '.png"/>'+
                                            '</div>' + 
                                            '<p class="heading">Temp: ' + data.list[i].main.temp + '</p>' +
                                            '<p class="heading">Humidity: ' + data.list[i].main.humidity + '</p>'+
                                            '<p class="heading">Wind: ' + data.list[i].wind.speed + '</p>' +
                                        '</div>'+
                                    '</div>'
                                );
                            }
                        }
                    })
            }
        })
    }
    getCurrentDate();
    showCityList();
    grabWeatherInfo();
} // end of main
main();