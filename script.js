`use strict`
let navToday = document.querySelector('.nav__today'),
navWeek = document.querySelector('.nav__week'),
upperContent = document.querySelector('.upper-content'),
weekForecast = document.querySelector('.week-forecast'),
realFeel = document.querySelector('.upper-content__feel'),
curTempField = document.querySelector('.upper-content__degree'),
weatherName = document.querySelector('.upper-content__name'),
mainPhoto = document.querySelector('.upper-content__photo'),
sunrise = document.querySelector('.upper-content__sunrise'),
sunset = document.querySelector('.upper-content__sunset'),
duration = document.querySelector('.upper-content__duration'),
clock = document.querySelector('.head__date'),
search = document.querySelector('.head__search__text');

function pageSwitcher(page) {
    if (page === 1) {
        weekForecast.style.display = 'none';
        upperContent.style.display = 'block';
    } else {
        weekForecast.style.display = 'flex';
        upperContent.style.display = 'none';
    }
}


navToday.addEventListener('click', function () {
    pageSwitcher(1);
})
navWeek.addEventListener('click', function () {
    pageSwitcher(0);
})

    class Weather {
        constructor() {}
        timeConverter(UNIX_timestamp){
            let a = new Date(UNIX_timestamp * 1000);
            let year = a.getFullYear();
            let month = a.getMonth();
            let date = a.getDate();
            let hour = a.getHours();
            let min = "0" + a.getMinutes();
            let sec = "0" + a.getSeconds();
            let time = hour + ':' + min.substr(-2) + ':' + sec.substr(-2);
            return time;
          }
        getCurCoords() {
            navigator.geolocation.getCurrentPosition((position) => {
                this.coords = [position.coords.latitude, position.coords.longitude];
                console.log(this.coords);
                this.request();
            });
        }
        async request() {
            let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${this.coords[0]}&lon=${this.coords[1]}&units={metric}&appid=525fc01a5e5733b7b550f58ae0ea169f`;
            let response = await fetch(url);
            let json = await response.json();
            this.json = json;
            console.log(this.json)
            this.getCurWeather();
        }

        getCurWeather() {
            let hourDate = new Date(this.json.hourly[1].dt * 1000);
            let hourHours = hourDate.getHours();
            let hourMinutes = "0" + hourDate.getMinutes();
            let hourSeconds = "0" + hourDate.getSeconds();
            this.hourFormattedTime = hourHours + ':' + hourMinutes.substr(-2) + ':' + hourSeconds.substr(-2);
            console.log(this.hourFormattedTime)
            this.curWeatherPlace();


            this.currentTemp = Math.round(this.json.current.temp - 273.15);
            this.feelsLike = Math.round(this.json.current.feels_like - 273.15);
            this.weatherName = this.json.current.weather[0].main;
            this.setFormattedTime = this.timeConverter(this.json.current.sunset)
            this.riseFormattedTime = this.timeConverter(this.json.current.sunrise);
            this.curWeatherPlace();
            this.hourlyWeatherPlace();
        }
        curWeatherPlace() {
            curTempField.innerText = this.currentTemp + '°C';
            realFeel.innerText = 'Real feel: ' + this.feelsLike + '°C';
            weatherName.innerText = this.weatherName;
            let photoCode = this.json.current.weather[0].icon;
            mainPhoto.setAttribute('src', 'http://openweathermap.org/img/w/' + photoCode + '.png');
            sunrise.innerText = 'Sunrise: ' + this.riseFormattedTime;
            sunset.innerText = 'Sunset: ' + this.setFormattedTime;
            console.log(this);
            let curLocation = this.json.timezone;
            search.setAttribute('value', `${curLocation}`)

        }
        hourlyWeatherPlace () {
            for(let i=0; i<6; i++) {
                
                let columns = Array.from(document.querySelectorAll('.mid-content__item'));
                let curColumn = Array.from(columns[i+1].children);
                let a = new Date(this.json.hourly[i].dt * 1000);
                let hour = a.getHours() + '.00';
                curColumn[0].innerText = hour;
                let photoCode = this.json.hourly[i].weather[0].icon;
                curColumn[1].setAttribute('src', 'http://openweathermap.org/img/w/' + photoCode + '.png');
                curColumn[2].innerText = this.json.hourly[i].weather[0].main;
                curColumn[3].innerText = Math.round(this.json.hourly[i].temp-273.15) + '°C';
                curColumn[4].innerText = Math.round(this.json.hourly[i].feels_like-273.15) + '°C';
                curColumn[5].innerText = Math.round(this.json.hourly[i].wind_speed);
            }
        }
        pageClock() {
            setInterval(() => {
                let today = new Date();
                let date = Date().split(' ');
                clock.innerText = date[2] + '.' + (1+today.getMonth()) + '.' + date[3] + ' ' + date[4];
            }, 1000);
       
        }
    }
    


    let curWeather = new Weather;
    curWeather.getCurCoords();
    curWeather.pageClock();


    
    //'°C'




