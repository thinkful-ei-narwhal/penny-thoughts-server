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
client Repo:https://github.com/thinkful-ei-narwhal/penny-thoughts-client/

## Using The API

  - Auth Route '/api/auth'
    + Login: POST '/login'{ username, password } => { authToken: [some auth token] }

 - Messages Route '/api/messages' (most require authentication)
  + Get 10 Messages: GET '/' => [{archived: false, date_created: [some date], date_modified: [some_date], flagged: [boolean], id: #, message: ['a message'], user_id: #}, ...]
  + Post 1 message: POST (reqAuth) '/' { message } => [{archived: false, date_created: [some date], date_modified: [some_date], flagged: [boolean], id: #, message: ['a message'], user_id: #}]
  + Get 1 Message: GET '/single:id' => [{archived: false, date_created: [some date], date_modified: [some_date], flagged: [boolean], id: #, message: ['a message'], user_id: #}]
  + Get All Flagged Messages: GET (reqAuth) '/flagged' => [{archived: false, date_created: [some date], date_modified: [some_date], flagged: [boolean], id: #, message: ['a message'], user_id: #}, ...]
  + Unflag a Message: PATCH (reqAuth) '/flagged' { id } => nothing
  + Archive a Message: PATCH (reqAuth) '/archive' { id } => nothing
  + Get User Messages: GET (reqAuth) '/userData/:page' => [{archived: false, date_created: [some date], date_modified: [some_date], flagged: [boolean], id: #, message: ['a message'], user_id: #}, ...]
  + Get the Page Count: GET (reqAuth) '/pageCount' => {count: #}
  + Patch a user message: PATCH (reqAuth) '/userData' { id, message } => nothing
  + Delete a user Message: DELETE (reqAuth) '/userData' { id } => nothing
  + Report (flag) a message: PATCH '/report' { id }=> nothing
  
  
 - Users Route 'api/users' (all requre authentication)
  + Get the user fullname and email: GET '/' => {full_name: [fullname] , email: [email]}
  + Post the user fullname and email: POST '/' { full_name, username, email, password } => {full_name: [fullname] , email: [email]}
  + Delete the user account: DELETE '/' { id } => { success: true }
  + Edit user fullname and email: PATCH '/' { full_name, email } => nothing


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
