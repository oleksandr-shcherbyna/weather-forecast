export const currentWeather = {
    coord: {
      lon: '',
      lat: ''
    },
    weather: [
      {
        id: '',
        main: '',
        description: '',
        icon: ''
      }
    ],
    base: '',
    main: {
      temp: '',
      feels_like: '',
      temp_min: '',
      temp_max: '',
      pressure: '',
      humidity: ''
    },
    visibility: '',
    wind: {
      speed: '',
      deg: ''
    },
    clouds: {
      all: ''
    },
    dt: '',
    sys: {
      type: '',
      id: '',
      message: '',
      country: '',
      sunrise: '',
      sunset: ''
    },
    timezone: '',
    id: '',
    name: '',
    cod: '',
    city: '',
    iconName: '',
    currentDateTime: ''
}

export const hourlyForecast = [
  {
    iconName: '',
    temp: '',
    time: '',
    weather: {
      description: '',
      icon: '',
      id: '',
      main: '',
    }
  }
]

export const dailyForecast = [
  {
    date: ['', '', ''],
    iconName: '',
    tempPoints: {
      day: '',
      eve: '',
      max: '',
      min: '',
      morn: '',
      night: ''
    },
    weather: {
      description: '',
      icon: '',
      id: '',
      main: '',
    }
  }
]

export const additionalInfo = {
  feelsLike: '',
  windSpeed: '',
  pressure: '',
  humidity: ''
}

export const chart = {
  iconName: '',
  iconPosition: {'left': 0},
  chartPoints: ['', '']
}
