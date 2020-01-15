const cityForm = document.querySelector('form');
const card = document.querySelector('.card');
const details = document.querySelector('.details');
const time = document.querySelector('img.time');
const icon = document.querySelector('.icon img');
const temeperatureSpan = document.querySelector(".details span");

// API KEY
const key = '';

// Form submit
cityForm.addEventListener('submit', e => {

	e.preventDefault();
  
	const city = cityForm.city.value.trim();
	cityForm.reset();

	updateCity(city)
		.then(data => updateUI(data))
		.catch(err => console.log(err));
		
});


// City information
const getCity = async (city) => {

	const base = 'http://dataservice.accuweather.com/locations/v1/cities/search';
	const query = `?apikey=${key}&q=${city}`;

	const response = await fetch(base + query);
	const data = await response.json();

	return data[0];
};


// Weather information
const getWeather = async (id) => {
  
	const base = 'http://dataservice.accuweather.com/currentconditions/v1/';
	const query = `${id}?apikey=${key}`;

	const response = await fetch(base + query);
	const data = await response.json();

	return data[0];
};

// Get city and weather
const updateCity = async (city) => {

	const cityDets = await getCity(city);
	const weather = await getWeather(cityDets.Key);
	return { cityDets, weather };

};


// Update the webpage	
const updateUI = (data) => {

	const { cityDets, weather } = data;

	// Display weather update
	details.innerHTML = `
		<h5 class="my-3">${cityDets.EnglishName}</h5>
		<div class="my-3">${weather.WeatherText}</div>
		<div class="display-4 my-4">
		<span>${weather.Temperature.Metric.Value}</span>
		<span class="temp">C</span>
		<h6 class="my-3">Switch &deg;C and &deg;F</h6>
		</div>`;

	// Update weather icon
	const iconSrc = `img/icons/${weather.WeatherIcon}.svg`;
	icon.setAttribute('src', iconSrc);

	// Day or night
	const timeSrc = weather.IsDayTime ? 'img/day.svg' : 'img/night.svg';
	time.setAttribute('src', timeSrc);


	if(card.classList.contains('d-none')){
		card.classList.remove('d-none');
	}
  
	details.addEventListener("click", ()=> {

		const temeperatureSpan = document.querySelector(".temp");

		if (temeperatureSpan.textContent === "C"){

			// Display weather update
			details.innerHTML = `
				<h5 class="my-3">${cityDets.EnglishName}</h5>
				<div class="my-3">${weather.WeatherText}</div>
				<div class="display-4 my-4">
				<span>${weather.Temperature.Imperial.Value}</span>
				<span class="temp">F</span>
				<h6 class="my-3">Switch &deg;C and &deg;F</h6>
				</div>`;
		} 
		else if(temeperatureSpan.textContent === "F")	  {

			// Display weather update
			details.innerHTML = `
				<h5 class="my-3">${cityDets.EnglishName}</h5>
				<div class="my-3">${weather.WeatherText}</div>
				<div class="display-4 my-4">
				<span>${weather.Temperature.Metric.Value}</span>
				<span class="temp">C</span>
				<h6 class="my-3">Switch &deg;C and &deg;F</h6>
			</div>`;
		}
	});
};