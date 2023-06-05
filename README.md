# Shipping App

This is the backend for a small shipping app 

## Requirements

To run the app and tests, make sure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker (optional, for running the app in Docker)

## Getting Started

Follow the instructions below to set up and run the app.

1. Clone the repository:

````git clone <repository-url> ````

2. Navigate to the backend directory:

````cd shipping-backend ````

3. Install dependencies:

```npm install ```  or ``` yarn ```


4. Configure the database connection:
   - Open the `.env` file and update the database connection parameters as per your MySQL database setup.

> **Note** :
> Make sure that you create a database named `deliveries` before running the application.

### Run the App (Locally)
1. Navigate to shipping-backend directory
2. run `npm run start` or `yarn start`

### Running the App (Docker)

1. Make sure Docker is running on your machine.

2. Make sure to update your .env file accordingly to match the database set-up in `docker-compose.yml` File:
 ```
DB_HOST=db
DB_PASSWORD=root
DB_USERNAME=root
DB_NAME=deliveries
DB_PORT=3306
```

3. Build & serve:

Run the following command: 

```bash
 docker-compose up
 ```


> The app should now be running and accessible at [http://localhost:3000](http://localhost:3000).

### Running Tests

Follow the instructions below to run the tests.

1. Make sure that you have a file named `.test.env`
> **Important** :
> We highly recommend you create a seperate database for testing as we will clean up all database data on each test entry.
2. Run `npm run test` or `yarn test`

---
### API Documentation
1. Get all parcels :


```http 
GET /parcels
```
Returns a list of parcels sorted by Estonia first and DeliveryDate Ascending

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `description` | `string` | (optional) |
| `country` | `string` | (optional) |

2. Insert a parcel :


```http 
POST /parcels
```
Creates a Parcel.



| Parameter | Type | Description |
| :--- | :--- | :--- |
| `sku` | `string` | required, unique |
| `streetAddress` | `string` | required |
| `description` | `string` | required |
| `country` | `string` | required |
| `town` | `string` | required |
| `deliveryDate` | `string` | optional |

***Note***: we don't allow duplicate SKU 
