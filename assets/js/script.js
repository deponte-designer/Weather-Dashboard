
const apiKey = "e063538dbd7a64e6085495b882b71be5";

// Function to fetch weather data by city name
function getWeatherByCity(cityName) {
  // Construct the API URL
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

  // Make an AJAX request to the OpenWeatherMap API
  $.ajax({
    url: apiUrl,
    method: "GET",
  })
    .then(function (response) {
      displayCurrentWeather(response);
      displayForecast(response);
      addToHistory(cityName);
    })
    .fail(function (error) {
      // Handle errors by logging to the console and displaying an alert
      console.error("Error fetching weather data:", error);
      alert(`${cityName} doesn't exist`);
    });
}

// Event listener for the search form submission
$("#search-form").on("submit", function (event) {
  event.preventDefault();
  // Get user input and trigger weather data retrieval
  const userInput = $("#search-input");
  const cityName = userInput.val().trim();

  if (cityName) {
    getWeatherByCity(cityName);
  }

  // Clear the input field
  userInput.val("");
});

// Function to display current weather data
function displayCurrentWeather(response) {
  const currentDay = $("#today");
  currentDay.empty();
  $("h4").removeClass("hide");

  const currentWeather = response.list[0];
  const cityName = response.city.name;
  const date = dayjs.unix(currentWeather.dt).format("DD MMM, YYYY");
  const icon = currentWeather.weather[0].icon;
  const temperature = currentWeather.main.temp;
  const humidity = currentWeather.main.humidity;
  const windSpeed = currentWeather.wind.speed;

  // Generate HTML elements to visually represent data on a webpage
  const container = $("<div>");
  const heading = $("<h2>");
  const iconEl = $("<img>");
  const temperatureParagraph = $("<p>");
  const humidityParagraph = $("<p>");
  const windParagraph = $("<p>");

  iconEl.attr("src", `https://openweathermap.org/img/wn/${icon}.png`);
  heading.text(`${cityName} (${date})`);
  heading.append(iconEl);
  temperatureParagraph.text(`Temperature: ${temperature} °C`);
  humidityParagraph.text(`Humidity: ${humidity} %`);
  windParagraph.text(`Wind Speed: ${windSpeed} m/s`);
  currentDay.addClass("border today-style");
  // currentDay.css({
  //   "background-color": "#fff",
  //   "padding": "20px",
  //   "margin-bottom": "20px",
  //   "border-radius": "8px",
  //   "box-shadow": "0 0 10px rgba(0, 0, 0, 0.1)",})


  container.append(
    heading,
    temperatureParagraph,
    humidityParagraph,
    windParagraph
  );

  currentDay.css("padding-left", "1rem");
  currentDay.append(container);
}

// Function to display forecast data
function displayForecast(response) {
  const forecastSection = $("#forecast");
  let currentDate = dayjs().startOf("day");

  const forecastList = response.list.filter(function (forecast) {
    if (dayjs.unix(forecast.dt).startOf("day").isAfter(currentDate)) {
      currentDate = dayjs.unix(forecast.dt).startOf("day");
      return forecast;
    }
  });

  forecastSection.empty();

  forecastList.forEach(function (forecast) {
    const date = dayjs.unix(forecast.dt).format("DD MMM, YYYY");
    const icon = forecast.weather[0].icon;
    const temperature = forecast.main.temp;
    const humidity = forecast.main.humidity;
    const wind = forecast.wind.speed;

    const forecastItem = `
    <div class="col-lg mb-2">
      <div class="card card-styles">
        <div class="card-body">
          <h5 class="card-title">${date}</h5>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
          <p class="card-text">Temp: ${temperature} °C</p>
          <p class="card-text">Wind: ${wind} m/s</p>
          <p class="card-text">Humidity: ${humidity} %</p>
        </div>
      </div>
    </div>
  `;

    forecastSection.append(forecastItem);
  });
}

// Function to add city to the search history
function addToHistory(cityName) {
  // Retrieve existing search history from local storage
  const storedHistory = localStorage.getItem("cityHistory");
  const capitalizedCityName =
    cityName.toLowerCase().charAt(0).toUpperCase() +
    cityName.toLowerCase().slice(1);

  let result = false;

  // Parse existing search history or initialize an empty array
  const existingHistory = JSON.parse(storedHistory) || [];

  // Check if the city is already in the search history
  if (Array.isArray(existingHistory)) {
    for (let i = 0; i < existingHistory.length; i++) {
      if (
        existingHistory[i].toLowerCase() === capitalizedCityName.toLowerCase()
      ) {
        result = true;
      }
    }

    // Add the city to the search history if it's not already present
    if (!result) {
      existingHistory.unshift(capitalizedCityName);
      localStorage.setItem("cityHistory", JSON.stringify(existingHistory));

      // Update the display of search history
      updateHistoryDisplay();
    }
  } else {
    // If no search history exists, create a new one
    const newHistory = [capitalizedCityName];
    localStorage.setItem("cityHistory", JSON.stringify(newHistory));

    updateHistoryDisplay();
  }
}

// Function to update the display of search history
function updateHistoryDisplay() {
  $("#history").empty();

  // Retrieve the search history from local storage
  const cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];

  // Append each city button to the search history display
  cityHistory.forEach((city) => {
    $("#history").append(
      `<button type="button" class="btn btn-secondary mb-2" data-city=${city.toLowerCase()}>${city}</button>`
    );
  });
}

// Event listener for clicking on a city in the search history
$("#history").on("click", "[data-city]", function () {
  const cityName = $(this).attr("data-city");
  getWeatherByCity(cityName);
});

// Initialize the search history display on page load
updateHistoryDisplay();
