import {ACCESS_TOKEN, API_KEY} from './secret.js';

const accessToken = ACCESS_TOKEN;
const apiKey = API_KEY;

//geo.ipify.org API data fetch by ip
async function getData(ip){
    updateDOM('loading');
 const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${ip}`);
 const locationData = await response.json();
 console.log(locationData);
 updateDOM('data', locationData);
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
const  updateMap = (coordinates ) => { var marker = L.marker(coordinates).addTo(mymap); mymap.setView(coordinates, 13) }

//on window load add event listeners to a button
window.onload = () =>{
    const submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', handleClick);  

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

    switch(state){
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
        default: console.log("UpdateDOM function didn't work well");
    }
}

//button click event
const handleClick = () => {
 
    if(validate(input.value)){
        isError(false);
        getData(input.value);
    } else {
        
        isError(true);   
}}

//input Enter key press event 
const handleKeyUp = (event) => {
    if (event.keyCode === 13) { 
        // event.preventDefault();
        console.log('enter clicked')
        document.getElementById('submit').click();
    } 
}

//input validation
const validate = (value) => {
    const ipRGEX = new RegExp(`^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$`);
    return ipRGEX.test(value);
}

//show error string on bad validation
const isError = (value) => {
    const error = document.getElementById('error');
if(value){
    error.style.visibility = 'visible'
} else {
    error.style.visibility = 'hidden';
    console.log('data is correct');
};   
}

