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
## Okta Configuration
Go to Okta Dev [https://developer.okta.com] -> Sign up -> Sign In
Create Okta Application: Home Page -> Application -> Create App Intergration\
- Choose OIDC-OpenID Connect and Single-Page Application then Next
- App Intergration name: Your app name
- Set up Sign-in redirect URLs: [http://localhost:3000/login/callback]
- Set up Sign-out redirect URLs: [http://localhost:3000]
- Base URLs: [http://localhost:3000]
- Controlled access: Allow everyone in your organization to access
- Client ID: your-client-id
Create Profile Attributes: Home Page -> Profile Editor -> Your App User -> Add Attribute\
- Data Type: string
- Display name: UserType
- Variable name: userType
- Save
- Back to Profile Editor -> Mappings
- Choose Okta User to Your App
- Choose an attribute or enter expression -> Choose user.userType
- Click on the arrow -> Change it to Apply mapping on user create and update
- Save Mappings -> Apply update now
- Back to Profile Editor -> Mappings
- Choose Your App to Okta User
- Choose an attribute or enter expression -> Choose user.userType
- Click on the arrow -> Change it to Apply mapping on user create and update
- Save Mappings -> Apply update now
Create ADMIN account: Home Page -> People -> Add person\
- Fill the form
- Password: Set by admin -> Enter password
- Uncheck User must change password on first login
- Save to create Admin account
Set up Security: Home Page -> Security -> API\
- Issuer URL: your-issuer-url
- default -> claims -> Add Claim
- Name: sub -> Value: (appuser!=null) ? appuser.userName : app.clientId -> Create
- Name: userType -> Value: (appuser!=null) ? appuser.userType : app.clientId -> Create
- Trust Origin -> Add Origin -> Name: your-name -> Origin URL: [http://localhost:3000] -> Choose Cors and Redirect 
- Home Page -> People -> Admin User -> Profile -> Edit -> User type: admin

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
