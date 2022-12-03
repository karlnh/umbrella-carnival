const APIKey = "43dd332c7883656c9b184a8861ced36a";
// https://home.openweathermap.org/api_keys

const searchBtn = $('#search-button');
const searchTextEl = $('.input');
const cityModal = $('#modal-city-select');
const cityModalList = $('city-list');

const searchLimit = 5;

let cityList = $('#city-list');
let citySearch
let cityQuery = "http://api.openweathermap.org/geo/1.0/direct?q="+citySearch+"&limit=5&appid="+APIKey;
let cityCoords = "";

function main() {
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
            ).then(function (response) {
                return response.json();
            }).then(function (data) {
                // iterating through the data to get cities
                for (let i = 0; i < data.length; i++) {
                    let city = data[i];
                    if (city.state !== undefined) { // if its a US state
                        console.log(city.name, city.state);
                        cityList.append("<li " +
                        "data-lat=" + data[i].lat + " data-lon=" + data[i].lon + ">" +
                        city.name + ", " + city.state + ", " + city.country +
                        "</li>");
                        // VSCode is suggesting to turn the previous into the following:
                        // `<li lat=${data[i].lat} lon=${data[i].lon}>${city.name}, ${city.state}, ${city.country}</li>`
                    } else { // if not a US state
                        console.log(city.name, city.country);
                        cityList.append("<li " +
                        "data-lat=" + data[i].lat + " data-lon=" + data[i].lon + ">" +
                        city.name + ", " + city.country +
                        "</li>"
                        );
                        // VSCode is suggesting to turn the previous into the following:
                        // `<li lat=${data[i].lat} lon=${data[i].lon}>${city.name}, ${city.country}</li>`
                    }
                }
            });

        cityList.on('click', function (event) {
            let element = event.target;
            if (element.matches("li")) {
                console.log(element);
                cityLat = element.lat;
                cityLon = element.lon;

            }
        })

            
        }; // otherwise don't do anything.
    });

    // save searchText to local storage


}

    // TODO: Write a function which grabs a selected city and its weather information through OWM's API.
    // Write a subfunction which concats the newest search to localStorage along with a clickable link to the city weather data. Only five most recent searched cities should be displayed. This may involve simply cutting out the first element of the localStorage array.

    // TODO: Display past searches in the Previous searches section by grabbing it from localStorage.

    // TODO: Write a function which grabs the current date and shows it in the Current Weather header.

    // TODO: Write a function which grabs current temperature, humidity, and wind speed for a given city;
        // Display city name;
        // Associate types of weather with different emojis, and display the correct emoji next to the city name;
        // Display temp, humidity, and wind speed information in the corresponding element.

    // TODO: Write a function which generates HTML level-items for the 5-Day Forecast.
        // Grab 5-Day Forecast information starting from the current day.
        // Display temp, humidity, and wind speed information for each day.

main();