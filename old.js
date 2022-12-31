// step 1 grab info from search bar
// step 2 send info to the weather api
// step 3 display weather based off location info from search bar
// step 4 save info from search bar to create buttons to easily go back to
// step 5 have info save even when page is refreshed

let cities = [];
let cityForm = document.getElementById("city-search-form");
let userCityInput = document.getElementById("city");
let weatherContainer = document.getElementById("current-weather-container");
let userCitySearchInput = document.getElementById("searched-cities");
let forecastTitle = document.getElementById("forecast");
let forecastContainerEl = document.getElementById(
  "five-day-forecast-container"
);
let pastSearchButtonEl = document.getElementById("past-search-btns");

var getCityWeather = function (city) {
  let apiKey = "63e93757f0a90bffa65499f50faef5b2";
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, city);
    });
  });
};
var weatherFormSubmitHandler = function (event) {
  event.preventDefault();
  var city = userCityInput.value.trim();
  if (city) {
    getCityWeather(city);
    grab5DayForecast(city);
    cities.unshift({ city });
    userCityInput.value = "";
  } else {
    return;
  }
  saveSearch();
  usersPastSearch(city);
};

var saveSearch = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
};

var displayWeather = function (weather, searchCity) {
  //clear old content
  weatherContainer.textContent = "";
  userCitySearchInput.textContent = searchCity;

  //console.log(weather);

  //create date element for current day
  var currentDate = document.createElement("span");
  currentDate.textContent =
    " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  userCitySearchInput.appendChild(currentDate);

  //adds the weather img to the current day
  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  );
  userCitySearchInput.appendChild(weatherIcon);

  //adds the weather to current day
  var temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
  temperatureEl.classList = "list-group-item";

  //adds the humidity percentage to the current day
  var humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  humidityEl.classList = "list-group-item";

  //create a span element to hold Wind data
  var windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
  windSpeedEl.classList = "list-group-item";
  //append to container
  weatherContainer.appendChild(temperatureEl);
  //append to container
  weatherContainer.appendChild(humidityEl);
  //append to container
  weatherContainer.appendChild(windSpeedEl);
};

var grab5DayForecast = function (city) {
  var apiKey = "844421298d794574c100e3409cee0499";
  var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      display5Day(data);
    });
  });
};

var display5Day = function (weather) {
  forecastContainerEl.textContent = "";
  forecastTitle.textContent = "5-Day Forecast:";

  var forecast = weather.list;
  for (var i = 5; i < forecast.length; i = i + 8) {
    var dailyForecast = forecast[i];

    var forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-outline-secondary text-dark m-2";

    console.log(dailyForecast);

    //create date element
    var forecastDate = document.createElement("h5");
    forecastDate.textContent = moment
      .unix(dailyForecast.dt)
      .format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center";
    forecastEl.appendChild(forecastDate);

    //create an image element
    var weatherIcon = document.createElement("img");
    weatherIcon.classList = "card-body text-center";
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );

    //append to forecast card
    forecastEl.appendChild(weatherIcon);

    //create temperature span
    var forecastTempEl = document.createElement("span");
    forecastTempEl.classList = "card-body text-center";
    forecastTempEl.textContent = dailyForecast.main.temp + " °F";

    //append to forecast card
    forecastEl.appendChild(forecastTempEl);

    var forecastHumEl = document.createElement("span");
    forecastHumEl.classList = "card-body text-center";
    forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

    forecastEl.appendChild(forecastHumEl);
    //append to five day container
    forecastContainerEl.appendChild(forecastEl);
  }
};

var usersPastSearch = function (pastSearch) {
  // localStorage.setItem("cities", JSON.parse(cities));

  pastSearchEl = document.createElement("button");
  pastSearchEl.textContent = pastSearch;
  pastSearchEl.classList = "d-flex btn-light p-2 past-search-btn";
  pastSearchEl.setAttribute("data-city", pastSearch);
  pastSearchEl.setAttribute("type", "submit");

  pastSearchButtonEl.prepend(pastSearchEl);
};

var pastWeatherSearchHandler = function (event) {
  var city = event.target.getAttribute("data-city");
  if (city) {
    getCityWeather(city);
    grab5DayForecast(city);
  } else {
  return;
  }
};

usersPastSearch();

cityForm.addEventListener("submit", weatherFormSubmitHandler);
pastSearchButtonEl.addEventListener("click", pastWeatherSearchHandler);
