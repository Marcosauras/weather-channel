// grab todays weather then display it in a big card
// grab the next 5 days weather

cities = [];
let cityForm = document.getElementById("city-search-form");
let userCityInput = document.getElementById("city");
let todaysWeatherContainer = document.getElementById("current-weather-container");
let userCitySearchInput = document.getElementById("searched-cities");
let forecastTitle = document.getElementById("forecast");
let forecastContainer = document.getElementById("five-day-forecast-container");
let pastSearchButton = document.getElementById("past-search-btns");

// grabs weather
var getCityWeather = function (city) {
  const apiKey = "63e93757f0a90bffa65499f50faef5b2";

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => displayTodaysWeather(data));
};
let getFiveDayForecast = function (city) {
  const apiKey = "63e93757f0a90bffa65499f50faef5b2";

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => displayNextFiveDays(data));
};

// displays the current days weather
let displayTodaysWeather = function (weather, citySearched) {
  todaysWeatherContainer.textContent = "";
  userCitySearchInput.textContent = console.log(weather);

  let currentDate = document.createElement("div");
  currentDate.textContent = dayjs(weather.dt.value).format("MMM D, YYYY");

  let todayWeather = document.createElement("div");
  // creates the card with the weather information
  todayWeather.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">
    "<p>Temperature: ${weather.main.temp} °F</p>
    <p>Humidity:${weather.main.humidity} %</p>
    <p>Wind Speed:${weather.wind.speed} MPH</p>`;
  todaysWeatherContainer.append(currentDate);
  todaysWeatherContainer.append(todayWeather);
};
// displays the next 5 days off weather
let displayNextFiveDays = function (weather) {
  forecastContainer.textContent = "";
  forecastTitle.textContent = "Next 5 day Forecast";

  console.log(weather);

  var forecast = weather.list;
  for (var i = 5; i < forecast.length; i = i + 8) {
    var dailyForecast = forecast[i];
    let fiveDayForecastDiv = document.createElement("div");
    fiveDayForecastDiv.classList.add("bg-white", "m-1", "rounded", "md:p-5");

    fiveDayForecastDiv.innerHTML = `<img src="http://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png">
        <p>Temperature: ${dailyForecast.main.temp} °F</p>
        <p>Humidity:${dailyForecast.main.humidity} %</p>
        <p>Wind Speed:${dailyForecast.wind.speed} MPH</p>`;
    forecastContainer.append(fiveDayForecastDiv);
  }
};
let weatherFormSubmitHandler = function (city) {
  if (city) {
    getCityWeather(city);
    getFiveDayForecast(city);
  } else {
    return;
  }
};

function storePastSearch() {
  localStorage.setItem("cities", JSON.stringify(cities));
};

let createBtnsOnLoad = function(){
  let citiesFromLocalStorage = JSON.parse(localStorage.getItem("cities"));
  if(citiesFromLocalStorage === null){
    return;
  }else{
    for(let i = 0; i < citiesFromLocalStorage.length; i++){
      pastSearch = document.createElement("button");
      pastSearch.textContent = citiesFromLocalStorage[i];
      pastSearch.classList = "d-flex btn-light p-2 past-search-btn";
      pastSearch.setAttribute("data-city", citiesFromLocalStorage[i]);
      pastSearch.setAttribute("type", "submit");
      pastSearchButton.prepend(pastSearch);
    }
  }
};
let createBtns = function(city){

  if(city === null){
    return;
  }else{
      pastSearch = document.createElement("button");
      pastSearch.textContent = city;
      pastSearch.classList = "d-flex btn-light p-2 past-search-btn";
      pastSearch.setAttribute("data-city", city);
      pastSearch.setAttribute("type", "submit");
      pastSearchButton.prepend(pastSearch);
  }
};
var pastWeatherSearchHandler = function (event) {
  var city = event.target.getAttribute("data-city");
  if (city) {
    getCityWeather(city);
    getFiveDayForecast(city);
  } else {
  return;
  }
};

cityForm.addEventListener("submit", function(){
  event.preventDefault();
  let city = userCityInput.value.trim();
  weatherFormSubmitHandler(city);
  if(city == ""){
    return;
  } else{
  cities.push(city)
  userCityInput.value = "";
  storePastSearch();
  createBtns(city);
  }
});
pastSearchButton.addEventListener("click", pastWeatherSearchHandler);
createBtnsOnLoad();