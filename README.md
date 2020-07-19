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
server: https://mighty-peak-21411.herokuapp.com/<br />
server repo: https://github.com/thinkful-ei-narwhal/penny-thoughts-server/

## Using The API

  - Auth Route '/api/auth'
    + POST '/login' => { authToken: [some auth token] }

 - Messages Route '/api/messages' (most require authentication)
  + GET '/' => [{archived: false, date_created: [some date], date_modified: [some_date], flagged: [boolean], id: #, message: ['a message'], user_id: #}, ...]
  + POST (reqAuth) '/' => [{archived: false, date_created: [some date], date_modified: [some_date], flagged: [boolean], id: #, message: ['a message'], user_id: #}]
  + GET '/single:id' => [{archived: false, date_created: [some date], date_modified: [some_date], flagged: [boolean], id: #, message: ['a message'], user_id: #}]
  + GET (reqAuth) '/flagged' => [{archived: false, date_created: [some date], date_modified: [some_date], flagged: [boolean], id: #, message: ['a message'], user_id: #}, ...]
  + PATCH (reqAuth) '/flagged' => nothing
  + PATCH (reqAuth) '/archive' => nothing
  + GET (reqAuth) '/userData/:page' => [{archived: false, date_created: [some date], date_modified: [some_date], flagged: [boolean], id: #, message: ['a message'], user_id: #}, ...]
  + GET (reqAuth) '/pageCount' => {count: #}
  + PATCH (reqAuth) '/userData' => nothing
  + DELETE (reqAuth) '/userData' => nothing
  + PATCH (reqAuth) '/report' => nothing
  
  
 - Users Route 'api/users' (all requre authentication)
  + GET '/' => {full_name: [fullname] , email: [email]}
  + POST '/' => {full_name: [fullname] , email: [email]}
  + DELETE '/' => nothing
  + PATCH '/' => nothing


## Screen Shots
![Landing/LogIn](images/LandingLoginPage.png)<br />
![Registration](images/RegistrationPage.png)<br />
![Dashboard](images/Dashboard.png)<br />
![Settings](images/SettingsPage.png)<br />
![Admin](images/AdminPage.png)<br />

### Summary
Penny Thoughts is an application built for users to share uplifting and motivational messages in a world that is fraught with crisis.  In order to keep our space space, we filter messages using TensorFlow.js's Toxicity model.

## Technologies
- General
  * JavaScript
- Front End
  * HTML5
  * CSS3
  * React
  * Vercel
- Back End
  * Node.js
  * Express
  * Heroku
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
