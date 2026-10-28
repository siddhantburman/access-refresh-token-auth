# access-refresh-token-auth
# Access & Refresh Token Authentication

A secure user authentication system built with **Node.js, Express.js, MongoDB, and JWT (JSON Web Tokens)**. This project demonstrates how to implement user registration, login, logout, and token-based authentication using access tokens and refresh tokens.

## 🚀 Project Overview

The application allows users to create an account, log in securely, and access protected pages after authentication. Passwords are hashed using bcrypt, while JWT access and refresh tokens help manage authenticated sessions.

## ✨ Key Features

* **User Registration:** Create an account with name, email, and password.
* **User Login:** Authenticate users using their email and password.
* **Password Hashing:** Securely hash passwords using bcrypt.
* **JWT Authentication:** Use access tokens and refresh tokens to manage authentication.
* **Protected Routes:** Restrict access to authenticated users.
* **Token Refresh:** Generate a new access token using a valid refresh token.
* **Logout Functionality:** Clear authentication cookies and invalidate the stored refresh token.
* **Duplicate Email Validation:** Display an error message when an email address is already registered.
* **Cookie-Based Authentication:** Store authentication tokens in HTTP-only cookies.
* **EJS Templates:** Render dynamic pages using Embedded JavaScript templates.

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT)
* **Password Security:** bcrypt
* **Template Engine:** EJS
* **Middleware:** cookie-parser
* **Validation:** Zod

## 🎯 Learning Objectives

This project helps demonstrate practical knowledge of RESTful backend development, user authentication, password security, JWT token management, middleware, database operations, and protected routes.

## 👨‍💻 Author

**Siddhant Burman**

Computer Science & Engineering Student | Aspiring Full Stack Developer
