const APIKey = "43dd332c7883656c9b184a8861ced36a";
// https://home.openweathermap.org/api_keys

const searchLimit = 5;

const dateSpan = $('#date');
const searchBtn = $('#search-button');
const searchTextEl = $('.input');
const cityModal = $('#modal-city-select');
const cityList = $('#city-list');
const weatherNow = $('#weather-now-vars');
const selectedCity = $('#selected-city');
const cityWeatherIcon = $('#selected-city-weather-icon');

let citySearch;
let cityCoords = "";
let weatherList = weatherNow[0].children;

function main() {
    dateSpan.text(dayjs().format("ddd, MMM D"));
    setInterval(function () {
        dateSpan.text(dayjs().format("ddd, MMM D"));
    }, 3600000); // updates every hour
    
    
    // On click, show modal populated with possible cities.

    searchBtn.click(function(event) {
        cityList.empty(); // clear modal list on new search
        let search = searchTextEl[0].value;
        if (search) { // if text is present
            cityModal.addClass('is-active');
            $('.delete').on('click', function(event) { // close button functionality
                cityModal.removeClass('is-active');
            });
            fetch("https://api.openweathermap.org/geo/1.0/direct?q="+search+"&limit="+searchLimit+"&appid="+APIKey
            )
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
                });
        // grabs weather information about clicked city.
        cityList.on('click', function (event) {

            let element = event.target;
            if (element.matches("li")) { // if we're actually clicking the list element
                cityModal.removeClass('is-active'); // hides modal
                let cityName = $(element).data('city-name');
                let cityLat = $(element).data('lat');
                let cityLon = $(element).data('lon');
                fetch("https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat="+cityLat+"&lon="+cityLon+"&appid="+APIKey)
                    .then(function (response) { return response.json();
                    })
                    .then(function (data) {
                        // console.log(data);
                        let currentWeather = data.list[0];
                        selectedCity.text(cityName);
                        cityWeatherIcon.text(currentWeather.weather.main); // associate the icon with the weather.
                        // TODO: get these to be the right measurement.
                        weatherList[0].textContent = currentWeather.main.temp + "°F";
                        weatherList[1].textContent = currentWeather.main.humidity + "%";
                        weatherList[2].textContent = currentWeather.wind.speed + " miles/hour";
                        

                    });
            }
        })

            
        }; // otherwise don't do anything.
    });

    // save searchText to local storage


}
    // Write a subfunction which concats the newest search to localStorage along with a clickable link to the city weather data. Only five most recent searched cities should be displayed. This may involve simply cutting out the first element of the localStorage array.

    // TODO: Display past searches in the Previous searches section by grabbing it from localStorage.

    // TODO: Write a function which generates HTML level-items for the 5-Day Forecast.
        // Grab 5-Day Forecast information starting from the current day.
        // Display temp, humidity, and wind speed information for each day.

main();