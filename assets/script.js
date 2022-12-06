// https://home.openweathermap.org/api_keys

const geoAPI = "https://api.openweathermap.org/geo/1.0/direct?q="
const currentWeatherAPI = "https://api.openweathermap.org/data/2.5/weather?&units=imperial"
const forecastAPI = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial"
const optionalCitiesLimit = 5;

const searchHistoryEl = $('#search-history');
const dateSpanEl = $('#date');
const searchBtnEl = $('#search-button');
const searchBoxEl = $('.input');
const cityModal = $('#modal-city-select');
const cityList = $('#city-list');
const currentWeatherVariables = $('#weather-now-vars');
const selectedCity = $('#selected-city');
const weatherIconSpan = $('#selected-city-weather-icon-span');
const weatherContainer = $('#weather-container');

// Initialize localStorage if empty:
let searchesJSON = JSON.parse(localStorage.getItem("searches"));
console.log(searchesJSON)
if (searchesJSON === null) {
    searchesJSON = [];
    localStorage.setItem("searches", JSON.stringify(searchesJSON));
} else if (searchesJSON.length === 0) {
    searchHistoryEl.empty(); // making sure search history is empty if local storage is empty
} else {
    searchHistoryEl.text("<li>Here's an entry!</li>");
}


function main() {
    function getCurrentDate() {
        dateSpanEl.text(dayjs().format("ddd, MMM D"));
        setInterval(function () {
            dateSpanEl.text(dayjs().format("ddd, MMM D"));
        }, 3600000); // updates every hour
    }
    // On click, show modal populated with possible cities.
    function showCityList() {
        searchBtnEl.click(function(event) {
            cityList.empty(); // clear modal list on new search
            let search = searchBoxEl[0].value;
            if (search) { // if text is present
                cityModal.addClass('is-active'); // show modal
                $('.delete').on('click', function(event) { // close button functionality
                    cityModal.removeClass('is-active'); // hide modal
                });
                fetch(geoAPI+search+"&limit="+optionalCitiesLimit+"&appid="+APIKey)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        // iterating through the data to get cities
                        for (let i = 0; i < data.length; i++) {
                            let city = data[i];
                            if (city.state !== undefined) { // if its a US state
                                // console.log(city.name, city.state);
                                cityList.append("<li " +
                                "data-city-name=" + city.name +
                                " data-lat=" + data[i].lat + " data-lon=" + data[i].lon + ">"
                                + city.name + ", " + city.state + ", " + city.country +
                                "</li>");
                                // VSCode is suggesting to turn the previous into the following:
                                // `<li lat=${data[i].lat} lon=${data[i].lon}>${city.name}, ${city.state}, ${city.country}</li>`
                            } else { // if not a US state
                                // console.log(city.name, city.country);
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
                        city.name
                        const newCity = {
                            name: city.name,
                        }
                        searchesJSON.push()
                        localStorage.setItem("searches", JSON.stringify(searchesJSON));
                    });    
            }; // otherwise don't do anything.
        });
        
    }
    // grabs weather information about clicked city.
    function grabWeatherInfo() {
        cityList.on('click', function (event) { // when clicking on a city,
            let element = event.target;
            if (element.matches("li")) { // if we're actually clicking the list element
                cityModal.removeClass('is-active'); // hides modal
                let cityName = $(element).data('city-name');
                let cityLat = $(element).data('lat');
                let cityLon = $(element).data('lon');
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
                        weatherContainer.append(
                            '<section class="box">'+
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
                                            '<p class="heading"><strong>'+ dateAndTime[0] + '</strong></p>'+
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
    

    // save searchText to local storage

    getCurrentDate();
    showCityList();
    grabWeatherInfo();
} // end of main

    // Write a subfunction which concats the newest search to localStorage along with a clickable link to the city weather data. Only five most recent searched cities should be displayed. This may involve simply cutting out the first element of the localStorage array.

    // TODO: Display past searches in the Previous searches section by grabbing it from localStorage.

    // TODO: Write a function which generates HTML level-items for the 5-Day Forecast.
        // Grab 5-Day Forecast information starting from the current day.
        // Display temp, humidity, and wind speed information for each day.
main();