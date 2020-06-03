`use strict`
let navToday = document.querySelector('.nav__today'),
navWeek = document.querySelector('.nav__week'),
upperContent = document.querySelector('.upper-content'),
weekTemplate = document.querySelector('.week-template'),
clock = document.querySelector('.head__date'),
search = document.querySelector('.head__search__text'),
midTemplate = document.querySelector('.mid-content__template'),
midContent = Array.from(midTemplate.content.children)[0],
midContainer = document.querySelector('.mid-content'),
upperTemplate = document.querySelector('.upper-content__template'),
upperTemplContent = Array.from(upperTemplate.content.children)[0],
curTempField = upperTemplContent.children[1].children[0],
realFeel = upperTemplContent.children[1].children[1],
weatherName = upperTemplContent.children[0].children[1],
sunrise = upperTemplContent.children[2].children[0],
sunset = upperTemplContent.children[2].children[1],
duration = upperTemplContent.children[2].children[2],
mainPhoto = upperTemplContent.children[0].children[0],
secPageContent = document.querySelector('.second-page-content'),
weekChild = Array.from(weekTemplate.content.children);
weekForecast = Array.from(Array.from(weekTemplate.content.children)[0].children);

function pageSwitcher(page) {
    if (page === 1) {
        secPageContent.removeChild(document.querySelector('.week-forecast'));
        upperContent.style.display = 'block';
        for(let a=0; a<weekForecast.length; a++) {
            weekForecast[a].classList.remove('new-color');
        }
    } else {
            secPageContent.appendChild(weekChild[0]);
            upperContent.style.display = 'none';
    }
}
navToday.addEventListener('click', function () {
    pageSwitcher(1);
    curWeather.midContentData();
    Array.from(midContent.children)[0].children[0].textContent = 'today';
})
navWeek.addEventListener('click', function () {
    pageSwitcher(0);
})
    class Weather {
        constructor() {
            this.week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            this.year = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];this.getCity();
            this.getCurCoords();
            this.pageClock();
            this.hourlyWeatherChange();
        }
        getCity () {
            search.addEventListener('keydown', function (event) {
                if(event.keyCode===13) {
                    curWeather.cityRequest(this.value);
                }
            })
        }
        timeConverter(UNIX_timestamp){
            let a = new Date(UNIX_timestamp * 1000);
            let hour = a.getHours();
            let min = "0" + a.getMinutes();
            let sec = "0" + a.getSeconds();
            let time = hour + ':' + min.substr(-2) + ':' + sec.substr(-2);
            return time;
          }
        getCurCoords() {
            navigator.geolocation.getCurrentPosition((position) => {
                let coords = [position.coords.latitude, position.coords.longitude];
                this.request(coords);
            });
        }
        async request(coords) {
            let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords[0]}&lon=${coords[1]}&units={metric}&appid=525fc01a5e5733b7b550f58ae0ea169f`;
            let response = await fetch(url);
            let json = await response.json();
            this.json = json;
            let url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords[0]}&lon=${coords[1]}&units={metric}&appid=525fc01a5e5733b7b550f58ae0ea169f`;
            let response2 = await fetch(url2);
            let json2 = await response2.json();
            this.hourly = json2;
            this.getCurWeather();
        }
      async cityRequest(city) {
            let url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=4a2f498e77044dddb2a093cee1585397`
            let response = await fetch(url);
            let json = await response.json();
            this.city = json;
            let coords = [this.city.results[0].geometry.lat,this.city.results[0].geometry.lng]
            console.log(curWeather);
            this.request(coords);
      }
      midContentData () {
        for(let i=0; i<6; i++) {
            let columns = Array.from(midContent.children); 
            let curColumn = Array.from(columns[i+1].children);
            let a = new Date(curWeather.json.hourly[i].dt * 1000);
            let hour = a.getHours() + '.00';
            curColumn[0].innerText = hour;
            let photoCode = this.json.hourly[i].weather[0].icon;
            curColumn[1].setAttribute('src', 'http://openweathermap.org/img/w/' + photoCode + '.png');
            curColumn[2].innerText = curWeather.json.hourly[i].weather[0].main;
            curColumn[3].innerText = Math.round(curWeather.json.hourly[i].temp-273.15) + '°C';
            curColumn[4].innerText = Math.round(curWeather.json.hourly[i].feels_like-273.15) + '°C';
            curColumn[5].innerText = Math.round(curWeather.json.hourly[i].wind_speed);
        }
      }
        getCurWeather() {
            let weatherTemp = [Math.round(this.json.current.temp - 273.15), Math.round(this.json.current.feels_like - 273.15), this.json.current.weather[0].main];
            let formatTime = [this.timeConverter(this.json.current.sunset), this.timeConverter(this.json.current.sunrise), this.timeConverter(this.json.current.sunset-this.json.current.sunrise)];
            this.curWeatherPlace(formatTime, weatherTemp);
            this.hourlyWeatherPlace();
        }
        curWeatherPlace(formatTime, weatherTemp) {
            curTempField.innerText = weatherTemp[0] + '°C';
            realFeel.innerText = 'Real feel: ' + weatherTemp[1] + '°C';
            weatherName.innerText = weatherTemp[2];
            let photoCode = this.json.current.weather[0].icon;
            mainPhoto.setAttribute('src', 'http://openweathermap.org/img/w/' + photoCode + '.png');
            sunrise.innerText = 'Sunrise: ' + formatTime[0];
            sunset.innerText = 'Sunset: ' + formatTime[1];
            duration.innerText = 'Duration: ' + formatTime[2];
            console.log(this);
            let curLocation = this.json.timezone;
            search.setAttribute('placeholder', `${curLocation}`);
        }
        hourlyWeatherPlace () {
            this.midContentData();
            midContainer.appendChild(midTemplate.content)
            upperContent.appendChild(upperTemplate.content)
            this.dailyWeatherPlace();
        }
        dailyWeatherPlace () {
            for(let i=0; i<5; i++) {
                let columns = weekForecast; 
                let curColumn = Array.from(columns[i].children);
                let photoCode = this.json.daily[i].weather[0].icon;
                let a = new Date(this.json.daily[i].dt * 1000);
                curColumn[0].textContent=this.week[a.getDay()];
                curColumn[1].textContent=this.year[a.getMonth()] + ' ' + a.getDate();
                curColumn[2].setAttribute('src', 'http://openweathermap.org/img/w/' + photoCode + '.png');
                curColumn[3].textContent = Math.round(this.json.daily[i].temp.day -273.15) + '°C';
                curColumn[4].textContent = this.json.daily[i].weather[0].main;
            }
        }
        pageClock() {
            let today = new Date();
                let date = Date().split(' ');
                clock.innerText = date[2] + '.' + (1+today.getMonth()) + '.' + date[3];
        }
        hourlyWeatherChange () {
            function dayClick (i) {
                let curHour = i*8;
                for(let b=0; b<6; b++) {
                    let columns = Array.from(midContent.children); 
                    columns[0].children[0].textContent = weekForecast[i].children[0].textContent;
                    let curColumn = Array.from(columns[b+1].children);
                    let a = new Date(curWeather.hourly.list[curHour].dt * 1000);
                    let hour = a.getHours() + '.00';
                    curColumn[0].innerText = hour;
                    let photoCode = curWeather.hourly.list[curHour].weather[0].icon;
                    curColumn[1].setAttribute('src', 'http://openweathermap.org/img/w/' + photoCode + '.png');
                    curColumn[2].innerText = curWeather.hourly.list[curHour].weather[0].main;
                    curColumn[3].innerText = Math.round(curWeather.hourly.list[curHour].main.temp-273.15) + '°C';
                    curColumn[4].innerText = Math.round(curWeather.hourly.list[curHour].main.feels_like-273.15) + '°C';
                    curColumn[5].innerText = Math.round(curWeather.hourly.list[curHour].wind.speed);
                    curHour++;
                }
            }
            for (let i=0;i<5;i++) {
                weekForecast[i].addEventListener('click', function () {
                    dayClick(i);
                    for(let a=0; a<weekForecast.length; a++) {
                        weekForecast[a].classList.remove('new-color');
                    }
                    weekForecast[i].classList.add('new-color');
                })
            }
        }
    }
    let curWeather = new Weather;