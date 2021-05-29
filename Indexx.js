const body = document.querySelector('body'),

    lang = document.getElementById('lang'),
    city = document.getElementById('city'),
    country = document.getElementById('country'),
    time = document.getElementById('time'),
    date = document.getElementById('date'),

    tempF = document.getElementById('temp-f'),
    tempC = document.getElementById('temp-c'),
    humidityText = document.querySelector('.humidity-text'),
    summaryText = document.querySelector('.summary'),
    apparentText = document.querySelector('.apparent-text'),
    windText = document.querySelector('.wind-text'),
    windUnitsText = document.querySelector('.wind-units'),
    latitudeText = document.querySelector('.latitude-text'),
    longitudeText = document.querySelector('.longitude-text'),

    searchBtn = document.getElementById("search"),
    reloadBtn = document.getElementById("reload"),

    searchInput = document.querySelector('.search-input'),
    weatherIcon = document.getElementById('weather-icon-main'),
    apparentValue = document.querySelector('.apparent-value'),
    windValue = document.querySelector('.wind-value '),
    humidityValue = document.querySelector('.humidity-value'),
    temperature = document.querySelector('.current-temperature'),
    longitudeValue = document.querySelector('.longitude-value'),
    latitudeValue = document.querySelector('.latitude-value'),


    day1Num = document.getElementById('num-day-one'),
    day1Temp = document.getElementById('temp-day-one'),
    day1Ico = document.getElementById('ico-day-one'),

    day2Num = document.getElementById('num-day-two'),
    day2Temp = document.getElementById('temp-day-two'),
    day2Ico = document.getElementById('ico-day-two'),

    day3Num = document.getElementById('num-day-three'),
    day3Temp = document.getElementById('temp-day-three'),
    day3Ico = document.getElementById('ico-day-three'),
    voiceBtn = document.querySelector('.voice'),

    arr_week_en = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    arr_month_en = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    arr_week_ru = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    arr_month_ru = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"],
    arr_week_en_full = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    arr_week_ru_full = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

let arr_week;
let arr_month;
let temperatureCond;
let arr_week_full;
let numDayVar;
let Hour;

let voice = null;
let voiceFlag = false;


numDay();
getCity().then(r => getWeatherAndMap());
currLang();
showTime();
getTemperatureCond();
startSelect();
reloadBackImg();


voiceBtn.addEventListener('click', () => {
    if (voice == null) {
        voice = voiceObCreate();
        voiceSetLang();
        voiceFunc();
    }

    if (voiceFlag) {
        document.querySelector('.voice').style.backgroundImage = `url(./css/img/mic.svg)`;
        voice.stop();

    } else {
        console.log("on");
        document.querySelector('.voice').style.backgroundImage = `url(./css/img/mic_on.png)`;
        voice.start();

    }

    voiceFlag = !voiceFlag;
});

tempF.addEventListener('click', () => {
    tempF.classList.add("temp-btn-active");
    tempC.classList.remove("temp-btn-active");
    localStorage.setItem("temp", "0");
    makeAllFarenheit();
});

tempC.addEventListener('click', () => {
    tempC.classList.add("temp-btn-active");
    tempF.classList.remove("temp-btn-active");
    makeAllCelsium();
    localStorage.setItem("temp", "1");

});

reloadBtn.addEventListener('click', () => {
    document.getElementById("preload").style.display = "true";
    getLinkToImage();
    document.getElementById("preload").style.display = "none";

});

searchBtn.addEventListener('click', () => {

    getWeatherAndMap().then(r => getCity());
    searchInput.value = "";

});

searchInput.addEventListener('keypress', keyInputEnter);

lang.addEventListener("change", () => {
    langChange();

});


function keyInputEnter(e) {
    if (e.type === 'keypress') {
        if (e.keyCode === 13) {
            getWeatherAndMap().then(r => getCity());
            searchInput.value = "";
        }
    }
}


function startSelect() {
    if (localStorage.getItem("lang") === "ru") {
        lang.options[1].selected = true;
    }
}

function numDay() {
    let today = new Date(),
        dayWeek = today.getDay();

    numDayVar = dayWeek;

}

function getTemperatureCond() {
    if (localStorage.getItem("temp") == null) {
        localStorage.setItem("temp", "1");
        temperatureCond = true;
        tempC.classList.add("temp-btn-active");
    } else {
        temperatureCond = Boolean(Number(localStorage.getItem("temp")));
        if (temperatureCond) {
            tempC.classList.add("temp-btn-active");
        } else {
            tempF.classList.add("temp-btn-active");
        }

    }
}

function getCorrectTemperature(temperature) {
    if (temperatureCond) {
        return parseInt(temperature, 10);
    } else {
        return parseInt((parseInt(temperature, 10) * 1.8) + 32);
    }
}

