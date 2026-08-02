# CardFlow — Enterprise Credit Card Management Platform

An enterprise-grade, production-quality full-stack **Credit Card Management Platform** designed for high-throughput security, modern user experience, automated testing, and scalable cloud deployment.

Built with **Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT, Zod, Helmet, Morgan, Swagger, Jest, Supertest, React 18, Vite, Tailwind CSS, TanStack Query, Recharts, Docker, and Nginx**.

---

## 📐 System Diagrams

### 1. Database Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ REFRESH_TOKEN : "owns"
    USER ||--o{ CARD : "owns"
    USER ||--o{ TRANSACTION : "makes"
    USER ||--o{ PAYMENT : "submits"
    USER ||--o{ REWARD : "redeems"
    USER ||--o{ NOTIFICATION : "receives"
    CARD ||--o{ TRANSACTION : "processes"
    CARD ||--o{ PAYMENT : "receives"

    USER {
        string id PK
        string email UK
        string password
        string firstName
        string lastName
        enum role "CUSTOMER | ADMIN"
        boolean isSuspended
        datetime createdAt
    }

    CARD {
        string id PK
        string userId FK
        string cardNumber UK
        string cardHolder
        enum cardType "PLATINUM | GOLD | TITANIUM | BLACK_EDITION"
        string expiryDate
        string cvv
        float creditLimit
        float availableCredit
        float outstandingBalance
        enum status "ACTIVE | FROZEN | BLOCKED"
        enum applicationStatus "PENDING | APPROVED | REJECTED"
    }

    TRANSACTION {
        string id PK
        string cardId FK
        string userId FK
        string merchant
        enum category "SHOPPING | DINING | TRAVEL | ENTERTAINMENT | UTILITIES | GROCERIES | HEALTH | OTHER"
        float amount
        enum status "COMPLETED | PENDING | FAILED"
        datetime date
    }

    REWARD {
        string id PK
        string userId FK
        string title
        string description
        string category
        int pointsRequired
        enum status "AVAILABLE | REDEEMED | EXPIRED"
    }

    REFRESH_TOKEN {
        string id PK
        string token UK
        string userId FK
        datetime expiresAt
        boolean revoked
    }
```

---

### 2. API Request Architecture & RBAC Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Client as React SPA (Vite)
    participant Helmet as Helmet Security
    participant RateLimit as Rate Limiter
    participant AuthGuard as authenticateJwt
    participant RoleGuard as authorizeRoles('ADMIN')
    participant Validator as Zod Middleware
    participant Controller as Express Controller
    participant Service as Domain Service
    participant Database as PostgreSQL (Prisma)

    Client->>Helmet: HTTP Request (Bearer JWT + Cookie)
    Helmet->>RateLimit: Validate Headers & CSP
    RateLimit->>AuthGuard: Verify Request Throttling
    AuthGuard->>RoleGuard: Verify Access Token Signature
    RoleGuard->>Validator: Verify User Role Permitted
    Validator->>Controller: Validate Request Body/Params
    Controller->>Service: Pass Sanitized Inputs
    Service->>Database: Execute Prisma SQL Transaction
    Database-->>Service: Return Query Result
    Service-->>Controller: Return Domain DTO
    Controller-->>Client: 200 OK Standardized JSON Output
```

---

## Technical Architecture & Design Rationale

### Tech Stack Selection & Justification

| Layer | Technology | Rationale & Portfolio Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18 + Vite** | Sub-millisecond HMR during development and optimized tree-shaken production bundles. |
| **Async State & Caching** | **TanStack Query (@tanstack/react-query)** | Declarative async state management with background refetching, cache invalidation, and mutation management. |
| **Data Visualization** | **Recharts** | Responsive SVG chart visualizations for spending trends, card usage, and user acquisition growth. |
| **Language** | **TypeScript (Strict)** | End-to-end type safety eliminating runtime type mismatches between frontend contracts and backend APIs. |
| **Styling** | **Tailwind CSS** | Custom glassmorphism UI tokens, responsive flex/grid layouts, dynamic focus rings, and dark theme palette. |
| **API Docs** | **Swagger / OpenAPI 3.0** | Interactive API documentation generated dynamically at `/api-docs`. |
| **Security & Logging** | **Helmet + Morgan + Rate Limiters** | HTTP security headers, request logging, and rate limiting against brute-force attacks. |
| **Testing** | **Jest + Supertest** | Automated unit & integration test suite verifying Auth, Card, and Transaction routes. |
| **Containerization** | **Docker & Docker Compose** | Multi-stage Docker builds orchestrating PostgreSQL, Express API, and Nginx frontend. |
| **Server Framework** | **Node.js + Express** | High-concurrency non-blocking I/O ideal for RESTful API orchestration. |
| **Database & ORM** | **PostgreSQL + Prisma** | ACID-compliant relational data engine coupled with type-safe schema declarations and automatic migration tracking. |
| **Authentication & RBAC**| **JWT + HttpOnly Cookies + Middleware** | Access Tokens (15m) paired with database-backed Refresh Tokens (7d) in HttpOnly cookies. `authorizeRoles('ADMIN')` protects admin endpoints. |

---

## Interactive API Documentation (Swagger)

When running the backend server locally or via Docker, visit:
👉 `http://localhost:5000/api-docs`

This provides an interactive OpenAPI 3.0 interface to execute endpoints directly from your browser.

---

## 🛠️ How to Deploy & Run Locally

### Option A: Running with Docker Compose (Recommended)

Make sure Docker and Docker Compose are installed on your machine.

```bash
# Clone and navigate to root directory
cd CreditCardManagementSystem

# Build and launch PostgreSQL, Express Backend, and Nginx Frontend
docker-compose up --build
```
- **Frontend App**: `http://localhost` (Port 80)
- **Backend API**: `http://localhost:5000/api/v1`
- **Swagger Docs**: `http://localhost:5000/api-docs`

---

### Option B: Running Locally (Node.js & PostgreSQL)

#### 1. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npm run prisma:seed    # Populate demo accounts, credit cards, transactions & rewards
npm run test           # Run Jest automated test suite
npm run dev            # Starts server at http://localhost:5000
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev            # Starts Vite dev server at http://localhost:5173
```

---

## Demo Credentials

- **System Administrator Account**:
  - **Email**: `admin@example.com`
  - **Password**: `AdminPass123!`
  - *Accesses Admin Command Center (`/admin/dashboard`)*

- **Customer Account**:
  - **Email**: `customer@example.com`
  - **Password**: `Password123!`
  - *Accesses Customer Dashboard (`/dashboard`)*

---

## 🚀 Render Cloud Deployment

The repository includes a `render.yaml` Blueprint specification for deployment to Render Cloud:

1. Connect your GitHub repository to Render.
2. Render will automatically detect `render.yaml` and provision:
   - A PostgreSQL database instance.
   - Node.js Express backend web service.
   - Static site frontend web service.
