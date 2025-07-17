# Flutter API Backend (Node.js + MySQL)

This project is a RESTful API built with Node.js, Express, and MySQL. It is designed to be used with a Flutter frontend.

- User registration and login (with bcrypt)
- Product CRUD operations
- JSON-based API endpoints

## 📁 Project Structure

project-root/
├── flutter-api-app/ # Flutter frontend
└── flutter-api-backend/ # Node.js backend

---

## 🎥 Full Demo

[![Watch the video]](https://youtu.be/MnVO_YBagnM)

---

## 🚀 Features

- RESTful API design
- Password hashing with bcrypt
- Connection pooling with MySQL2
- CORS support for frontend communication
- Organized and scalable code

---

## 🛠 Tech Stack

- Flutter
- Node.js
- Express.js
- MySQL (via mysql2/promise)
- bcrypt
- Postman (for testing)

---
## 📦 Installation

### 🔧 Requirements

- Node.js (v16+ recommended)
- MySQL Server
- Flutter SDK

### ⚙️ Steps

Follow these steps to get both the backend and frontend up and running.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/YOUR_USERNAME/flutter-api-backend.git
    cd flutter-api-backend
    ```

2.  **Backend Setup (Node.js)**
    *   Navigate to the backend directory:
        ```bash
        cd flutter-api-backend
        ```
    *   Install the required packages:
        ```bash
        npm install
        ```
    *   Start the server:
        ```bash
        npm start
        ```
    *   ✅ The API should now be running on `http://localhost:3000`.

3.  **Frontend Setup (Flutter)**
    *   In a **new terminal**, navigate to the frontend directory:
        ```bash
        cd flutter-api-app
        ```
    *   Get the Flutter packages:
        ```bash
        flutter pub get
        ```
    *   Run the app:
        ```bash
        flutter run
        ```
    *   📱 The Flutter application should now be running and communicating with the local backend.

## 📍 API Endpoints

A summary of the available REST API endpoints.

- To Create New Account
POST /api/users/register

- Insert for login 
POST /api/users/login

- Get all products
GET /api/products

- Create new product
POST /api/products 
