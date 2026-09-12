# 🍔 Mini Restaurant POS & Order Management System

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

A full-stack Point of Sale (POS) and inventory management system designed for small restaurants. Built with a robust **Laravel 11 REST API** backend and a highly responsive, modern **React + Vite** frontend.

## ✨ Features

- **🔐 Role-Based Access Control (RBAC):** Secure authentication utilizing Laravel Sanctum. Supports `Admin` (full access) and `Cashier` (limited POS access) roles.
- **🛒 POS Terminal:** A real-time, responsive checkout terminal preventing negative stock natively, with dynamic cart updating.
- **📦 Inventory & Stock Management:** Strict database transaction ledgers handling IN/OUT/ADJUSTMENT movements. Never worry about inventory math errors.
- **📋 Order Management:** End-to-end tracking of pending and completed orders. Securely process cancellations with automated stock restoration.
- **👥 Customer CRM:** Built-in customer management to track walk-ins vs regular diners.
- **📊 Business Analytics:** Visual dashboard and reporting suite mapping daily revenue, top-selling items, and total volume using Recharts.

---

## 🚀 Quick Start Guide

### Prerequisites
- PHP 8.2+
- Composer
- Node.js & npm
- MySQL / MariaDB (e.g., XAMPP)

### 1️⃣ Backend Setup (Laravel)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. Setup your environment:
   ```bash
   cp .env.example .env
   ```
4. Update your `.env` with your database credentials (e.g., if using XAMPP on port 3307):
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3307
   DB_DATABASE=restaurant_pos
   DB_USERNAME=root
   DB_PASSWORD=
   ```
5. Generate the app key and run migrations/seeders:
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   ```
6. Start the Laravel development server:
   ```bash
   php artisan serve
   ```
   *(The API will be available at `http://127.0.0.1:8000`)*

---

### 2️⃣ Frontend Setup (React)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env` file in the `frontend` folder with the following:
   ```env
   VITE_API_URL=http://127.0.0.1:8000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The React app will be available at `http://localhost:5173`)*

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Laravel 11.x
- **Database:** MySQL / MariaDB
- **Authentication:** Laravel Sanctum (Token-based)
- **Data Safety:** Atomic Database Transactions (`DB::transaction`) for strict stock/order integrity.

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** React Bootstrap 5
- **Routing:** React Router v6
- **HTTP Client:** Axios (with automated 401 Interceptors)
- **Charts:** Recharts

---

## 🛡️ Security Highlights
- Financial math (Subtotals, Discounts, Final Totals) is **never** calculated on the React frontend. It is completely protected and aggregated by Laravel.
- Stock integrity uses `lockForUpdate()` pessimistic locking preventing race conditions if two cashiers checkout the exact same item simultaneously.

---

*Made with ❤️ for efficient restaurant management.*