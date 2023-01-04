// grab todays weather then display it in a big card
// grab the next 5 days weather
// create button for every search
// have buttons save to local storage so they stay on local storage 

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
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`)
    .then((res) => res.json())
    .then((data) => displayTodaysWeather(data));
};
let getFiveDayForecast = function (city) {
  const apiKey = "63e93757f0a90bffa65499f50faef5b2";
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`)
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
  forecastTitle.classList.add("m-3","justify-center")

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
  let cities = JSON.parse(localStorage.getItem("cities"));
  if(cities === null){
    return;
  }else{
    for(let i = 0; i < cities.length; i++){
      pastSearch = document.createElement("button");
      pastSearch.textContent = cities[i];
      pastSearch.classList = "my-1 block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out";
      pastSearch.setAttribute("data-city", cities[i]);
      pastSearch.setAttribute("type", "submit");
      pastSearchButton.prepend(pastSearch);
    }
  }
};
// creates the buttons as they are searched
let createBtns = function(city){
  if(city === null){
    return;
  }else{
      pastSearch = document.createElement("button");
      pastSearch.textContent = city;
      pastSearch.classList = "my-1 block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out";
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
