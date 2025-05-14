# 📚 Library Management System

A full-stack library management application built with **Next.js (Frontend)** and **NestJS (Backend)**. This system supports user registration, book borrowing/returning, transaction history, and admin management.

---

## 🚀 Features

### ✅ User Side
- Register and login as a member
- Browse books with search and filters
- Borrow available books
- View dashboard insights (total borrowed, pending returns)
- View transaction history
- Return books

### 🛠️ Admin Side (planned or extensible)
- Add/update/delete books
- Manage users
- View system statistics

---

## 🧰 Tech Stack

| Layer      | Tech               |
|------------|--------------------|
| Frontend   | Next.js + TypeScript + Tailwind CSS |
| Backend    | NestJS + TypeScript |
| Database   | PostgreSQL (via Prisma ORM) |
| Auth       | JWT-based authentication |
| Styling    | Tailwind CSS |

---

## 📁 Folder Structure

Library_Management/</br>
├── backend/ # NestJS Backend (API, Prisma, Auth)</br>
├── frontend/ # Next.js Frontend (User UI)</br>
└── README.md

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally
- Yarn or npm
- Git

---

### 🔧 Backend Setup (NestJS)

1. Go to the backend folder:

```bash
cd Library_Management/backend
```
Install dependencies:

```bash
npm install
```
Set up environment variables:
Create a .env file:
```sh 
env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/library"
JWT_SECRET="your_jwt_secret"
```
Run Prisma migration:

```bash
npx prisma migrate dev --name init
```
Start the backend:

```bash
npm run start:dev
```
Server will run at http://localhost:4000.

### 🎨 Frontend Setup (Next.js)
Go to the frontend folder:

```bash
cd ../frontend
```
Install dependencies:

```bash
npm install
```
Environment variables:

Create a .env.local file:

env
```sh
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

App will run at http://localhost:3000.

## 🧪 Test Flow
✅ Sample User Flow:
Register as a new user.

Login with credentials.

### Go to Dashboard:

View your profile and borrowed books.

Check transaction history and return books.

### Go to Book Page:

Search and filter books.

Borrow available books.

### 🔐 Default Roles
member — regular user

admin — admin (can be seeded manually or added later)

### 📌 Note
All tokens are stored in localStorage.

This project is local-only and not deployed publicly.

The backend allows CORS for local development.

📃 License
This project is built for learning purposes.
