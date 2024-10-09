import React from 'react'
import { useSelector } from 'react-redux';
import './extendedForecast.css';
function ExtendedForecast() {
    const {
        forecastData,
    } = useSelector((state) => state.weather);

    const forecastList = forecastData.list.filter((_, index) => index % 8 == 0).slice(0, 5);
    console.log(forecastList);

    return (
        <>
            <h4 className="extended-forecast-heading">
                Extented Forcast
            </h4>
            {forecastList.length > 0 ?
                (<div className='extended-forecasts-container'>
                    {forecastList.map((data, index) => {
                        const date = new Date(data.dt_txt);
                        console.log(date);
                        const day = date.toLocaleDateString('en-US',
                            {
                                weekday: 'short'
                            });
                        // console.log(day);
                        return (
                            <div className='forecast-box ' key={index}  >
                                <h5>{day}</h5>
                                <img
                                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                                    alt='pics' />
                                    <h4>{data.main.temp}</h4>
                                    <h5>{data.weather[0].description}</h5>
                            </div>
                        )
                    })}
                </div>
                ) : (
                    <div className="error-msg">No Data Found</div>
                )}
        </>
    )

}

export default ExtendedForecast