function makeAllFarenheit() {

    if (temperatureCond) {
        makeFarenheit(temperature);
        makeFarenheit(apparentValue);
        makeFarenheit(day1Temp);
        makeFarenheit(day2Temp);
        makeFarenheit(day3Temp);
        temperatureCond = !temperatureCond;
    }

}

function makeAllCelsium() {
    if (!temperatureCond) {
        makeCelsium(temperature);
        makeCelsium(apparentValue);
        makeCelsium(day1Temp);
        makeCelsium(day2Temp);
        makeCelsium(day3Temp);
        temperatureCond = !temperatureCond;
    }

}

function makeFarenheit(temperature) {
    //console.log(parseInt(temperature.textContent, 10)* 1.8 + 32);
    temperature.textContent = parseInt(parseInt(temperature.textContent, 10) * 1.8 + 32);

}

function makeCelsium(temperature) {
    //console.log(temperature.textContent);
    temperature.textContent = parseInt((parseInt(temperature.textContent, 10) - 32.0) / 1.8);
}

function langChange() {
    localStorage.setItem('lang', lang.value);
    currLang();
    getWeatherAndMap();
}

function engLang() {
    humidityText.textContent = 'humidity: ';
    apparentText.textContent = 'feels like: ';
    windText.textContent = 'wind: ';
    windUnitsText.textContent = 'm/s ';
    searchBtn.textContent = 'search';
    searchInput.placeholder = 'Сity name';
    longitudeText.textContent = 'longitude :';
    latitudeText.textContent = 'latitude :';
    numberDayInTextField(numDayVar + 1, day1Num);
    numberDayInTextField(numDayVar + 2, day2Num);
    numberDayInTextField(numDayVar + 3, day3Num);

}

function ruLang() {
    humidityText.textContent = 'влажность: ';
    apparentText.textContent = 'чувствуется: ';
    windText.textContent = 'ветер: ';
    windUnitsText.textContent = 'м/с ';
    searchBtn.textContent = 'поиск';
    searchInput.placeholder = 'Название города';
    longitudeText.textContent = 'долгота :';
    latitudeText.textContent = 'широта :';
    numberDayInTextField(numDayVar + 1, day1Num);
    numberDayInTextField(numDayVar + 2, day2Num);
    numberDayInTextField(numDayVar + 3, day3Num);
}

function currLang() {
    if (localStorage.getItem('lang') == null) {
        localStorage.setItem('lang', 'ru');
    }

    switch (localStorage.getItem('lang')) {
        case 'en': {
            arr_week_full = arr_week_en_full;
            engLang();
            arr_week = arr_week_en;
            arr_month = arr_month_en;


            break;
        }
        case 'ru': {
            arr_week_full = arr_week_ru_full;
            ruLang();
            arr_week = arr_week_ru;
            arr_month = arr_month_ru;


            break;
        }
        default: {
            engLang();
        }
    }

    voiceChangeLang();

}

async function getCity() {

    if (localStorage.getItem('city') === null || localStorage.getItem('country') === null) {
        await getGeolocation();
    } else {
        city.textContent = localStorage.getItem('city');
        country.textContent = localStorage.getItem('country');
    }

}


function showTime() {
    let today = new Date(),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds(),
        dayWeek = today.getDay(),
        day = today.getDate(),
        month = today.getMonth();

    Hour = hour;



    time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
    date.innerHTML = `${arr_week[dayWeek]}<span>, </span>${day} ${arr_month[month]}`;
    setTimeout(showTime, 1000);
}

function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}


async function getLinkToImage() {
    let url;
    if (Hour > 0 && Hour < 6)
        url = 'https://api.unsplash.com/photos/random?query=night&orientation=landscape&client_id=wJQ8LjVThYrSF8a9uPXYnEE68op_IBc5MuY5cRZci7w';
    else
        if (Hour >= 6 && Hour < 12)
            url = 'https://api.unsplash.com/photos/random?query=morning&orientation=landscape&client_id=wJQ8LjVThYrSF8a9uPXYnEE68op_IBc5MuY5cRZci7w';
        else
            if (Hour >= 12 && Hour < 18)
                url = 'https://api.unsplash.com/photos/random?query=nature&orientation=landscape&client_id=wJQ8LjVThYrSF8a9uPXYnEE68op_IBc5MuY5cRZci7w';
            else
                url = 'https://api.unsplash.com/photos/random?query=evening&orientation=landscape&client_id=wJQ8LjVThYrSF8a9uPXYnEE68op_IBc5MuY5cRZci7w';


    const res = await fetch(url);
    if (!res.ok) {
        body.style.backgroundImage = `url(css/img/default.jfif)`;
        console.log("Error background");
        return;
    }
    else {

        const data = await res.json();
        //console.log(data);
        //console.log(data.urls.regular);
        body.style.backgroundImage = `url(${data.urls.regular})`;
    }
}

