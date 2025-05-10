import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import the custom CSS file

const API_KEY = "b28f5efa6aea47d3951bd5d0156ca90c"; // Replace with your actual Weatherbit API key

function App() {
  const [city, setCity] = useState("Delhi"); // Default city
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch weather data
  const getForecast = async () => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${API_KEY}&days=5`
    );

    // Check if the city is valid by ensuring the API response contains data
    if (res.data && res.data.data && res.data.data.length > 0) {
      setForecast(res.data.data); // Storing the forecast data
    } else {
      alert("City doesn't exist. Please enter a valid city name.");
    }
  } catch (err) {
    alert("City doesn't exist or API error. Please try again.");
  }
  setLoading(false);
};

  // 🌍 Detect user location using geolocation and fetch weather data
  useEffect(() => {
    const fetchWeatherByLocation = () => {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await axios.get(
              `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${API_KEY}&days=5`
            );
            setForecast(res.data.data); // Storing the forecast data
          } catch (error) {
            alert("Unable to fetch weather for your location.");
          }
          setLoading(false);
        },
        (error) => {
          alert("Geolocation permission denied. Please search manually.");
          setLoading(false);
        }
      );
    };

    fetchWeatherByLocation();
  }, []);

  // Event handler for city search input
  const handleCityChange = (e) => {
    setCity(e.target.value); // Set the city name based on input
  };

  // Trigger weather search based on city name
  const handleSearch = () => {
    getForecast(); // Fetch weather data for the entered city
  };

  return (
    <div className="weather-container">
      <div className="header">
        <h1>🌦️ 5-Day Weather Forecast</h1>
        <div className="search-bar">
          <input
            type="text"
            value={city}
            placeholder="Enter city"
            onChange={handleCityChange}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div> // Show loading text while fetching
      ) : (
        <div className="forecast-container">
          {forecast.map((day, index) => (
            <div className="forecast-card" key={index}>
              {/* Display date and weather data */}
              <h3>{new Date(day.datetime).toDateString()}</h3>
              <img
                src={`https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`}
                alt="weather"
              />
              <p className="description">{day.weather.description}</p>
              <div className="weather-details">
                <p>Temp: {day.temp}°C</p>
                <p>Humidity: {day.rh}%</p>
                <p>Wind: {day.wind_spd} m/s</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
