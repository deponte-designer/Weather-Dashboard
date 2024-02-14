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
    currentDay.addClass("border");
    currentDay.css({
      "background-color": "#fff",
      "padding": "20px",
      "margin-bottom": "20px",
      "border-radius": "8px",
      "box-shadow": "0 0 10px rgba(0, 0, 0, 0.1)",})
  
  
    container.append(
      heading,
      temperatureParagraph,
      humidityParagraph,
      windParagraph
    );
  
    currentDay.css("padding-left", "1rem");
    currentDay.append(container);
  }

  