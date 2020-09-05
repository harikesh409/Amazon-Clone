# Amazon-Clone
This repository contains client and server code for Amazon Clone.
# Running the Project
## Client
- Run `npm install` to install the required node modules.
- Run `ng serve` to run the server.
- By default it runs on port 4200. http://localhost:4200/.
## Server
- Run `npm install` to install the required node modules.
- Create a file `nodemon.json` in server directory with the following template:
``` json
{
    "env": {
        "DB_USERNAME": "YOUR_DATABASE_USERNAME",
        "DB_PASSWORD": "YOUR_DATABASE_PASSWORD",
        "PORT": "9000",
        "TOKEN": "TOKEN_FOR_ENCRYPTION"
    }
}
```
- Run `npm start` it runs on port 9000. http://localhost:9000.