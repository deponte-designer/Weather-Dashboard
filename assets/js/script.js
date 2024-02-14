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