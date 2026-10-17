
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

// Convert weather codes into readable conditions
function getWeatherCondition(code) {
    const weatherCodes = {
        0: "Clear Sky ☀️",
        1: "Mainly Clear 🌤️",
        2: "Partly Cloudy ⛅",
        3: "Overcast ☁️",
        45: "Foggy 🌫️",
        48: "Foggy 🌫️",
        51: "Light Drizzle 🌦️",
        53: "Drizzle 🌦️",
        55: "Heavy Drizzle 🌧️",
        61: "Light Rain 🌧️",
        63: "Moderate Rain 🌧️",
        65: "Heavy Rain 🌧️",
        71: "Light Snow ❄️",
        73: "Snowfall ❄️",
        75: "Heavy Snow ❄️",
        80: "Rain Showers 🌧️",
        81: "Moderate Showers 🌧️",
        82: "Heavy Showers ⛈️",
        95: "Thunderstorm ⛈️",
        96: "Thunderstorm with Hail ⛈️",
        99: "Severe Thunderstorm ⛈️"
    };

    return weatherCodes[code] || "Unknown Condition";
}

// Normalize city names for comparison
function normalizeName(name) {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

// Fetch weather information
async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        message.textContent = "Please enter a city name.";
        weatherCard.classList.add("hidden");
        return;
    }

    // Reject numbers and invalid characters
    if (!/^[a-zA-ZÀ-ÿ\s.'-]+$/.test(city)) {
        message.textContent =
            "Invalid city name. Please enter letters only.";
        weatherCard.classList.add("hidden");
        return;
    }

    if (city.replace(/[^a-zA-ZÀ-ÿ]/g, "").length < 2) {
        message.textContent = "Please enter a valid city name.";
        weatherCard.classList.add("hidden");
        return;
    }

    searchBtn.disabled = true;
    message.textContent = "Loading weather...";
    weatherCard.classList.add("hidden");

    try {
        // Step 1: Search for the city
        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`;

        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) {
            throw new Error("Unable to search for the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error(
                "City not found. Please check the spelling."
            );
        }

        // Step 2: Match the city name exactly
        const normalizedCity = normalizeName(city);

        const place = geoData.results.find(
            item => normalizeName(item.name) === normalizedCity
        );

        if (!place) {
            throw new Error(
                "Exact city match not found. Try adding the state or country to the search."
            );
        }

        // Step 3: Fetch current weather
        const latitude = place.latitude;
        const longitude = place.longitude;

        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        if (!current) {
            throw new Error("Weather information is unavailable.");
        }

        // Step 4: Display weather
        const locationParts = [
            place.name,
            place.admin1,
            place.country
        ].filter(Boolean);

        cityName.textContent = [...new Set(locationParts)].join(", ");
        temperature.textContent = `${current.temperature_2m} °C`;
        condition.textContent =
            getWeatherCondition(current.weather_code);
        humidity.textContent = `${current.relative_humidity_2m}%`;
        windSpeed.textContent = `${current.wind_speed_10m} km/h`;

        message.textContent = "";
        weatherCard.classList.remove("hidden");

    } catch (error) {
        message.textContent =
            error.message || "Something went wrong. Please try again.";

        weatherCard.classList.add("hidden");

    } finally {
        searchBtn.disabled = false;
    }
}

// Search button
searchBtn.addEventListener("click", getWeather);

// Search with Enter key
cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