async function getGeolocation() {
    const url = 'https://ipinfo.io/json?token=9f4339bb6b6de0';

    const res = await fetch(url);
    if (!res.ok) {
        console.log("error ip");
    } else {

        console.log('set city');
        const data = await res.json();
        //console.log(data);
        city.textContent = data.city;
        country.textContent = data.country;


        localStorage.setItem('city', city.textContent);
        localStorage.setItem('country', country.textContent);

    }

}


async function getWeatherAndMap() {

    //console.log("getwather");
    //console.log(localStorage.getItem("city"));
    let currCity = searchInput.value !== "" ? searchInput.value : localStorage.getItem("city");


    let url = `https://api.openweathermap.org/data/2.5/weather?q=${currCity}&lang=${localStorage.getItem("lang")}&appid=32668db5559e877281a139dd47d93fee&units=metric`;

    const res = await fetch(url);
    if (!res.ok) {
        return;
    }

    const data = await res.json();


    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);

    summaryText.textContent = data.weather[0].description;
    temperature.textContent = getCorrectTemperature(data.main.temp).toString();
    apparentValue.textContent = getCorrectTemperature(data.main.feels_like).toString();
    windValue.textContent = data.wind.speed;
    humidityValue.textContent = data.main.humidity;

    city.textContent = data.name;


    console.log(data);
    //latitudeValue.textContent = data.coord.lat;
    localStorage.setItem("lat", data.coord.lat);
    latitudeValue.textContent = deg_to_dms(data.coord.lat);

    //longitudeValue.textContent = data.coord.lon;

    localStorage.setItem("lon", data.coord.lon);
    longitudeValue.textContent = deg_to_dms(data.coord.lon);

    await getMap();
    localStorage.setItem("city", currCity);
    localStorage.setItem("country", data.sys.country);


    await getWeather3days();
}

function deg_to_dms (deg) {
    var d = Math.floor (deg);
    var minfloat = (deg-d)*60;
    var m = Math.floor(minfloat);
    var secfloat = (minfloat-m)*60;
    var s = Math.round(secfloat);
    // After rounding, the seconds might become 60. These two
    // if-tests are not necessary if no rounding is done.
    if (s==60) {
        m++;
        s=0;
    }
    if (m==60) {
        d++;
        m=0;
    }
    return ("" + d + "°" + m + "'" + s + "''");
}

async function reloadBackImg() {

    await getLinkToImage();
    document.getElementById("preload").style.display = "none";
    setInterval(getLinkToImage, 1000 * 60 * 60);
}


async function getMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2x5ZGVlIiwiYSI6ImNrcGE1dHNlYzBwaG4ybm1wOXZuNHdsazIifQ.4avaaiMbhaRAemNjIFmuHg';

    let x = parseFloat(localStorage.getItem("lon"));
    let y = parseFloat(localStorage.getItem("lat"));
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [x, y],
        zoom: 10
    });
    new mapboxgl.Marker().setLngLat([x, y]).addTo(map);
}

async function getWeather3days() {

    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${localStorage.getItem("city")}&lang=en&units=metric&APPID=32668db5559e877281a139dd47d93fee`;

    const res = await fetch(url);
    if (!res.ok) {
        return;
    }

    const data = await res.json();

    weather1day(data, 7, day1Ico, day1Temp);
    numberDayInTextField(numDayVar + 1, day1Num);

    weather1day(data, 14, day2Ico, day2Temp);
    numberDayInTextField(numDayVar + 2, day2Num);

    weather1day(data, 21, day3Ico, day3Temp);
    numberDayInTextField(numDayVar + 3, day3Num);

}

function weather1day(data, index, iconField, tempField) {

    iconField.className = 'weather-icon-mini owf';
    iconField.classList.add(`owf-${data.list[index].weather[0].id}`);
    tempField.textContent = getCorrectTemperature(data.list[index].main.temp);
}

function numberDayInTextField(numberDay, textField) {
    while (numberDay > 6) {
        numberDay -= 7;
    }
    textField.textContent = arr_week_full[numberDay];

}

function voiceIsSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition);
}

function voiceObCreate() {
    if (voiceIsSupported()) {
        return new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    }
}


function voiceChangeLang() {
    if (voice != null) {
        voice.stop();
        voiceFlag=false;
        voiceSetLang();
    }
}

function voiceFunc(){
    voice.interimResults = true;
    voice.onresult = function(event){
        var result = event.results[event.resultIndex];
        if (result.isFinal) {
            getWeatherAndMap().then(r => getCity());
            voice.stop();
            voiceFlag=false;
            searchInput.value="";
            document.querySelector('.voice').style.backgroundImage = `url(./css/img/mic.svg)`;
        } else {
            searchInput.value=result[0].transcript;
        }
    };

}

function voiceSetLang(){
    if (voice != null) {
        if (localStorage.getItem("lang") === "ru") {
            voice.lang = "ru-RU";
        } else {
            voice.lang = "en-EN";
        }
    }
}