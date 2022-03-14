# About application ☁️:

This project has been developed and coded as a single-page web application that provides the possibility to view the weather in different cities worldwide.

## General information ☔:

In addition to viewing the temperature in the city, the user can view more things. The hourly forecast, 7 days forecast (with a list of temperatures during the day on a separate page), additional data such as sunset-dawn schedule that changes dynamically depending on the time of day, current time in the selected city, wind speed, pressure, etc. These things are available for users' choice.
The user can view the weather and time in 4 cities simultaneously, which he will choose. The cities will be saved, and when the application is reopened, the user will see the cities he indicated.

## Features ❄️:

* When entering the site, the application automatically reads the user's geolocation and provides him with up-to-date data.
* Styles for some elements are changing depending on the time of day throughout the application. In addition to that, the background shows the current weather and changes in real-time, showing the current weather conditions with an aesthetically designed UI of the entire application.
* Throughout the application, data is updated automatically. Spinners were used to implement modern design solutions. 
* The information is always up-to-date and updated with a minimum number of requests to the server.
* Preloader, Angular animations, etc., were used to create a modern and pleasant design. The application is mobile-friendly.
* Reactive forms were used to validate user data and exclude unnecessary requests to the server.

## Technologies and libraries ☀️:

* Angular - was used as the core framework.
* Figma - was used to develop the responsive and modern design before writing code.
* Angular Material - was used to implement given design solutions using a custom theme.
* SimpleBar - a library was used to implement some of the design features, giving the ability to scroll through the content with a custom scrollbar. The solution which provides the ability to scroll using the mouse wheel was also implemented.
* Moment.js - was used to work with time and date.
* SCSS - was used for writing styles.
* RxJS - was used to work with Observables, BehaviourSubjects, subscriptions, etc. Operators were used for unsubscribing, managing callback-based code, etc...
* TypeScript - was used for providing a richer environment for spotting common errors.

### Angular main features ⛅:

Angular features which were used in the application (except the most common): interceptor, asynchronous code structuring, angular animations, proper file structuring, reusable components, Observables, BehaviourSubjects, custom pipes, routing, reactive forms, etc...

### Additional information 🌛:

Big thanks to openweathermap.org for providing free APIs, which were used as resources for weather data.

In the daily forecast tab, the forecast is shown for 7 days instead of 16, since free APIs do not provide such an opportunity without paying a subscription. 
The subscription was not acquired, because the application was conceived as a project for training.
