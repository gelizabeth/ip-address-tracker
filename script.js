import {
    ACCESS_TOKEN,
    API_KEY
} from './secret.js';

const accessToken = ACCESS_TOKEN;
const apiKey = API_KEY;

//geo.ipify.org API data fetch by ip
async function getData(data) {
    const fetchString = `https://geo.ipify.org/api/v1?apiKey=${apiKey}&${data.type === 'ip' ? `ipAddress=${data.payload}` : `domain=${data.payload}`}`
    updateDOM('loading');

    const response = await fetch(fetchString);
    if (response) {
        const locationData = await response.json();
        console.log(locationData);
        updateDOM('data', locationData);
    } else {
        isError(true);
        updateDOM('initial');
    }

}

//leafletJs map API display and update
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
const displayMap = () => {

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: accessToken
    }).addTo(mymap);
}
const updateMap = (coordinates) => {
    var marker = L.marker(coordinates).addTo(mymap);
    mymap.setView(coordinates, 13)
}

//on window load add event listeners to a button
window.onload = () => {
    const submitBtn = document.getElementById('submit');
    // submitBtn.addEventListener('click', handleClick);
    $('#submit').on('touchstart click', handleClick);

    const input = document.getElementById('input');
    input.addEventListener('keyup', handleKeyUp);
    updateDOM('initial');
    console.log('Window loaded');
}

//DOM update on changing states - initial state when page loaded, loading - loading rings when fetching data, data - when got data
const updateDOM = (state, data) => {

    const ipResult = document.getElementById('ip-result');
    const locationResult = document.getElementById('location-result');
    const timezoneResult = document.getElementById('timezone-result');
    const ispResult = document.getElementById('isp-result');

    switch (state) {
        case 'initial': {
            ipResult.innerHTML = 'Try find some ip...';
            locationResult.innerHTML = 'Location data';
            timezoneResult.innerHTML = 'Timezone data';
            ispResult.innerHTML = 'ISP data';
            displayMap();
            break;
        }
        case 'loading': {
            let loader = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;
            ipResult.innerHTML = loader;
            locationResult.innerHTML = loader;
            timezoneResult.innerHTML = loader;
            ispResult.innerHTML = loader;
            break;
        }
        case 'data': {
            input.value = '';
            const coordinates = [data.location.lat, data.location.lng]
            ipResult.innerHTML = data.ip;
            locationResult.innerHTML = `${data.location.city}, ${data.location.country}`;
            timezoneResult.innerHTML = `UTC${data.location.timezone}`;
            ispResult.innerHTML = data.isp;
            updateMap(coordinates);
            break;
        }
        default:
            console.log("UpdateDOM function didn't work well");
    }
}

//button click event
const handleClick = (e) => {
    e.preventDefault();
    validate(input.value);
}
const handleTouch = () => {
    console.log('touched');
    validate(input.value);
}

//input Enter key press event 
const handleKeyUp = (event) => {
    if (event.keyCode === 13) {
        console.log('enter clicked')
        document.getElementById('submit').click();
    }
}

//input validation
const validate = (value) => {
    const ipRegExp = RegExp(`^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$`);
    const domainRegExp = RegExp(`^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,6}$`);

    if (ipRegExp.test(value)) {
        isError(false);
        getData({
            type: 'ip',
            payload: value
        });
    } else if (domainRegExp.test(value)) {
        isError(false);
        getData({
            type: 'domain',
            payload: value
        });

    } else {
        isError(true);
    }
}

//show error string on bad validation
const isError = (value) => {
    const error = document.getElementById('error');
    if (value) {
        error.style.visibility = 'visible'
    } else {
        error.style.visibility = 'hidden';
        console.log('data is correct');
    };
}