# 🚀 Multi-Tenant SaaS Platform

A production-ready multi-tenant SaaS application architecture built with **React, Node.js, PostgreSQL, and Docker**. This project demonstrates real-world data isolation, subscription management, and role-based access control (RBAC) similar to platforms like **Jira, Notion, and Shopify**.

---

## 🏗️ Architecture & Request Flow

The system utilizes a **Shared Database with Logical Isolation**. Every request is intercepted by middleware that extracts the `tenant_id` from the JWT, ensuring users can only interact with data belonging to their organization.



### The Security Pipeline:
1. **Identity:** JWT validation verifies the user is who they say they are.
2. **Authorization:** RBAC checks if the user's role (User/Admin) permits the action.
3. **Isolation:** The `tenant_id` is injected into every SQL query to prevent cross-tenant data leakage.

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | React.js, Tailwind CSS, Axios, React Context API |
| **Backend** | Node.js, Express, JSON Web Tokens (JWT) |
| **Database** | PostgreSQL (Relational with Tenant Indexing) |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## ✨ Key Features

- 🔐 **Secure Auth:** JWT-based authentication with secure session management.
- 🏢 **Multi-Tenancy:** Hardened data isolation using `tenant_id` foreign keys.
- 🛂 **RBAC:** Fine-grained permissions (Super Admin, Tenant Admin, Standard User).
- 📈 **SaaS Dashboard:** Real-time data visualization driven by backend analytics.
- 📦 **Subscription Limits:** Logic-gate restrictions for projects and user seats.
- 🐳 **Full Orchestration:** Single-command deployment via Docker.

---

## 👥 User Roles & Permissions

| Role | Capabilities |
|:---|:---|
| **Super Admin** | Manage and monitor all tenants and global system health. |
| **Tenant Admin** | Manage users, projects, and settings within their organization. |
| **User** | Standard access to projects and tasks within their assigned tenant. |

---

## 📂 Project Structure

```text
Multi-Tenant-SaaS/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API route definitions
│   │   ├── middleware/    # Auth, RBAC, and Tenant Isolation
│   │   ├── config/        # Database & Environment config
│   │   └── utils/         # Helper functions
│   └── migrations/        # SQL schema migrations
├── frontend/
│   ├── src/
│   │   ├── pages/         # Dashboard, Login, Projects
│   │   ├── layouts/       # Persistent UI structures
│   │   ├── components/    # Reusable UI widgets
│   │   └── api/           # Axios interceptors
├── docker-compose.yml     # Container orchestration
└── README.md

```

## How the system works
  React UI (Nginx)
     
  Node.js API (JWT + Role + Tenant validation)           
  
  PostgreSQL (Multi-tenant database)



---

## 🔐 Request Flow & Security

Every API request follows these steps:

1. Authenticated using **JWT**
2. Checked for **user role (RBAC)**
3. Restricted to the **correct tenant**
4. Operates only on **authorized data**

This ensures a **secure, scalable, and production-ready system**.

---

## ⚙️ Tech Stack

### Frontend
- React
- Nginx

### Backend
- Node.js
- Express.js
- JWT Authentication
- Role-Based Access Control (RBAC)

### Database
- PostgreSQL
- Multi-tenant schema design

### DevOps
- Docker
- Docker Compose

---

## ▶️ How to Run the Project

### Prerequisites
- Docker installed

### Run the application

docker compose up -d

Access the app

http://localhost:3000

## 🔑 Demo Login Accounts

| Role         | Email                  | Password   |
|--------------|-----------------------|------------|
| Super Admin  | superadmin@system.com | Admin@123  |
| Tenant Admin | admin@demo.com        | Demo@123   |
| User         | user1@demo.com        | User@123   |

**Tenant Subdomain:** `demo`


# Live dashboard

The dashboard shows live data from the database:

  -Total projects
  
  -Active tasks
  
  -Completed tasks
  
  -Team members
  
When a project or user is added, the numbers update automatically.
This proves the system is backend-driven and production-style.

# Screenshots:
  The detail UI can seen through the screenshots folder screenshots.
  ### Login Page
  ![Login](screenshots/login.png)

  ### Dashboard
  ![Dashboard](screenshots/dashboard.png)

  ### Projects
  ![Projects](screenshots/projects.png)

  ### Users
  ![Users](screenshots/users.png)

## Highlights

-Built a real-world multi-tenant SaaS architecture

-Implemented secure tenant isolation and RBAC

-Dockerized full-stack application with PostgreSQL

-Backend-driven dashboard with live data
