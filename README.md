# Database Configuration

## Overview
This document provides instructions for configuring the database for the project. The database used is MySQL.

## Prerequisites
- Install MySQL Server
- Install MySQL Workbench (optional, for GUI management)
- Ensure that the MySQL service is running

## Database Setup

Running Database Scripts

To set up the database schema, execute the SQL scripts in the Scripts folder in the following order:

React-Springboot-Add-Tables-Script-1.sql

React-Springboot-Add-Tables-Script-2.sql

React-Springboot-Add-Tables-Script-3.sql

React-Springboot-Add-Tables-Script-4.sql

React-Springboot-Add-Tables-Script-5.sql

Payment Script.sql


# Backend Configuration

The application uses **Okta** for OAuth2 authentication. Update the following properties in `src/main/resources/secrets.properties`:

```
okta.oauth2.client-id=your-okta-client-id
okta.oauth2.issuer=your-okta-issuer
```

The application uses **Stripe** for payment processing. Update the following properties in `src/main/resources/secrets.properties`:

```
stripe.key.secret=your-stripe-key-secret
```

The application uses **Cloudinary** for image storage. Update the following properties in `.env`:

```
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```


# Frontend Configuration
# Library Management Application Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Script

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
