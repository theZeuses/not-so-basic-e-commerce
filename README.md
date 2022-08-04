<h3 align="center">basic-e-commerce</h3>

---

<p align="center"> Backend for a e-commerce with basic functionalities. 
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Commands](#commands)
- [Built Using](#built_using)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>

This project demonstrates a fully working backend to serve the REST API endpoints which may propel an e-commerce website with basic functionalities. Through this project, you may find reference on developing a backend which utilizes **httponly fingerprint cookie alongside refresh token/bearer token mechanism and session tracking using redis** to be as secure as possible. You can also find reference on best practices while designing endpoint URLs of REST API. This project also includes, **multichannel notification**, **task queue implementation using bull**, **scheduled tasks using bull**, **role based authorization**, and **unit, integration and end to end testing using jest and docker**.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [usage](#usage) for how you can see everything in action and interact with the system. 

### Prerequisites

What things you need to run the application

```
node v14.15.4
npm v7.5.3
```
```
docker-compose v1.29.2
```

### Installing

A step by step series of examples that tell you how to get a development env running.

Clone this repository

```
git clone https://github.com/theZeuses/not-so-basic-e-commerce.git
```

Change working directory

```
cd not-so-basic-e-commerce
```

Create a .env file in root and copy everything form .env.example

```
cat .env.example > .env
```

> (OPTIONAL, yet RECOMMENDED) Update SMTP configuration values of .env and .env.test with your own credentials

Install the dependencies

```
npm install
```

Spin up the docker services

```
npm run d-service:restart
```
>If you don't want to use docker, rather want to use MySQL and Redis from your localhost, you can skip this step. But in that case, you have to edit _.env_ and _.env.test_ with your MySQL and Redis configuration values. NOTE: .env.test should only contain configurations for test environment

Run the migrations

```
npm run migration:run
```
***Incase of connection lost error please wait for some time and run the command again as MySQL needs some to be fully up***

Run the seeders

```
npm run seeder:run
```
Start the application
```
npm run dev
```
Typescript will be compiled to javascript and the application will boot up. You will see _Listening Backend API on port 8001_ in the terminal.

## 🔧 Running the tests <a name = "tests"></a>
### Set Up
If the docker services aren't running already

```
npm run test:prepare
```
***Incase of connection lost error please wait for some time and run the next command as MySQL needs some to be fully up***

Prepare the test database

```
npm run test:migration:run
```
***Incase of connection lost error please wait for some time and run the command again as MySQL needs some to be fully up***

### Automated Tests
To run all the unit tests run

```
npm test
```

To run all the integration tests run

```
npm run test:int
```

To run all the end to end test run

```
npm run test:e2e
```

## 🎈 Usage <a name="usage"></a>

As soon as your copy of the application boots up you can start exploring the endpoints. Here, only the main functionalities have been demonstrated.

### _Clarification_
1. API endpoints have been versioned using /api/v1 prefix before all resource names.

2. All get all endpoints (e.g. /api/v1/products, /api/v1/discounts) provides the functionality to filter the result set using query string. You can also search, paginate, load related resources, and filter related resources using the query string.
> **STANDARD QUERY STRING:** _/api/v1/products?attr=id,name&q=Horina&type=Fish&category_id=1&w=Discount&wf=Discount:percentage:gtei:1&s=id&o=0&l=2_ **EXPLANATION:** this string translates to get _id_ and _name_ of all the products whose name contains _Horina_ in it, whose type is _Fish_, which are of category_id _1_, and loads the associated _Discount_ of every fetched products if the discount's percentage is greater than _1_. This query also tells the server to provide at most 2 products without skipping any product from the beginning of the data table and sort the result set according to id of the products.

3. GET requests must follow appropriate query string format described above, otherwise a BAD_QUERY_STRING error will be returned.

4. POST/PATCH request's body must follow appropriate payload schema to fullfil that request, otherwise BAD_REQUEST_PAYLOAD error will be returned.

5. Successful request for getting resource will just return the result/result set.
```
{
  "field": "data"
}
```
```
[
  {
    "field": "data"
  }
]
```
6. Successful request for performing action will return response in following pattern
```
{
  "statusCode": 201,
  "data": {
    "field": "data"
  }
}
```

7. Unsuccessful request will return response in following pattern
```
{
  "error": "NotFoundException"
  "statusCode": 404,
  "errorCode": "PRODUCT_NOT_FOUND"
}
```

### Auth

**Login**

endpoint
```
POST /api/v1/auth/login
```
body
```
{
  "email": "admin@admin.com",
  "password": "password"
}
```

**Register** (only customer can register)

endpoint
```
POST /api/v1/register
```
body
```
{
  "name": "Customer 1",
  "email": "customer1@customer.com",
  "password": "password",
  "role": "CUSTOMER",
  "address": "address"
}
```
**Refresh Token**

Bearer tokens must be refreshed before they expire.

endpoint
```
POST /api/v1/auth/refresh-token
```
headers
```
Authorization: Bearer [refresh_token]
```
body
```
none
```

### Products
**Get Product List** (searching by name, filtering by category_id and rating, pagination)

endpoint
```
GET /api/v1/products?q=horina&category_id=1&type=Fish&rating=gtei:1&o=0&l=2
```

**Add Product**

endpoint
```
POST /api/v1/products
```
headers
```
Authorization: Bearer [bearer_token of admin]
```
body
```
{ 
  "name": "Beef Bone",
  "price": 169,
  "photo": "cdn:path/to/image",
  "weight": 1,
  "weight_unit": "kg",
  "isPublished": false,
  "description": "Delicious Beef Bone",
  "type": "Meat",
  "category_id": 1,
  "rating": 4
}
```

**Update Info of a product**

endpoint
```
PATCH /api/v1/products/:id
```
headers
```
Authorization: Bearer [bearer_token of admin]
```
body (one example)
```
{ 
  "description": "Delicious Fresh Beef Bone",
}
```

**Publish a product**

endpoint
```
POST /api/v1/products/:id/publish
```
headers
```
Authorization: Bearer [bearer_token of admin]
```
body
```
none
```

**Unpublish a product**

endpoint
```
POST /api/v1/products/:id/unpublish
```
headers
```
Authorization: Bearer [bearer_token of admin]
```
body
```
none
```

### Cart Items

**Add product to cart as cart-item**

If the product is already on cart then it will just increase the quantity. And if there is no cart on cookie then will also create the cart first and set that cart to cookie.

endpoint
```
POST /api/v1/cart-items
```
body
```
{
  "product_id": 2,
  "quantity": 1
}
```

**Update quantity of a item in cart**

_quantity_ can be both positive. If positive it will increase the quantity of the item in cart. If negative then decrease the quantity if it is not already zero.

endpoint
```
POST /api/v1/cart-items
```
body
```
{
  "product_id": 2,
  "quantity": 1
}
```

**Delete a item from cart**

endpoint
```
DELETE /api/v1/cart-items/:id
```

### Cart
**Sync cart with user**

Syncs a cart present in the cookie with the logged in user

endpoint
```
POST /api/v1/carts/sync
```
headers
```
Authorization: Bearer [bearer_token of customer]
```
body
```
none
```

**Place a cart to order**

Cart will be converted to order and cart items to order items. If any products have discount then that will be included in the price calculation. After generating the order, cart and cart items will be deleted which will reset the shopping process for the customer.

endpoint
```
POST /api/v1/carts/:id/order
```
headers
```
Authorization: Bearer [bearer_token of customer]
```
body
```
none
```

### Order
**Confirm an order**

On successful confirmation a mail will be sent to the customer.

endpoint
```
POST /api/v1/orders/:id/confirm
```
headers
```
Authorization: Bearer [bearer_token of customer]
```
body
```
none
```

**Mark an order as delivered**

endpoint
```
POST /api/v1/orders/:id/delivered
```
headers
```
Authorization: Bearer [bearer_token of admin]
```
body
```
none
```

### System functionality
System will periodically check for carts which have not been placed in order even 4 hours after last update and send appropriate email to the cart owner.

## 🚀 Commands <a name = "commands"></a>

There are useful commands that you may find in _package.json_

start the dev server
```
npm run dev
```

create a new migration
```
npm run migration:create
```

run all pending migrations
```
npm run migration:run
```

run next pending migration
```
npm run migration:up
```

rollback last executed migration
```
npm run migration:down
```

rollback last batch of migrations
```
npm run migration:rollback
```

rollback all migrations
```
npm run migration:rollback:all
```

run all seeders
```
npm run seeder:run
```

run migration on test database
```
npm run test:migration:run
```

spin up the docker containers
```
npm run d-service:restart
```

spin up the docker containers and run migration on test database
```
npm run test:prepare
```

perform unit tets
```
npm test
```

perform unit tests and watch for change
```
npm run test:watch
```

perform integration test and watch for changes
```
npm run test:int
```

perform end to end test and watch for changes
```
npm run test:e2e
```

generate test coverage report
```
npm run test:cov
```

## ⛏️ Built Using <a name = "built_using"></a>

- [MySQL](https://www.mysql.com) - Database
- [Knex](http://knexjs.org) - QueryBuilder
- [Objection.js](https://vincit.github.io/objection.js/) - ORM
- [Redis](https://redis.io) - Memory Store & Message Broker
- [Jest](https://jestjs.io) - Testing Framework
- [Express](https://expressjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@theZeuses](https://github.com/theZeuses) - Idea & Initial work

