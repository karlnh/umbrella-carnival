const APIKey = "43dd332c7883656c9b184a8861ced36a";
// https://home.openweathermap.org/api_keys


const searchBtn = $('.search-button');
const searchTextEl = $('.input');
const cityModal = $('#modal-city-select');

const searchLimit = 5;

let cityList = $('#city-list');
let citySearch
let cityQuery = "http://api.openweathermap.org/geo/1.0/direct?q="+citySearch+"&limit=5&appid="+APIKey;
let cityCoords = "";



function main() {
    // On click, show modal populated with possible cities.
    // Requires a separate listener because I guess it accesses it through the class instead of the actual element being clicked.
    // For real, try replacing $('.js-modal-trigger') with searchBtn. It doesn't work.
    // Modeled after code in Bulma documentation:
    // https://bulma.io/documentation/components/modal/
    $('.js-modal-trigger').on('click', function(event) {
        cityList.empty();
        if (searchTextEl[0].value) { // if text is present
            cityModal.addClass('is-active');
            $('.delete').on('click', function(event) { // close button functionality
                cityModal.removeClass('is-active');
            });
            let search = searchTextEl[0].value;
            
            fetch("https://api.openweathermap.org/geo/1.0/direct?q="+search+"&limit="+searchLimit+"&appid="+APIKey)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // iterating through the data to get cities
                for (let i = 0; i < data.length; i++) {
                    if (data[i].state !== undefined) { // if its a US state
                        console.log(data[i].name, data[i].state);
                        cityList.append("<li " +
                        "lat=" + data[i].lat + " lon=" + data[i].lon + ">" +
                        data[i].name+", " + data[i].state+", " + data[i].country +
                        "</li>");
                    } else { // if not a US state
                        console.log(data[i].name, data[i].country);
                        cityList.append("<li " +
                        "lat=" + data[i].lat + " lon=" + data[i].lon + ">" +
                        data[i].name + ", " + data[i].country +
                        "</li>"
                        );
                    }
                }
            })

        }; // otherwise don't do anything.
    });

                // console.log(data[0].name+", "+data[0].state);
                // console.log(data[0].lat);
                // console.log(data[0].lon);
        // save searchText to local storage
        // convert city into lat long in cityCoords
        // fetch(cityQuery)
        //     .then(function (response) {
        //         return response.json();
        //     })
        //     .then(function (data) {
        //         console.log(data[0]);

        //     });


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