import conf from "../conf.json" with { type: "json"};

async function getweather() {
    try {
        // chargement des codes wmo
        const resp_wmo = await fetch("../wmo.json");
        const wmo_array = await resp_wmo.json();
        // chargement de la ville + lat / long
        const ville = conf.ville;
        const url_city = "https://geocoding-api.open-meteo.com/v1/search?name=" + ville + "&count=1&language=fr&format=json";
        const response_city = await fetch(url_city);
        const data_city = await response_city.json();
        console.log(data_city);
        const city = data_city.results[0];
        const city_lat = city.latitude;
        const city_long = city.longitude;
        // chargement des données météo
        const url = "https://api.open-meteo.com/v1/forecast?latitude=" + city_lat + "&longitude=" + city_long + "&models=best_match&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code";
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        const temp_unit = data.current_units.temperature_2m;
        const humi_unit = data.current_units.relative_humidity_2m;
        const app_temp_unit = data.current_units.apparent_temperature;

        const weather_code = data.current.weather_code;
        const temperature = data.current.temperature_2m;
        const app_temp = data.current.apparent_temperature;
        const humidity = data.current.relative_humidity_2m;
        const is_day = data.current.is_day;

        /* vérif des valeurs */
        console.log("Weather code :", wmo_array[weather_code], "(", weather_code, ")");
        console.log("Temperature :", temperature + temp_unit);
        console.log("Ville : " + city.name);
        console.log("lat : " + city_lat + " | long : " + city_long + "")
        console.log("Apparent Temperature :", +app_temp + app_temp_unit);
        console.log("Humidity : ", +humidity + humi_unit);
        console.log("Is day : ", is_day ? "day" : "night");
        console.log("weather code : ", weather_code);

        document.getElementById("weather_code").textContent = wmo_array[weather_code];
        document.getElementById("city").textContent = city.name;
        document.getElementById("temperature").textContent = temperature + temp_unit;
        document.getElementById("humidity").textContent = humidity + humi_unit;
        document.getElementById("apparent_temperature").textContent = app_temp + app_temp_unit;

        if (!is_day) {
            document.documentElement.style.setProperty("--bg-color", "rgb(0,0,0)");
            document.getElementById("wmo-loading").style.display = "none";
            document.getElementById("loading-message").style.display = "none";
            document.getElementById("wmo-night").style.display = "inline";

        } else {
            document.documentElement.style.setProperty("--bg-color", "#4b65ef");
            document.getElementById("wmo-loading").style.display = "none";
            document.getElementById("loading-message").style.display = "none";
            switch (weather_code) {
                case 0:
                case 1:
                    document.getElementById("wmo-0-1").style.display = "inline";
                    break;
                case 2:
                    document.getElementById("wmo-2").style.display = "inline";
                    break;
                case 3:
                    document.getElementById("wmo-3").style.display = "inline";
                    break;
                case 45:
                case 48:
                    document.getElementById("wmo-45-48").style.display = "inline";
                    break;
                case 51:
                case 53:
                case 55:
                case 56:
                case 57:
                case 61:
                case 63:
                case 65:
                    document.getElementById("wmo-51to67").style.display = "inline";
                    break;
                case 71:
                case 73:
                case 75:
                case 77:
                    document.getElementById("wmo-71to77").style.display = "inline";
                    break;
                case 80:
                case 81:
                case 82:
                    document.getElementById("wmo-80to82").style.display = "inline";
                    break;
                case 85:
                case 86:
                    document.getElementById("wmo-85-86").style.display = "inline";
                    break;
                case 95:
                case 96:
                case 99:
                    document.getElementById("wmo-95to99").style.display = "inline";
                    break;
                default:
                    document.getElementById("wmo-error").style.display = "inline";
            }
        }
    } catch (error) {
        console.log(error);
        document.getElementById("wmo-loading").style.display = "none";
        document.getElementById("loading-message").style.display = "none";
        document.getElementById("wmo-error").style.display = "inline";
        document.getElementById("error-message").style.display = "inline";
        document.getElementById("error-message").textContent = error;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    getweather();
    setInterval(getweather, 1000 * 60 * 60); //refresh toutes les heures
});


