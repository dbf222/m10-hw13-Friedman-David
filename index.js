
const weatherContainer = document.getElementById('weather');
const formEl = document.querySelector('form');
const inputEl = document.querySelector('input');


formEl.onsubmit = async e => {
  e.preventDefault();
  var userInput = inputEl.value.trim()
  if (!userInput) return
  try {
  const weatherInfo = await getWeather(userInput)
  displayWeatherInfo(weatherInfo)
  } catch (err) {
    displayLocNotFound()
  }


  inputEl.value = ""
}

function getWeather(query) {
  if (!query.includes(",")) query += ',us'
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=6efff70fe1477748e31c17d1c504635f`
  )
    .then(function(res) {
      return res.json()
    })
    .then(function(data) {
      const {
        cod,
        main: {
          temp,
          feels_like
        },
        weather: [
          {
            icon,
            description
          }
        ]
      } = data

      if (data.cod === "404") throw new Error('location not found')
      var iconUrl = 'https://openweathermap.org/img/wn/' +
        data.weather[0].icon +
        '@2x.png'
      var actualTemp = temp
      var feelsLikeTemp = feels_like
      var place = data.name + ", " + data.sys.country
      var updatedAt = new Date(data.dt * 1000)
      return {
        coords: data.coord.lat + ',' + data.coord.lon,
        description: description,
        iconUrl: iconUrl,
        actualTemp: actualTemp,
        feelsLikeTemp: feelsLikeTemp,
        place: place,
        updatedAt: updatedAt
      }
    })
}

function displayLocNotFound() {
  weatherContainer.innerHTML = "";
  var errMsg = document.createElement('h2')
  errMsg.textContent = "Location not found"
  weatherContainer.appendChild(errMsg)
}

function displayWeatherInfo(weatherObj) {
 
  weatherContainer.innerHTML = "";

  function addBreak() {
    weatherContainer.appendChild(
      document.createElement('br')
    )
  }

 
  var placeName = document.createElement('h2')
  placeName.textContent = weatherObj.place
  weatherContainer.appendChild(placeName)


  var whereLink = document.createElement('a')
  whereLink.textContent = "Click to view map"
  whereLink.href = "https://www.google.com/maps/search/?api=1&query=" + weatherObj.coords
  whereLink.target = "__BLANK"
  weatherContainer.appendChild(whereLink)


  var icon = document.createElement('img')
  icon.src = weatherObj.iconUrl
  weatherContainer.appendChild(icon)

  var description = document.createElement('p')
  description.textContent = weatherObj.description
  description.style.textTransform = 'capitalize'
  weatherContainer.appendChild(description)

  addBreak()


  var temp = document.createElement('p')
  temp.textContent = "Current: " +
    weatherObj.actualTemp +
    "° F"
  weatherContainer.appendChild(temp)


  var feelsLikeTemp = document.createElement('p')
  feelsLikeTemp.textContent = "Feels like: " +
    weatherObj.feelsLikeTemp +
    "° F"
  weatherContainer.appendChild(feelsLikeTemp)

  addBreak()


  var updatedAt = document.createElement('p')
  updatedAt.textContent = "Last updated: " +
    weatherObj.updatedAt.toLocaleTimeString(
      'en-US',
      {
        hour: 'numeric',
        minute: '2-digit'
      }
    )
  weatherContainer.appendChild(updatedAt)
}
