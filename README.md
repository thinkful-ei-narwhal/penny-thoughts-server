## Application
Penny Thoughts

## Built By
- Andrew Durrant
- Cesar Lenin Morales
- Daniel Sottile
- Joseph Rivera
- Kevin Jiang
- Logan Stribling

## Links
live site: https://penny-thoughts.vercel.app/<br />
server: https://mighty-peak-21411.herokuapp.com/<br/>
client Repo:https://github.com/thinkful-ei-narwhal/penny-thoughts-client/

## Using The API
Currently the API supports GET and POST endpoints.

- Unprotected Endpoints<br />
  + Sign Up: POST (https://url/api/api/users)<br />
  + Get 10 Random Messages: GET (https://url/api/api/messages)<br />

- Protected Endpoints<br />
  + Login: POST (https://url/api/auth/login)<br />
  + Edit Account Information: PATCH (https://url/api/users)<br />
  + Delete Account: DELETE (https://url/api/users)<br />
  + Submit a Message: POST (https://url/api/api/messages)
  + Get User's Submitted Messages: GET (https://url/api/messages/userData/:page)<br />
  + Edit User's Submitted Messages: PATCH (https://url/api/auth/messages/userData)<br />
  + Delete User's Submitted Messages: DELETE (https://url/api/auth/messages/userData)<br />
  + Report Messages: PATCH (https://url/api/auth/messages/report)<br />

- Admin Endpoints<br />
  + Get Reported Messages: GET (https://url/api/messages/flagged)<br />
  + Archive Reported Message: PATCH (https://url/api/messages/archive)<br />
  + Un-flag Reported Message: PATCH (https://url/api/messages/flagged)<br />

## Screen Shots
![Landing/LogIn](images/LandingLoginPage.png)<br />
![Registration](images/RegistrationPage.png)<br />
![Dashboard](images/Dashboard.png)<br />
![Settings](images/SettingsPage.png)<br />
![Admin](images/AdminPage.png)<br />

### Summary
This app is an uplifting, anonymous, message sharing app. Negative messages are filtered out using a toxicity filter from TensorFlow. 

## Technologies
- General
  * JavaScript
- Front End
  * HTML5
  * CSS3
  * React
- Back End
  * Node.js
  * Express
  * XSS
  * Winston
  * NYC
  * Knex
  * Postgresql
  * TensorFlow
  * Crypto-js
- Testing
  * Jest
  * Supertest
  * Mocha, Chai
  * Enzyme
