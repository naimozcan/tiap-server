# TIAP Server - Warehouse Exception Management System

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Backend API for TIAP (Tracking, Inspection, and Analysis Platform) - A comprehensive warehouse management system focused on exception handling, root cause analysis, and operational insights.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Data Models](#data-models)
- [API Documentation](#api-documentation)
- [Authentication & Authorization](#authentication--authorization)
- [Validation & Standards](#validation--standards)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)
- [Author](#author)
- [License](#license)

## 🎯 Overview

TIAP Server is a RESTful API built to manage warehouse operations with emphasis on exception logging and root cause analysis. The system simulates a complete WMS (Warehouse Management System) flow including orders, tasks, locations, and SKUs, while providing robust exception tracking capabilities.

**Key Capabilities:**
- Role-based access control (User, Admin, SuperAdmin)
- Exception logging with automatic log number generation
- Root cause analysis and tracking
- WMS flow simulation (Orders → Task Collections → Tasks → Locations)
- Image upload support via Cloudinary
- Comprehensive filtering and search capabilities
- Real-time dashboard statistics

## ✨ Features

### Core Functionality
- **Exception Management**: Create, read, update, and delete exception logs with full validation
- **Root Cause Analysis**: Define and track root causes by task type and exception type
- **WMS Simulation**: Complete order-to-task workflow with location management
- **User Management**: Employee accounts with role-based permissions
- **Image Handling**: Cloudinary integration for exception photo documentation
- **Advanced Filtering**: Query by date, status, type, and multiple parameters
- **Automatic Log Generation**: Standardized log numbers for exceptions following pattern `EXO{YEAR}{MONTH}{DAY}{SEQUENCE}E`

### Dashboard Analytics
- Monthly exception statistics
- Cost analysis per exception type
- Root cause distribution
- Department performance metrics

## 🛠 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs
- **File Upload**: Multer + Cloudinary
- **Security**: CORS
- **Logging**: Morgan
- **Validation**: Custom middleware with Regex patterns

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (v6 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

You'll also need:
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A [Cloudinary](https://cloudinary.com/) account for image uploads

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/naimyasirozcan/tiap-server.git
cd tiap-server
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the development server**
```bash
npm run dev
```

5. **Seed the database (optional)**
```bash
npm run seed
```

The server will start on `http://localhost:5005` by default.

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5005
ORIGIN=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/tiap-db

# Authentication
TOKEN_SECRET=your-super-secret-jwt-token-here

# Cloudinary Configuration
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET=your-cloudinary-api-secret
```

## 📊 Data Models

### Exception
```javascript
{
  no: String,              // Auto-generated: EXO20250101000001E
  receivedAs: String,      // "operation error" | "customer complaint"
  order: ObjectId,         // Reference to Order
  sku: ObjectId,           // Reference to SKU
  quantity: Number,
  type: String,            // "missing" | "damaged"
  taskType: String,        // "picking" | "packing"
  task: ObjectId,          // Reference to Task
  taskCollection: ObjectId,
  zone: String,
  location: ObjectId,
  rootcause: ObjectId,     // Reference to RootCause
  department: String,
  replacedFrom: String,
  exceptionLocation: String,
  skuPrice: Number,
  totalCost: Number,
  errorBy: String,
  foundBy: String,
  handledBy: String,
  status: String,          // "handled" | "irrecoverable" | "replaced" | "backlog"
  notes: String,
  image: String,           // Cloudinary URL
  createdAt: Date,
  updatedAt: Date
}
```

### RootCause
```javascript
{
  title: String,           // Description of the root cause
  task: String,            // "picking" | "packing"
  type: String,            // "missing" | "damaged"
  createdAt: Date,
  updatedAt: Date
}
```

### Employee
```javascript
{
  name: String,
  department: String,      // "outbound"
  title: String,           // "operator" | "coach" | "team leader" | etc.
  email: String,           // Follows pattern: name.surname01@company.com
  password: String,        // Hashed with bcrypt
  role: String,            // "user" | "admin" | "superAdmin"
  createdAt: Date,
  updatedAt: Date
}
```

### WMS Simulation Models

**Order**: Represents customer orders with standardized order numbers (`WON{YEAR}{MONTH}{DAY}{SEQUENCE}E`)

**TaskCollection**: Groups tasks for an order (`OBR{YEAR}{MONTH}{DAY}{SEQUENCE}E`)

**Task**: Individual picking/packing tasks (`PIR/PAR{YEAR}{MONTH}{DAY}{SEQUENCE}E`)

**Location**: Warehouse storage locations (e.g., `AR001`, `PDR050`, `AX100`)

**SKU**: Product information with 6-digit SKU numbers

## 📡 API Documentation

### Base URL
```
http://localhost:5005/api
```

### Authentication Endpoints

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "department": "outbound",
  "title": "operator",
  "email": "john.doe01@company.com",
  "password": "SecurePass123!"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe01@company.com",
  "password": "SecurePass123!"
}

Response:
{
  "message": "Token created successfully.",
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

### Exception Endpoints

#### Get All Exceptions
```http
GET /api/exceptions
Authorization: Bearer <token>

Query Parameters:
- type: "missing" | "damaged"
- status: "handled" | "irrecoverable" | "replaced" | "backlog"
- taskType: "picking" | "packing"
- createdAt: ISO Date (filters by day)
- rootcause: ObjectId
```

#### Create Exception
```http
POST /api/exceptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "receivedAs": "operation error",
  "order": "507f1f77bcf86cd799439011",
  "sku": "507f1f77bcf86cd799439012",
  "quantity": 2,
  "type": "damaged",
  "taskType": "picking",
  "task": "507f1f77bcf86cd799439013",
  "taskCollection": "507f1f77bcf86cd799439014",
  "zone": "AR",
  "location": "507f1f77bcf86cd799439015",
  "rootcause": "507f1f77bcf86cd799439016",
  "department": "outbound",
  "status": "handled",
  "foundBy": "john.doe01@company.com",
  "handledBy": "jane.smith02@company.com",
  "notes": "Item damaged during picking",
  "image": "https://res.cloudinary.com/..."
}
```

#### Update Exception
```http
PUT /api/exceptions/:_id
Authorization: Bearer <token>
Content-Type: application/json
```

#### Get Single Exception
```http
GET /api/exceptions/:_id
Authorization: Bearer <token>
```

#### Delete Exception
```http
DELETE /api/exceptions/:_id
Authorization: Bearer <token>
```

### Root Cause Endpoints

#### Get All Root Causes
```http
GET /api/root-causes
Authorization: Bearer <token>

Query Parameters:
- task: "picking" | "packing"
- type: "missing" | "damaged"
```

#### Create Root Cause
```http
POST /api/root-causes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Incorrect bin location",
  "task": "picking",
  "type": "missing"
}
```

#### Update Root Cause
```http
PUT /api/root-causes/:_id
Authorization: Bearer <token>
```

#### Delete Root Cause
```http
DELETE /api/root-causes/:_id
Authorization: Bearer <token>
```

### WMS Simulation Endpoints

#### Orders
```http
GET /api/orders
GET /api/orders/:_id
Query: ?no=WON20250101000001E
```

#### Task Collections
```http
GET /api/task-collections
GET /api/task-collections/:_id
Query: ?order=<orderId>&type=picking
```

#### Tasks
```http
GET /api/tasks
GET /api/tasks/:_id
Query: ?taskCollection=<id>&sku=<id>
```

#### Locations
```http
GET /api/locations
GET /api/locations/:_id
Query: ?skuId=<id>&purpose=picking
```

#### SKUs
```http
GET /api/skus
GET /api/skus/:_id
Query: ?no=156210
```

#### Employees
```http
GET /api/employees
GET /api/employees/:_id
PUT /api/employees/:_id
DELETE /api/employees/:_id
Query: ?email=john.doe01@company.com
```

### Image Upload

```http
POST /api/uploads
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- image: <file>

Response:
{
  "url": "https://res.cloudinary.com/tiap-app/image/upload/..."
}
```

## 🔒 Authentication & Authorization

### Role Hierarchy
- **User**: Can view exceptions and create exception logs
- **Admin**: All user permissions + create/edit root causes and manage exceptions
- **SuperAdmin**: All admin permissions + manage users and system settings

### Middleware
```javascript
verifyToken()       // Validates JWT token
verifyAdmin()       // Requires admin or superAdmin role
verifySuperAdmin()  // Requires superAdmin role
```

### Usage Example
```javascript
router.post("/exceptions", 
  verifyToken, 
  verifyAdmin, 
  async (req, res, next) => {
    // Only authenticated admins can access
  }
);
```

## ✅ Validation & Standards

### Email Format
```
Pattern: name.surname01@company.com
Regex: /^[a-z]+\.[a-z]+[0-9]{2}@[a-z]+\.com$/
```

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- No whitespace

### Log Number Formats

| Type | Pattern | Example |
|------|---------|---------|
| Exception | `EXO{YYYYMMDD}{SEQUENCE}E` | EXO20250101000001E |
| Order | `WON{YYYYMMDD}{SEQUENCE}E` | WON20250101000001E |
| Task Collection | `OBR{YYYYMMDD}{SEQUENCE}E` | OBR20250101000001E |
| Task (Picking) | `PIR{YYYYMMDD}{SEQUENCE}E` | PIR20250101000001E |
| Task (Packing) | `PAR{YYYYMMDD}{SEQUENCE}E` | PAR20250101000001E |

### Location Naming Convention
```
Prefixes: AR, PDR, AX, AC, AF, AL
Format: {PREFIX}{001-999}
Examples: AR001, PDR050, AX100
Regex: /^(AR|PDR|AX|AC|AF|AL)(?:00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})$/
```

### SKU Format
```
Format: 6-digit number
Example: 156210
Regex: /^\d{6}$/
```

## ⚠️ Error Handling

### Global Error Handler
All errors are caught and formatted consistently:

```javascript
{
  errorMessage: "Descriptive error message"
}
```

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Resource retrieved/updated |
| 201 | Created | New resource created |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid credentials |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

## 📁 Project Structure

```
tiap-server/
├── config/
│   └── cloudinary.js         # Cloudinary configuration
├── constants/
│   └── enums.js              # Validation patterns and enums
├── middlewares/
│   ├── auth.middlewares.js   # Authentication & authorization
│   └── util.middlewares.js   # Utility functions (log generation)
├── models/
│   ├── Employee.model.js
│   ├── Exception.model.js
│   ├── RootCause.model.js
│   ├── Order.model.js
│   ├── TaskCollection.model.js
│   ├── Task.model.js
│   ├── Location.model.js
│   └── SKU.model.js
├── routes/
│   ├── auth.routes.js
│   ├── exception.routes.js
│   ├── root-cause.routes.js
│   ├── employee.routes.js
│   ├── order.routes.js
│   ├── task-collection.routes.js
│   ├── task.routes.js
│   ├── location.routes.js
│   ├── sku.routes.js
│   ├── upload.routes.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## 🔧 Available Scripts

```bash
# Start development server with nodemon
npm run dev

# Start production server
npm start

# Run tests
npm test
```

## 🚢 Deployment

### Environment Setup
Ensure all environment variables are properly configured for production:
- Use a production MongoDB instance
- Generate a strong TOKEN_SECRET
- Configure CORS for your frontend domain

### Recommended Hosting
- **Backend**: Railway, Render, Heroku, or AWS
- **Database**: MongoDB Atlas
- **Images**: Cloudinary

## 👨‍💻 Author

**Naim Yasir Ozcan**

- LinkedIn: [linkedin.com/in/naimyasirozcan](https://linkedin.com/in/naimyasirozcan)
- GitHub: [@naimyasirozcan](https://github.com/naimyasirozcan)
- Backend: [tiap-server](https://github.com/naimyasirozcan/tiap-server)
- Frontend: [tiap-app](https://github.com/naimyasirozcan/tiap-app)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- **Frontend Repository**: [TIAP App](https://github.com/naimyasirozcan/tiap-app) - React-based user interface with Tailwind CSS

## 📞 Support

For questions, issues, or feature requests:
- Open an issue on [GitHub](https://github.com/naimyasirozcan/tiap-server/issues)
- Contact via [LinkedIn](https://linkedin.com/in/naimyasirozcan)

---

**Built with ❤️ using Node.js, Express, and MongoDB**
