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

## 🚀 Features

- RESTful API design
- Password hashing with bcrypt
- Connection pooling with MySQL2
- CORS support for frontend communication
- Organized and scalable code

---

## 🛠 Tech Stack

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

1. **Clone the repo**

```bash
git clone https://github.com/YOUR_USERNAME/flutter-api-backend.git

2. **Setup Frontend and Backend**
### Backend Setup

```bash
cd flutter-api-backend
npm install
npm start

### Frontend Setup
cd flutter-api-app
flutter pub get
flutter run

API Endpoints

- To Create New Account
POST /api/users/register

- Insert for login 
POST /api/users/login

- Get all products
GET /api/products

- Create new product
POST /api/products 
