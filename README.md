# MERN E-Commerce Platform 🛒

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)](https://www.mongodb.com/)

A **full-stack e-commerce application** built with **MERN (MongoDB, Express, React, Node.js)**.  
Users can browse products, manage carts, place orders, and admins can manage products and users.  

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Demo](#demo)
- [Installation](#installation)
- [Configuration](#configuration)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Features ✨

**User Features:**
- Sign up / Login with JWT authentication
- Browse products by category
- View product details
- Add products to cart
- Place orders
- View order history

**Admin Features:**
- Add / Update / Delete products
- Manage users
- View all orders

**Other Features:**
- Protected routes with role-based access
- Responsive UI
- Loading & error handling

---

## Tech Stack 🛠️

**Frontend:** React, React Router, Tailwind CSS / Bootstrap  
**Backend:** Node.js, Express.js  
**Database:** MongoDB / Mongoose  
**Authentication:** JWT (JSON Web Tokens)  
**Other:** Axios, Redux / Context API  

---

## Demo 🎬

**User Flow:**  
![User Demo](./assets/user-demo.gif)  

**Admin Dashboard:**  
![Admin Demo](./assets/admin-demo.gif)  

*(Replace GIFs with your project recordings)*

---

## Installation ⚡

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mern-ecommerce.git
cd mern-ecommerce
Backend setup

bash
Copy code
cd backend
npm install
Frontend setup

bash
Copy code
cd ../frontend
npm install
Start development servers

Backend:

bash
Copy code
cd backend
npm run dev
Frontend:

bash
Copy code
cd frontend
npm start
Configuration 🔧
Create a .env file in backend/:

env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
Ensure MongoDB is running locally or provide a cloud connection string (MongoDB Atlas).

Folder Structure 📂
csharp
Copy code
mern-ecommerce/
│
├── backend/
│   ├── config/        # DB connection & config
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Auth & error handling
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── seed/          # Sample data scripts
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
│
└── README.md
API Endpoints 📡
User Routes

POST /api/users/signup - Register a user

POST /api/users/login - Login user

GET /api/users/profile - Get user profile (Protected)

PUT /api/users/profile - Update profile (Protected)

Product Routes

GET /api/products - All products

GET /api/products/:id - Product by ID

POST /api/products - Create product (Admin)

PUT /api/products/:id - Update product (Admin)

DELETE /api/products/:id - Delete product (Admin)

Order Routes

POST /api/orders - Create order (Protected)

GET /api/orders/:id - Order by ID (Protected)

GET /api/orders - All orders (Admin)

Contributing 🤝
Contributions are welcome!

Fork the repository

Create a feature branch (git checkout -b feature-name)

Commit your changes (git commit -m "Add feature")

Push to the branch (git push origin feature-name)

Open a Pull Request

License 📄
This project is licensed under the MIT License - see the LICENSE file for details.
