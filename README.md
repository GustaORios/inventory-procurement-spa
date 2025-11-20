# 🪐 Saturn – Inventory & Procurement System

## Frontend Documentation & Backend Introduction Guide

Welcome to **Saturn**, a modern Inventory & Procurement management system built to simplify and optimize stock control, supplier relationships, and purchase order workflows for small and medium-sized businesses.

This document provides the backend team with all necessary context, structure, and technical expectations to begin developing the API that will power the system.

---

## 📘 Table of Contents
- [Project Overview](#-project-overview)
- [Core Objectives](#-core-objectives)
- [Tech Stack (Frontend)](#-tech-stack-frontend)
- [Project Repository](#-project-repository)
- [Project Structure](#-project-structure)
- [Local Setup Instructions](#-local-setup-instructions)
- [Required Backend Documentation](#-required-backend-documentation)

---

## 🚀 Project Overview

Saturn is a modern and intuitive Inventory & Procurement management system designed to replace outdated ERP modules and spreadsheet-based workflows commonly found in SMBs. The goal is to bring clarity, speed, and operational accuracy to the entire inventory and purchasing process.

The backend team will provide a scalable and reliable API that the frontend will consume to manage:

- Products
- Suppliers
- Purchase Orders
- Inventory information
- User access and role protection

---

## 🎯 Core Objectives

### ✔ Establish a Single Source of Truth
- All inventory data comes from one reliable system to minimize errors and discrepancies.

### ✔ Prevent Operational Mistakes
- Avoid overselling
- Ensure accurate stock levels
- Support location-based stock tracking
- Support batch/lot control

### ✔ Improve Operational Efficiency
The system streamlines workflows like:
- Creating purchase orders
- Updating products
- Managing suppliers
- Tracking stock changes

### ✔ Deliver a Smooth, Modern User Experience
- Intuitive enough for any employee to learn quickly.

---

## 🧰 Tech Stack (Frontend)

| Component      | Technology             |
|----------------|----------------------|
| Framework      | React 18             |
| Build Tool     | Vite                 |
| Styling        | Tailwind CSS         |
| State/Context  | React Context API    |
| Routing        | React Router v6      |
| Mock API       | JSON-Server (db.json)|

---

## 📦 Project references

The complete frontend project is available at:

[https://github.com/GustaORios/inventory-procurement-spa](https://github.com/GustaORios/inventory-procurement-spa)

## Trello ( SCRUM )
### https://trello.com/b/GtcULdx1/final-project

## Figma
### https://www.figma.com/design/Q8A98Tgxk8MdkHUI3OwMer/Untitled?node-id=0-1&p=f&t=aLHkcdaQ7HOwRdMw-0

> The backend team will create a separate repository for the API.

---

## 📁 Project Structure
src/
│
├── components/
│   ├── CreatePurchaseOrder.jsx
│   ├── DeleteIcon.jsx
│   ├── EditIcon.jsx
│   ├── Layout.jsx
│   ├── ProductForm.jsx
│   ├── ProtectedRoute.jsx
│   ├── RoleProtectedRoute.jsx
│   ├── Sidebar.jsx
│   ├── SuccessModal.jsx
│   └── SupplierForm.jsx
│
├── layouts/
│   └── DashboardLayout.jsx
│
├── pages/
│   ├── AddProduct.jsx
│   ├── AddSupplier.jsx
│   ├── DashboardLayout.jsx
│   ├── EditProduct.jsx
│   ├── EditSupplier.jsx
│   ├── Inventory.jsx
│   ├── Login.jsx
│   ├── PurchaseOrdersDetailPage.jsx
│   ├── PurchaseOrdersPage.jsx
│   ├── Settings.jsx
│   └── SuppliersPage.jsx
│
├── App.js
├── index.css
├── index.js
└── UserContext.js

🛠 Local Setup Instructions

Clone the repository

git clone https://github.com/GustaORios/inventory-procurement-spa.git
cd inventory-procurement-spa


Install dependencies

npm install


Run the development server

npm run dev


Run the mock API (JSON Server)

npm run server


This serves API data from db.json.
Once the backend is built, the frontend will switch to the live API.

## 📚 Required Backend Documentation

The backend team must provide three essential documents to ensure smooth integration:

## 1️⃣ Backend README (Architecture & Setup)

Should include:

API architecture overview

Tech stack (Node, NestJS, Express, etc.)

Folder structure

Authentication approach

Database technology

Setup instructions

Environment variables

Database initialization

Running migrations

Starting the backend server

Deployment details

Build commands

CI/CD notes

## 2️⃣ OpenAPI / Swagger – API Contract

### Defines how the frontend communicates with the backend. Must include:

All CRUD endpoints

Products

GET /products

GET /products/:id

POST /products

PUT /products/:id

DELETE /products/:id

Suppliers

GET /suppliers

GET /suppliers/:id

POST /suppliers

PUT /suppliers/:id

DELETE /suppliers/:id

Purchase Orders

GET /purchase-orders

GET /purchase-orders/:id

POST /purchase-orders

PUT /purchase-orders/:id

DELETE /purchase-orders/:id

Schemas (Request/Response)

Field types, required fields, and example objects

HTTP Status Codes

200, 201, 400, 401, 404, 500

Authentication

JWT (recommended)

## 3️⃣ Entity Relationship Diagram (ERD)

Represents the structure of the backend database.

### Required Entities:

Product

id

name

sku

brand

category

price

quantityInStock

supplierId

locationId

lastUpdated

Supplier

id

name

email

phone

address

vatNumber

PurchaseOrder

id

supplierId

products (list of items)

status

createdAt

updatedAt

User

id

name

email

role

passwordHash

Location

id

name

warehouse

aisle

shelf

Relationships

Supplier 1:N Products

Product N:M PurchaseOrders

User 1:N PurchaseOrders

Location 1:N Products

The ERD must be delivered as:

Image (PNG/JPG)

Editable source file (Figma)