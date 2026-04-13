# E-commerce Platform

A comprehensive, modular e-commerce solution comprising a robust Node.js/Express backend API and a modern React Vite administrative dashboard.

## 🚀 Tech Stack

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (via Mongoose)
*   **Caching & Message Broker:** Redis
*   **Queue Management:** BullMQ (for background jobs/workers)
*   **Validation:** Joi
*   **Authentication:** JWT (JSON Web Tokens) & bcrypt
*   **Security:** Helmet, CORS, Express-Rate-Limit
*   **Logging:** Winston, Morgan

### Frontend (Admin Dashboard)
*   **Framework:** React 18 (Bootstrapped with Vite)
*   **Routing:** React Router v6
*   **Icons:** Lucide React
*   **Authentication:** Custom AuthContext & AuthGuard components

### Infrastructure
*   Docker & Docker Compose (Containerized Node app, Redis, and MongoDB)

---

## 📁 Project Structure

This project follows a feature-based modular architecture for full scalability and separation of concerns.

```text
.
├── admin-dashboard/       # React Admin SPA
│   ├── src/
│   │   ├── components/    # Reusable UI components (Layout, AuthGuard)
│   │   ├── context/       # React Context (AuthContext)
│   │   └── pages/         # Dashboard, Login, Orders, Products, Users
├── src/                   # Node.js backend
│   ├── app.js             # Express app setup and global middlewares
│   ├── server.js          # App entry point
│   ├── config/            # Environment configurations
│   ├── middlewares/       # Global middlewares (Error handler, etc.)
│   ├── modules/           # Feature components: auth, orders, products, users
│   ├── queues/            # Queue definitions (BullMQ)
│   ├── workers/           # Background job processors
│   ├── services/          # Shared business logic
│   ├── scripts/           # Initialization scripts (e.g., createSuperUser)
│   └── utils/             # Helper utilities
├── .env.example           # Example environment variables
├── docker-compose.yml     # Local orchestration for app, mongo, redis
└── Dockerfile             # Node application Docker image configuration
```

---

## 🛠 Features

1.  **Authentication & Authorization:** Secure JWT-based Authentication with Role-Based Access Control protecting sensitive admin routes.
2.  **Product Management:** Full CRUD operations for the product catalog.
3.  **Order Processing:** Order lifecycle management with queue-based processing (BullMQ) for high concurrency and idempotency.
4.  **User Management:** Centralized management of platform customers and administrators.
5.  **Rate Limiting & Security:** Integrated Helmet and a global request rate-limiter mitigating abuse and preventing brute-force attacks.
6.  **Containerized Environment:** A full `docker-compose.yml` to spin up the API and its dependent databases instantly.
7.  **Admin Dashboard UI:** A secure React frontend shielded by private routes (`<AuthGuard>`), enabling seamless administrator interactions for managing shop operations.

---

## ⚙️ Getting Started

### Prerequisites

*   Node.js (v18+)
*   Docker & Docker Compose (For running via containers)
*   MongoDB & Redis (If running services locally outside of Docker)

### Environment Configuration

Before starting, copy the example environment template into a fresh `.env` file at the root.

```bash
cp .env.example .env
```

Update your `.env` variables if necessary:
*   `MONGO_URI`
*   `REDIS_URI`
*   `JWT_SECRET`
*   `EMAIL_HOST` and email credentials.

### 🐳 Running via Docker (Recommended for Backend)

The easiest way to initialize the backend API, MongoDB, and Redis is using Docker Compose.

```bash
# Builds the node application image and starts all services in detached mode
docker-compose up -d
```
The Backend API will be available on **http://localhost:9898** (mapped to container port 3000).

### 🏃 Running Locally (Development Mode)

If you prefer running services directly via Node:

**1. Start the Backend API**
```bash
# Install dependencies
npm install

# Start Nodemon listener
npm run dev
```

**2. Start the Frontend Admin Dashboard**
```bash
cd admin-dashboard

# Install React dependencies
npm install

# Start the Vite development server
npm run dev
```

The Dashboard will be available at the local Vite port configuration (default is often http://localhost:5173).

## 🗄 Core API Endpoints

The API is structured with base route `v1` standards:

*   **Auth Routes:** `/api/auth` (Login, Register)
*   **Product Routes:** `/api/products` 
*   **Order Routes:** `/api/orders`
*   **Users Management:** Handled within their respective protected module contexts.

*Detailed collections and schemas can be found within `src/modules/*`.*
