# E-commerce API

A simple e-commerce API built with NestJS and TypeORM.

## Table of Contents
- [Authentication](#authentication)
- [Products](#products)
- [Cart](#cart)
- [Orders](#orders)
- [Base Endpoints](#base-endpoints)
- [Product Seeding](#product-seeding)

## Authentication

### Register User
- **URL:** `/auth/register`
- **Method:** `POST`
- **Description:** Register a new user account
- **Payload:**
  ```json
  {
    "name": "string",
    "email": "string (valid email format)",
    "password": "string (min length: 6)"
  }
  ```
- **Response:** User information and authentication token
- **Authentication Required:** No

### Login
- **URL:** `/auth/login`
- **Method:** `POST`
- **Description:** Authenticate a user and receive a token
- **Payload:**
  ```json
  {
    "email": "string (valid email format)",
    "password": "string"
  }
  ```
- **Response:** Authentication token and user information
- **Authentication Required:** No

### Get Profile
- **URL:** `/auth/profile`
- **Method:** `GET`
- **Description:** Retrieve authenticated user's profile information
- **Response:**
  ```json
  {
    "message": "Profile accessed successfully"
  }
  ```
- **Authentication Required:** Yes

## Products

### Get All Products
- **URL:** `/products`
- **Method:** `GET`
- **Description:** Retrieve a list of all products, optionally filtered by category
- **Query Parameters:**
  - `category` (optional): Filter products by category
- **Response:** Array of product objects
- **Authentication Required:** No

### Get Product by ID
- **URL:** `/products/:id`
- **Method:** `GET`
- **Description:** Retrieve detailed information about a specific product
- **URL Parameters:**
  - `id`: UUID of the product
- **Response:** Product object details
- **Authentication Required:** No

## Cart

### Get User Cart
- **URL:** `/cart`
- **Method:** `GET`
- **Description:** Retrieve the current user's shopping cart
- **Response:** User's cart with items
- **Authentication Required:** Yes

### Add Item to Cart
- **URL:** `/cart/add`
- **Method:** `POST`
- **Description:** Add a product to the user's shopping cart
- **Payload:**
  ```json
  {
    "productId": "string (UUID)",
    "quantity": "number (min: 1)"
  }
  ```
- **Response:** Updated cart information
- **Authentication Required:** Yes

### Update Cart Item
- **URL:** `/cart/:id`
- **Method:** `PUT`
- **Description:** Update the quantity of an item in the cart
- **URL Parameters:**
  - `id`: UUID of the cart item
- **Payload:**
  ```json
  {
    "quantity": "number (min: 1)"
  }
  ```
- **Response:** Updated cart information
- **Authentication Required:** Yes

### Remove Item from Cart
- **URL:** `/cart/:id`
- **Method:** `DELETE`
- **Description:** Remove a specific item from the cart
- **URL Parameters:**
  - `id`: UUID of the cart item
- **Response:** Updated cart information
- **Authentication Required:** Yes

### Clear Cart
- **URL:** `/cart`
- **Method:** `DELETE`
- **Description:** Remove all items from the user's cart
- **Response:** Confirmation of cart clearing
- **Authentication Required:** Yes

## Orders

### Create Order
- **URL:** `/orders`
- **Method:** `POST`
- **Description:** Create a new order using the items in the user's cart
- **Payload:**
  ```json
  {
    "shippingAddress": "string",
    "paymentMethod": "string"
  }
  ```
- **Response:** Order details
- **Authentication Required:** Yes

### Get User Orders
- **URL:** `/orders`
- **Method:** `GET`
- **Description:** Retrieve a list of all orders placed by the current user
- **Response:** Array of user's orders
- **Authentication Required:** Yes

### Get Order by ID
- **URL:** `/orders/:id`
- **Method:** `GET`
- **Description:** Retrieve detailed information about a specific order
- **URL Parameters:**
  - `id`: UUID of the order
- **Response:** Order details
- **Authentication Required:** Yes

## Base Endpoints

### Root Endpoint
- **URL:** `/`
- **Method:** `GET`
- **Description:** Simple hello message from the API
- **Response:** Hello message
- **Authentication Required:** No

## Product Seeding

The application automatically seeds the database with sample products if no products exist when the server starts.

### Sample Products

The following products are seeded on application startup:

1. **Smartphone X**
   - Description: Latest smartphone with advanced features
   - Price: $999.99
   - Category: Electronics
   
2. **Running Shoes**
   - Description: Comfortable running shoes for professional athletes
   - Price: $129.99
   - Category: Sports
   
3. **Coffee Maker**
   - Description: Automatic coffee maker with timer
   - Price: $89.99
   - Category: Home
   
4. **Laptop Pro**
   - Description: High-performance laptop for professionals
   - Price: $1499.99
   - Category: Electronics
   
5. **Wireless Earbuds**
   - Description: Premium wireless earbuds with noise cancellation
   - Price: $199.99
   - Category: Electronics

### Seeding Logic

- Product seeding occurs automatically on application startup
- Seeding is skipped if products already exist in the database
- Seeding logs are visible in the server console

## Authentication

All endpoints that require authentication expect a valid authentication token in the Authorization header. The token can be obtained through the login endpoint.

Format: `Authorization: Bearer <token>` 