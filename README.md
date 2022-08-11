<h1 align="center" id="readme-top">Angular Weather Forecast Application</h1>

<p align="center">
  <img src="src/assets/images/other/readme-icon.png" alt="angular-logo" width="120px" height="120px"/>
  <br>
  <a href="https://angular.io/"><img src="https://img.shields.io/badge/Angular%20CLI-v.12.2.14-red.svg"/></a>&nbsp;
  <a href="https://nodejs.org/en"><img src="https://img.shields.io/badge/Node-v.14.17.2-brightgreen.svg"/></a>&nbsp;
  <a href="https://www.npmjs.com/package/npm"><img src="https://img.shields.io/badge/npm-v.6.14.13-green.svg"/></a>&nbsp;
  <a href="https://momentjs.com"><img src="https://img.shields.io/badge/Moment.js-v.2.29.1-orange.svg"/></a>
  <br>
</p>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-application">About application</a></li>
    <li><a href="#setup">Setup</a></li>
    <li><a href="#general-information">General information</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#technologies-and-libraries">Technologies and libraries</a></li>
    <li><a href="#angular-main-features">Angular main features</a></li>
    <li><a href="#additional-information">Additional information</a></li>
  </ol>
</details>

<hr>

<h1 id="about-application">About application ☁️:</h1>

This project has been developed and coded as a single-page web application that provides the possibility to view the weather in different cities worldwide.

<h2 id="setup">Setup 🔧:</h2>

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<h2 id="general-information">General information ☔:</h2>

In addition to viewing the temperature in the city, the user can view more things. The hourly forecast, 7 days forecast (with a list of temperatures during the day on a separate page), additional data such as sunset-dawn schedule that changes dynamically depending on the time of day, current time in the selected city, wind speed, pressure, etc. These things are available for users' choice.
The user can view the weather and time in 4 cities simultaneously, which he will choose. The cities will be saved, and when the application is reopened, the user will see the cities he indicated.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<h2 id="features">Features ❄️:</h2>

* When entering the site, the application automatically reads the user's geolocation and provides him with up-to-date data.
* Styles for some elements are changing depending on the time of day throughout the application. In addition to that, the background shows the current weather and changes in real-time, showing the current weather conditions with an aesthetically designed UI of the entire application.
* Throughout the application, data is updated automatically. Spinners were used to implement modern design solutions. 
* The information is always up-to-date and updated with a minimum number of requests to the server.
* Preloader, Angular animations, etc., were used to create a modern and pleasant design. The application is mobile-friendly.
* Reactive forms were used to validate user data and exclude unnecessary requests to the server.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<h2 id="technologies-and-libraries">Technologies and libraries ☀️:</h2>

* Angular - was used as the core framework.
* Figma - was used to develop the responsive and modern design before writing code.
* Angular Material - was used to implement given design solutions using a custom theme.
* SimpleBar - a library was used to implement some of the design features, giving the ability to scroll through the content with a custom scrollbar. The solution which provides the ability to scroll using the mouse wheel was also implemented.
* Moment.js - was used to work with time and date.
* SCSS - was used for writing styles.
* RxJS - was used to work with Observables, BehaviourSubjects, subscriptions, etc. Operators were used for unsubscribing, managing callback-based code, etc...
* TypeScript - was used for providing a richer environment for spotting common errors.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<h3 id="angular-main-features">Angular main features ⛅:</h3>

Angular features which were used in the application (except the most common): interceptor, asynchronous code structuring, angular animations, proper file structuring, reusable components, Observables, BehaviourSubjects, custom pipes, routing, reactive forms, etc...

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<h3 id="additional-information">Additional information 🌛:</h3>

Big thanks to openweathermap.org for providing free APIs, which were used as resources for weather data.

In the daily forecast tab, the forecast is shown for 7 days instead of 16, since free APIs do not provide such an opportunity without paying a subscription. 
The subscription was not acquired, because the application was conceived as a project for training.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
