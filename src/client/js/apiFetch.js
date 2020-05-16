window.onload = async () => {
    document.getElementById("submit").addEventListener("click", processUserRequest);
}
export const processUserRequest = async (e) => {
    try {
        e.preventDefault();
        let depCity = document.getElementById("departure").value;
        let destCity = document.getElementById("destination").value;
        let depDate = document.getElementById("depDate").value;
        let geoNameURL = "http://api.geonames.org/searchJSON?q=";
        let currentTimeElapse = (Date.now()) / 1000;
        const timeElapse = (new Date(depDate).getTime()) / 1000;
        const daysLeft = Math.round((timeElapse - currentTimeElapse) / 86400);
        let weatherBitAPI = "https://api.weatherbit.io/v2.0/forecast/daily?";
        let pixabayAPIURL = "https://pixabay.com/api/?key=";
        const credentials = await getCredentialData();
        const userInput = checkCityInput(depCity, destCity);
        const getCityData = await getLatLongUsingGeoName(geoNameURL, destCity, credentials.geoUser);
        const weatherForecast = await getWeatherForecast(weatherBitAPI, destCity, getCityData.geonames[0].countryCode, credentials.weatherKey);
        const getDestinationPhoto = await getPixabayPhoto(pixabayAPIURL, credentials.pixabayKey, destCity);
        const weatherForSelectedDate = weatherForecast.data.find((weatherObject) => {
            return weatherObject.valid_date === depDate;
        })
        const successPost = await postData("http://localhost:5000/add", {
            depCity,
            destCity,
            depDate,
            daysLeft,
            weather: weatherForSelectedDate.temp,
            climateForecast: weatherForSelectedDate.weather.description,
            photos: getDestinationPhoto.hits[0].largeImageURL
        });
        const getDataFromServer = await getAllData();
        updateUI(getDataFromServer);
    }
    catch (err) {
        console.log("err", err);
    }
}



let getCredentialData = async () => {
    const response = await fetch("http://localhost:5000/getCredentials");
    const credentialData = response.json();
    console.log(credentialData);
    return credentialData;
}
const postData = async (url, data = {}) => {
    const res = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    return res;
}
export let checkCityInput = (depCity, destCity) => {
    let regEx = /^[a-zA-Z\s]{0,100}$/;
    if (regEx.test(depCity) && regEx.test(destCity)) {
        return
    } else {
        alert("please enter a valid city");
    }
}
let getLatLongUsingGeoName = async (geoNameURL, destCity, geoUserName) => {
    let response = await fetch(geoNameURL + destCity + "&maxRows=10&" + "username=" + geoUserName);
    const cityData = await response.json();
    console.log(cityData);
    return cityData;

};
let getWeatherForecast = async (weatherBitAPI, destCity, country, weatherAPIKey) => {
    let forecastAPIFetch = await fetch(weatherBitAPI + "city=" + destCity + "," + country + "&key=" + weatherAPIKey);
    const forecastedWeather = await forecastAPIFetch.json();
    console.log(forecastedWeather);
    return forecastedWeather;
};
let getPixabayPhoto = async (pixabayAPIURL, pixabayAPIKey, destCity) => {
    let destinationPhoto = await fetch(pixabayAPIURL + pixabayAPIKey + "&q=" + destCity + "+city&image_type=photo");
    const fetchedPhoto = await destinationPhoto.json();
    return fetchedPhoto;
};


const getAllData = async () => {
    const response = await fetch("http://localhost:5000/allData");
    const projectData = response.json();
    console.log(projectData);
    return projectData;
}
const updateUI = async (fetchedData) => {
    resultContainer.classList.remove("invisible");

    // const dep_Date = fetchedData.depDate.split("-").reverse().join(" / ");
    document.getElementById("city").innerHTML = fetchedData.destCity;
    document.getElementById("date").innerHTML = fetchedData.depDate;
    document.getElementById("days").innerHTML = fetchedData.daysLeft;
    document.getElementById("weatherCondition").innerHTML = fetchedData.climateForecast;
    document.getElementById("temp").innerHTML = fetchedData.weather + "°C";
    document.getElementById("fromPixabay").setAttribute('src', fetchedData.photos);
}
document.getElementById("save").addEventListener('click', function (e) {
    window.print();
});
document.getElementById("delete").addEventListener('click', function (e) {
    document.getElementById('resultContainer').classList.add("invisible");
});

