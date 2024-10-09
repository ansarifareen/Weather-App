import "./App.css";
import Icon from "react-icons-kit";
import { useEffect, useState } from "react";
import { search } from "react-icons-kit/feather/search";
import {arrowUp} from "react-icons-kit/feather/arrowUp";
import {arrowDown} from 'react-icons-kit/feather/arrowDown';
import { droplet } from "react-icons-kit/feather/droplet";
import { wind } from "react-icons-kit/feather/wind";
import { activity } from "react-icons-kit/feather/activity";
import { useDispatch, useSelector } from "react-redux";
import { get5DaysForcast, getCityData } from "./Store/Slices/WeatherSlice";
import { SphereSpinner } from "react-spinners-kit";
import ExtendedForecast from "./Components/ExtendedForecast";

function App() {
  //getting the redux states
  const {
    citySearchLoading,
    citySearchData,
    forecastLoading,
    forecastData,
    forecastError,
  } = useSelector((state) => state.weather);

  //main loading states
  const [loadings, setLoadings] = useState(true);

  //check if any of redux loading state is still true
  const allLoadings = [citySearchLoading, forecastLoading];
  useEffect(() => {
    const isAnyChildLoading = allLoadings.some((state) => state);
    setLoadings(isAnyChildLoading);
  }, [allLoadings]);

  const [city, setCity] = useState("Mumbai");
  const [unit, setUnit] = useState("metric"); //metric=C || //imperial=F

  //handling the toggle
  const toggleUnit = () => {
    setLoadings(true);
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  //dispatch
  const dispatch = useDispatch();
  //fetch data
  const fetchData = () => {
    dispatch(
      getCityData({
        city,
        unit,
      })
    ).then((res) => {
      console.log(res);
      if (!res.payload.error) {
        dispatch(
          get5DaysForcast({
            lat: res.payload.data.coord.lat,
            lon: res.payload.data.coord.lon,
            unit,
          })
        ).then((res) => {
          console.log(res);
        });
      }
    });
  };
  // for initial rendering
  useEffect(() => {
    fetchData();
  }, [unit]);
  // handling the city searching
  const handleCitySearch = (e) => {
    e.preventDefault();
    setLoadings(true);
    fetchData();
  };

  return (
    <div className="background">
      <div className="box">
        {/* imput for searching the city */}
        <form onSubmit={handleCitySearch}>
          <label>
            <Icon icon={search} size={20} />
          </label>
          <input
            type="text"
            className="city-input"
            placeholder="Enter City"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            readOnly={loadings}
          />
          <button type="submit">GO</button>
        </form>

        {/* current weather detail box */}
        <div className="current-weather-details-box">
          {/* header */}
          <div className="details-box-header">
            {/* heading */}
            <h4>Current Weather</h4>

            {/* switch */}
            <div className="switch" onClick={toggleUnit}>
              <div
                className={`switch-toggle ${unit === "metric" ? "c" : "f"}`}
              ></div>
              <span className="c">C</span>
              <span className="f">F</span>
            </div>
          </div>
        </div>
        {loadings ? (
          <div className="loader">
            <SphereSpinner loadings={loadings} color="red" size={20} />
          </div>
        ) : (
          <>
            {citySearchData && citySearchData.error ? (
              <div className="error-msg">{citySearchData.error}</div>
            ) : (
              <>
                {forecastError ? (
                  <div className="error-msg">{forecastError}</div>
                ) : (
                  <>
                    {citySearchData && citySearchData.data ? (
                      // Details
                      <div className="weather-details-container">
                        <div className="details">
                          <h4 className="city-name">
                            {citySearchData.data.name}
                          </h4>

                          <div className="icon-and-temp">
                            <img
                              src={`https://openweathermap.org/img/wn/${citySearchData.data.weather[0].icon}@2x.png`}
                              alt="icon"
                            />
                            <h1>{citySearchData.data.main.temp}&deg;</h1>
                          </div>

                          <h4 className="description">
                            {citySearchData.data.weather[0].description}
                          </h4>
                        </div>

                        {/* Metrics and other parameters */}
                        <div className="metrices">
                          {/* feels like */}
                          <h4>
                            Feels Like {citySearchData.data.main.feels_like}
                            &deg;C
                          </h4>
                          {/* min and max temp */}
                          <div className="key-value-box">
                            <div className="key">
                              <Icon
                                icon={arrowUp}
                                size={20}
                                className="icon"
                              />
                              <span className="value">
                                {citySearchData.data.main.temp_max}
                                &deg;C
                              </span>
                            </div>
                            <div className="key">
                              <Icon
                                icon={arrowDown}
                                size={20}
                                className="icon"
                              />
                              <span className="value">
                                {citySearchData.data.main.temp_min}
                                &deg;C
                              </span>
                            </div>
                          </div>
                          {/* humidity */}
                          <div className="key-value-box">
                            <div className="key">
                              <Icon icon={droplet} size={20} className="icon" />
                              <span>Humidity</span>
                            </div>
                            <div className="value">
                              <span>{citySearchData.data.main.humidity}%</span>
                            </div>
                          </div>

                          {/* wind */}
                          <div className="key-value-box">
                            <div className="key">
                              <Icon icon={wind} size={20} className="icon" />
                              <span>Wind</span>
                            </div>
                            <div className="value">
                              <span>{citySearchData.data.wind.speed}kph</span>
                            </div>
                          </div>
                          {/* Pressure */}
                          <div className="key-value-box">
                            <div className="key">
                              <Icon
                                icon={activity}
                                size={20}
                                className="icon"
                              />
                              <span>Pressure</span>
                            </div>
                            <div className="value">
                              <span>
                                {citySearchData.data.main.pressure}
                                hPa
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>
                    ) : (
                      <div className="error-msg"> DATA NOT FOUND</div>
                    )}
                    {/* Forecast of another days */}

                    <ExtendedForecast />

                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
