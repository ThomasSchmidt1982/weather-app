import conf from "../conf.json" with {type: "json"};
const WMO = {
    "0": "Clear sky",
    "1": "Mainly clear",
    "2": "Partly cloudy",
    "3": "Overcast",
    "45": "Fog",
    "48": "Depositing rime fog",
    "51": "Drizzle: Light intensity",
    "53": "Drizzle: Moderate intensity",
    "55": "Drizzle: Dense intensity",
    "56": "Freezing Drizzle: Light intensity",
    "57": "Freezing Drizzle: Dense intensity",
    "61": "Rain: Slight intensity",
    "63": "Rain: Moderate intensity",
    "65": "Rain: Heavy intensity",
    "66": "Freezing Rain: Light intensity",
    "67": "Freezing Rain: Heavy intensity",
    "71": "Snow fall: Slight intensity",
    "73": "Snow fall: Moderate intensity",
    "75": "Snow fall: Heavy intensity",
    "77": "Snow grains",
    "80": "Rain showers: Slight",
    "81": "Rain showers: Moderate",
    "82": "Rain showers: Violent",
    "85": "Snow showers: Slight",
    "86": "Snow showers: Heavy",
    "95": "Thunderstorm: Slight or moderate",
    "96": "Thunderstorm with slight hail",
    "99": "Thunderstorm with heavy hail"
}

async function getweather(){

    try {

        const ville = conf.ville;
        const url_city = "https://geocoding-api.open-meteo.com/v1/search?name="+ville+"&count=1&language=fr&format=json";
        const response_city = await fetch(url_city);
        const data_city = await response_city.json();
        const city = data_city.results[0];
        const city_lat = city.latitude;
        const city_long = city.longitude;

        const url = "https://api.open-meteo.com/v1/forecast?latitude="+city_lat+"&longitude="+city_long+"&models=best_match&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code";

        const response = await fetch(url);
        const data = await response.json();

        const temp_unit = data.current_units.temperature_2m;
        const humi_unit = data.current_units.relative_humidity_2m;
        const app_temp_unit = data.current_units.apparent_temperature;

        const weather_code = data.current.weather_code;
        const temperature = data.current.temperature_2m;
        const app_temp = data.current.apparent_temperature;
        const humidity = data.current.relative_humidity_2m;

        console.log("Weather code :", WMO[weather_code], "(", weather_code, ")" );
        console.log("Temperature :", temperature + temp_unit );
        console.log("Ville : " +city.name);
        console.log("lat : " +city_lat + " | long : " +city_long + "")
        console.log("Apparent Temperature :", + app_temp + app_temp_unit );
        console.log("Humidity : ", + humidity + humi_unit );

        document.getElementById("weather_code").textContent = WMO[weather_code];
        document.getElementById("city").textContent = city.name;
        document.getElementById("temperature").textContent = temperature + temp_unit;
        document.getElementById("humidity").textContent = humidity + humi_unit;
        document.getElementById("apparent_temperature").textContent = app_temp + app_temp_unit;

    }catch (error) {
        console.log(error);
    }
}

window.addEventListener("DOMContentLoaded", () =>
    getweather()

)


