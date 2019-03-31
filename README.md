# <img src="https://i.ibb.co/6FWgBTN/logo.jpg" height="40" alt="Treehouse Logo"> Fullstack Javascript Tech Degree
## Project 9 - REST API

### Usage
Install all required dependencies
```
npm install
```
Seed the database
```
npm run seed
```
Start the express server with
```
npm start
```
and navigate too [localhost:5000](localhost:5000)

### Project tasks
* Setup Mongoose
    - Add the Mongoose package
    - Configure to use the `fsjstd-restapi` database
    - Notify console upon errors
    - Notify console when database connects successfully
#### User Model
Define a Mongoose User data model

| Key           | Type     |
|---------------|----------|
| _id           | ObjectId |
| firstName     | String   |
| lastName      | String   |
| emailAddress  | String   |
| password      | String   |

#### Course Model
Define a Mongoose Course data model

| Key             | Type     |
|-----------------|----------|
| _id             | ObjectId |
| user            | ObjectId |
| title           | String   |
| description     | String   |
| estimatedTime   | String   |
| materialsNeeded | String   |

#### User Routes
All of the following routes are available

| Path        | Method | Returns                        |
|-------------|--------|--------------------------------|
| /api/users  | get    | Current Authenticated User     |
| /api/users  | post   | Creates user and redirect="/"  |

#### Course Routes
All of the following routes are available

| Path              | Method | Returns                            |
|-------------------|--------|------------------------------------|
| /api/courses      | get    | List of courses and owning user    |
| /api/courses/:id  | get    | Specified course and owning user   |
| /api/courses      | post   | Create and redirect to course      |
| /api/courses/:id  | put    | Updates course and returns nothing |
| /api/courses/:id  | delete | Deleted course and returns nothing |

Additional
+ `/api/courses` and `/api/courses/:id` filters the following properties
    - emailAddress
    - password
+ Return 403 if the user doesn't own the resource

#### Validations
POST and PUT routes validate the following
- User
- firstName
- lastName
- emailAddress
- password
- Course
- title
- description
- Valid and unique emailAddress
Return a `400` error when vlaidation fails

#### Password Security
The `POST /api/users` route hashes the password before storing

#### Permissions
Authenticate permissions for the the following routes
- GET /api/users
- POST /api/courses
- PUT /api/courses/:id
- DELETE /api/courses/:id
Return a `401` error when authentication fails