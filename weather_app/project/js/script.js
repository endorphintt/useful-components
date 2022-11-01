const citiesList = document.querySelector('.cities__list');
const cities = document.querySelectorAll('.cities__li');
const input = document.querySelector('#input');
const cancel = document.querySelector('.form__cancel');
const form = document.querySelector('.form');

const focusedInput = () => {
	cancel.classList.add('hide');
	citiesList.classList.add('_active');
	let val = input.value.trim();				
	if ( val !== ''){					
		cities.forEach((city) => {						
			if (city.innerHTML.toLowerCase().search(val.toLowerCase()) != -1){
				city.classList.remove('hide');
			}
			else{
				city.classList.add('hide');
			}
		})
	}
	else {
		cities.forEach(city => {
			city.classList.remove('hide');
		})
	}
}

input.addEventListener('input', focusedInput)

const handleCancelClick = () => {
	input.value = '';
	input.focus();
	citiesList.classList.add('_active');
	cancel.classList.add('hide');
}

cancel.addEventListener('click', handleCancelClick)

for(const city of cities){
	city.addEventListener('click', () => {
		input.value = city.innerHTML;
		citiesList.classList.remove('_active');
		cancel.classList.remove('hide');

		// selected
		const selected = document.querySelector('.selected');
		selected.innerHTML = `selected: ${input.value}`;

		let currentLocation = '';
		let inputValue = input.value
		for(let symbol of inputValue){						
			if(symbol !== ','){
				currentLocation = currentLocation + symbol;
			} else {							
				break;
			}						
		}
		ShowNewWeather(currentLocation);					
	})
}

const weatherBlock = document.querySelector('.weather');

async function loadWeather(city){
	weatherBlock.innerHTML = `
	<div class="weather__loading">
		<img src="img/loading.gif" alt="Loading...">
	</div>`

	const server = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=37b7603bd59e13193735154e42304da4`;
	
	const response = await fetch(server, {
		method: 'GET',
	})

	const responseResult = await response.json();

	if (response.ok){
		getWeather(responseResult);
	} else {
		weatherBlock.innerHtml = responseResult.message;
	}
}
function getWeather(data){
	// current day
	let currentTemp = Math.round(data.list[0].main.temp);
	let currentFeels = Math.round(data.list[0].main.feels_like);
	let currentSky = data.list[0].weather[0].main;
	let currentLocstion = data.city.name;
	let currentIcon = data.list[0].weather[0].icon;

	const dayWeather = (i) => {
		let result = {
			dayTempTop: Math.round(data.list[i].main.temp_max),
			dayTempBottom: Math.round(data.list[i].main.temp_min),
			daySky: data.list[i].weather[0].main,
			dayIcon: data.list[i].weather[0].icon,
		}
		return result;
	}

	// names of days
	const week = ['SUN', 'MON', 'TUE', 'THU', 'WED', 'FRI', 'SAT'];
	let currentDate = new Date;

	const template = `
	<div class="weather__header">
		<div class="weather__temp">
			<div class="weather__main-temp">${currentTemp}°C</div>
			<div class="feels-like">Feels like ${currentFeels}°C</div>
		</div>
		<div class="weather__location">
			<div class="weather__sky">${currentSky}</div>
			<div class="weather__city">${currentLocstion}, Ukraine</div>
		</div>
		<div class="weather__icon">
			<img src="http://openweathermap.org/img/w/${currentIcon}.png">
		</div>
	</div>
	<div class="week">
		<div class="week__item">
			<div class="day">${week[ (currentDate.getDay() + 1) % 7]}</div>
			<div class="day__icon"><img src="http://openweathermap.org/img/w/${dayWeather(7).dayIcon}.png"></div>
			<div class="day__sky">${dayWeather(7).daySky}</div>
			<div class="day__temp">
				<div class="day__temp-top">${dayWeather(7).dayTempTop}°C</div>
				<div class="day__temp-bottom">${dayWeather(7).dayTempBottom}°C</div>
			</div>
		</div>
		<div class="week__item">
			<div class="day">${week[ (currentDate.getDay() + 2) % 7]}</div>
			<div class="day__icon"><img src="http://openweathermap.org/img/w/${dayWeather(15).dayIcon}.png"></div>
			<div class="day__sky">${dayWeather(15).daySky}</div>
			<div class="day__temp">
				<div class="day__temp-top">${dayWeather(15).dayTempTop}°C</div>
				<div class="day__temp-bottom">${dayWeather(15).dayTempBottom}°C</div>
			</div>
		</div>
		<div class="week__item">
			<div class="day">${week[ (currentDate.getDay() + 3) % 7]}</div>
			<div class="day__icon"><img src="http://openweathermap.org/img/w/${dayWeather(23).dayIcon}.png"></div>
			<div class="day__sky">${dayWeather(23).daySky}</div>
			<div class="day__temp">
				<div class="day__temp-top">${dayWeather(23).dayTempTop}°C</div>
				<div class="day__temp-bottom">${dayWeather(23).dayTempBottom}°C</div>
			</div>
		</div>
		<div class="week__item">
			<div class="day">${week[ (currentDate.getDay() + 4) % 7]}</div>
			<div class="day__icon"><img src="http://openweathermap.org/img/w/${dayWeather(31).dayIcon}.png"></div>
			<div class="day__sky">${dayWeather(31).daySky}</div>
			<div class="day__temp">
				<div class="day__temp-top">${dayWeather(31).dayTempTop}°C</div>
				<div class="day__temp-bottom">${dayWeather(31).dayTempBottom}°C</div>
			</div>
		</div>
		<div class="week__item">
			<div class="day">${week[ (currentDate.getDay() + 5) % 7]}</div>
			<div class="day__icon"><img src="http://openweathermap.org/img/w/${dayWeather(39).dayIcon}.png"></div>
			<div class="day__sky">${dayWeather(39).daySky}</div>
			<div class="day__temp">
				<div class="day__temp-top">${dayWeather(39).dayTempTop}°C</div>
				<div class="day__temp-bottom">${dayWeather(39).dayTempBottom}°C</div>
			</div>
		</div>
	</div>`
	let weatherBlock = document.querySelector('.weather')
	weatherBlock.innerHTML = template;
}

// default location
let kyiv = 'Kyiv'
if(weatherBlock){
	loadWeather(kyiv);
}

const ShowNewWeather = (city) => {
	if(weatherBlock){
		loadWeather(city);
	}
}

const handleFormSubmit = () => {
	citiesList.classList.remove('_active');
	cancel.classList.remove('hide');

	// selected
	const selected = document.querySelector('.selected');
	selected.innerHTML = `selected: ${input.value}`;

	let currentLocation = '';
	for(let symbol of input.value){						
		if(symbol != ','){
			currentLocation = currentLocation + symbol;
		} else {							
			break;
		}						
	}

	ShowNewWeather(currentLocation);
}

form.addEventListener('submit', () => {
	handleFormSubmit();
})