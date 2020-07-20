# Introduction: StockTracker 
```

As a user, when I log into StockTracker, I want to see a snapshot of the stocks I'm monitoring, because it will give me an idea of my financial health.

## Motivation

The motivation is to build an easy-to-use finance app that even non-financial people can understand.

## Usage

A user must first register to initiate the StockTracker app. Once the user successfully registered, the site will automatically be redirected to the user's Dashboard.

Once the user is in the Dashboard, the user can search for any stocks and add it to My Watchlist.

When the stock is added to My Watchlist, the stock info will be stored and will only be deleted by the user. Also in My Watchlist, the user can click on the "!" to get more information on that specific stock.

The user will be redirected to the Stock Details page of selected stock. On this page, there is a chart of stock prices and a list of relevant news. The chart is a real-time, minute-by-minute chart during market hours. The news list is indiviually hyper-linked, where the user can click to read news article from independent sources. [See Demo below.](#Demo)

* Clone the project
* Open terminal -> run command git clone ---url of the project---
* Open the project with Visual Code.
* Run npm Install.
* Documentation - About all the libraries we using inside our project: https://www.npmjs.com/ 


## Built With
- HTML 5
- CSS
- JavaScript.
- Node.js.
- MySql - Create local DB.
- jQuery - Ajax
- Heroku - JawsDB

#### Heroku : https://app-stocktracker.herokuapp.com/

- Javascript
- Node.js
- Sequelize
- Passport
- MySQL
- Express
- Bcryptjs
- Dotenv
- Chart.js
- Materialize
- API - IEX and NEWSApi
- Deployed in Heroku with JawsDB as an add-on.

## Instructions

Install the following node packages:

```
npm i axios
```

```
npm i bcrypt
```

```
npm i chart.js
```

```
npm i dotenv
```

```
npm i express express-session
```

```
npm i moment
```

```
npm i mysql2
```

```
npm passport passport-local
```

```
npm i sequelize sequelize-cli
```
```
Create a database in MySQL. In this example, `stock_market_db` is used (refer to config.json).

## Getting Started

- Clone this github.
- Run npm install.
- Create MySQL database. (Note: root and password may be different.)
- Run node server.js

Try it out - [StockTracker app](https://app-stocktracker.herokuapp.com/)

## [Demo](#Demo)

![StockTracker demo](client/assets/img/stockTracker.gif)

## Authors

- Philip Kouchner - @PhilipK-webdev
- Hedi Calabrese - @hedical
- Tracy Nguyen - @TracyVy
- Steven R Simon - @stevierichard
