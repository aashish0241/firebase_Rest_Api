# Firebase REST API Authentication

This is a Node.js and Express-based REST API for Firebase Authentication, integrated with Firestore for managing user data. The API provides functionality for user registration, login, and profile management, while ensuring security using JWT (JSON Web Tokens).

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Features](#features)
4. [Setup](#setup)
5. [API Endpoints](#api-endpoints)
    - [POST /register](#post-register)
    - [POST /login](#post-login)
    - [GET /profile](#get-profile)
    - [PUT /profile](#put-profile)
6. [Firebase Configuration](#firebase-configuration)
7. [Security Considerations](#security-considerations)
8. [Error Handling](#error-handling)
9. [License](#license)

---

## Project Overview

This backend service uses Firebase Authentication to manage user registration and login, with Firebase Firestore storing user details. JWT tokens are used to secure authenticated endpoints, ensuring safe and efficient handling of user data.

---

## Technologies Used

- **Node.js** - Backend framework to build the REST API.
- **Express.js** - Web framework for handling HTTP requests.
- **Firebase Authentication** - Secure user registration and authentication.
- **Firestore** - NoSQL database for storing user details.
- **JWT (JSON Web Tokens)** - Token-based authentication for securing endpoints.

---

## Features

- **User Registration**: Allows users to create an account using email, phone number, and password.
- **Login**: Users can log in to their accounts using email and password.
- **Profile Management**: Users can view and update their profile details, excluding sensitive data (e.g., password).
- **JWT Authentication**: Secure API access using JWT tokens.
- **Error Handling**: Proper error handling for failed authentication or invalid data.

---

## Setup

### Prerequisites:
- Node.js and npm installed.
- Firebase project with Firebase Authentication and Firestore enabled.
- Firebase Admin SDK credentials (JSON key file).

### Steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/firebase-rest-api-auth.git
   cd firebase-rest-api-auth

Install dependencies:

bash
Copy code
npm install
Set up Firebase configuration:

Download the Firebase Admin SDK JSON file from your Firebase project.
Place the JSON file in the config folder and name it firebase-config.json.
Create a .env file in the root directory and add the following environment variables:

env
Copy code
FIREBASE_ADMIN_SDK_PATH=./config/firebase-config.json
JWT_SECRET=your_jwt_secret_key
Start the server:

bash
Copy code
npm start
The server will be running at http://localhost:5000.

API Endpoints
POST /register
Description: Registers a new user with email, password, and phone number.

Request Body:

json
Copy code
{
  "email": "user@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890",
  "name": "John Doe"
}
Response:

json
Copy code
{
  "message": "User registered successfully",
  "user_id": "user-id"
}
POST /login
Description: Logs in a user using their email and password and returns a JWT token.

Request Body:

json
Copy code
{
  "email": "user@example.com",
  "password": "password123"
}
Response:

json
Copy code
{
  "message": "Login successful",
  "token": "jwt-token-here"
}
GET /profile
Description: Retrieves the authenticated user's profile (excludes password).

Headers:

Authorization: Bearer <JWT_TOKEN>
Response:

json
Copy code
{
  "user_id": "user-id",
  "name": "John Doe",
  "email": "user@example.com",
  "phoneNumber": "+1234567890",
  "preferences": {
    "language": "English",
    "notifications": true
  },
  "status": "Active",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
PUT /profile
Description: Updates the authenticated user's profile (name, email, phone number).

Request Body:

json
Copy code
{
  "name": "John Updated",
  "email": "updatedemail@example.com",
  "phoneNumber": "+1234567899"
}
Response:

json
Copy code
{
  "message": "Profile updated successfully"
}
Firebase Configuration
Ensure your Firebase Admin SDK is correctly configured in your project. Place your firebase-config.json (Firebase Admin SDK JSON key file) inside the config folder and set up the environment variables correctly.

Security Considerations
JWT Token: Ensure that the JWT token used for authentication is stored securely (e.g., in HTTP-only cookies or Authorization header).
Data Validation: Always validate and sanitize user inputs to avoid SQL injection or other attacks.
Rate Limiting: Consider implementing rate-limiting to protect the API from abuse (e.g., brute-force attacks).
Access Control: Ensure that authenticated routes properly verify JWT tokens and handle user permissions appropriately.
Error Handling
All errors are returned in a standard format:

json
Copy code
{
  "error": "Error message",
  "details": "Detailed error message if available"
}
400 - Bad request (e.g., invalid input or user data).
401 - Unauthorized (e.g., invalid or missing JWT token).
404 - Not found (e.g., user not found).
500 - Internal server error (e.g., database issues or unhandled exceptions).
License
This project is licensed under the MIT License - see the LICENSE file for details.

