# tiap-server
TIAP is a MERN stack warehouse management exception handling application that integrates with WMS (Warehouse Management System) data to create, track, report, visualize, and manage product exceptions based on root causes.

# WMS Exception Handling System - Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Tech Stack](#tech-stack)
3. [System Enums](#system-enums)
4. [Database Schemas](#database-schemas)
5. [API Endpoints](#api-endpoints)
6. [Business Flow](#business-flow)
7. [Features](#features)
8. [Naming Conventions](#naming-conventions)

---

## System Overview

A comprehensive Warehouse Management System (WMS) focused on exception handling and root cause analysis for outbound operations. The system tracks damaged and missing items throughout the picking and packing process, providing full traceability and accountability.

---

## Tech Stack

### Backend
- **Database**: MongoDB with Mongoose ODM
- **Server Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcryptjs
- **File Storage**: Cloudinary (image uploads)
- **Logging**: Morgan
- **Cross-Origin**: CORS
- **Development Tools**: MongoDB Compass, Postman

### Frontend
- **Framework**: React
- **Routing**: React Router
- **State Management**: React Hooks

---

## System Enums

```javascript
const EMPLOYEE_TITLES = [
  "operator",
  "coach", 
  "team leader",
  "shift leader",
  "exception handler",
  "supervisor"
]

const EMPLOYEE_ROLES = [
  "user",        // Standard employee access
  "admin",       // Can manage root causes
  "superAdmin"   // Full system access
]

const EXCEPTION_STATUS = [
  "handled",        // Exception resolved
  "irrecoverable",  // Cannot be resolved
  "replaced",       // Item replaced from another location
  "backlog"         // Pending resolution
]

const EXCEPTION_TYPES = [
  "missing",   // Item not found/wrong location
  "damaged"    // Item physically damaged
]

const TASK_TYPES = [
  "picking",   // Retrieving items from storage
  "packing"    // Preparing items for shipment
]

const ZONES = [
  "AR"  // Active Reserve zone
]

const DEPARTMENTS = [
  "outbound"  // Outbound operations department
]

const LOCATION_PURPOSES = [
  "picking",    // Storage locations (AR###)
  "packing",    // Packing desks (PDR##)
  "exception"   // Exception holding areas (AX###)
]
```

---

## Database Schemas

### Employee Schema
```javascript
{
  _id: ObjectId,
  name: String (required),
  department: String (required, enum: DEPARTMENTS),
  title: String (required, enum: EMPLOYEE_TITLES),
  role: String (required, enum: EMPLOYEE_ROLES, default: "user"),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt)
}
```

**Indexes**: `email` (unique)

---

### Exception Schema
```javascript
{
  _id: ObjectId,
  no: String (required, unique, format: EXOYYYYMMDD000000E),
  receivedAs: String (required, e.g., "operation error"),
  order: ObjectId (required, ref: "Order"),
  createdAt: Date (required, default: Date.now),
  sku: ObjectId (required, ref: "SKU"),
  quantity: Number (required, min: 1),
  type: String (required, enum: EXCEPTION_TYPES),
  taskType: String (required, enum: TASK_TYPES),
  task: ObjectId (required, ref: "Task"),
  zone: String (required, enum: ZONES),
  location: ObjectId (required, ref: "Location"),
  rootcause: ObjectId (required, ref: "RootCause"),
  department: String (required, enum: DEPARTMENTS),
  
  // Conditional fields (active when status = "replaced")
  replacedFrom: ObjectId (ref: "Location"),
  exceptionLocation: ObjectId (ref: "Location"),
  
  // Financial tracking
  skuPrice: Number (required),
  totalCost: Number (required, calculated: skuPrice * quantity),
  
  // Accountability
  foundBy: ObjectId (required, ref: "Employee"),
  errorBy: ObjectId (required, ref: "Employee"),
  handledBy: ObjectId (required, ref: "Employee", restricted to: ["shift leader", "exception handler"]),
  
  status: String (required, enum: EXCEPTION_STATUS),
  image: String (optional, Cloudinary URL),
  notes: String (optional),
  taskCollection: ObjectId (required, ref: "TaskCollection")
}
```

**Indexes**: `no` (unique), `order`, `sku`, `status`, `createdAt`

---

### RootCause Schema
```javascript
{
  _id: ObjectId,
  task: String (required, enum: TASK_TYPES),
  type: String (required, enum: EXCEPTION_TYPES),
  title: String (required),
  createdAt: Date (default: Date.now),
  createdBy: ObjectId (ref: "Employee")
}
```

**Indexes**: Compound index on `task` + `type`

**Example Root Causes**:
- `{ task: "picking", type: "damaged", title: "Carton Box Torn by Picker" }`
- `{ task: "picking", type: "missing", title: "Item Picked to Wrong Container" }`
- `{ task: "packing", type: "damaged", title: "Plastic Bag Torn by Packer" }`

---

### SKU Schema
```javascript
{
  _id: ObjectId,
  no: String (required, unique, 6-digit format: "111456"),
  name: String (required),
  zone: String (required, enum: ZONES),
  price: Number (required, stored as string in mock data)
}
```

**Indexes**: `no` (unique)

---

### Location Schema
```javascript
{
  _id: ObjectId,
  name: String (required, unique, format: AR###/AX###/PDR##),
  zone: String (required, enum: ZONES),
  purpose: String (required, enum: LOCATION_PURPOSES),
  storedItems: [
    {
      sku: ObjectId (ref: "SKU"),
      totalQty: Number (total capacity),
      availableQty: Number (available for picking),
      occupiedQty: Number (reserved/in-process)
    }
  ],
  createdAt: Date,
  createdBy: ObjectId (ref: "Employee")
}
```

**Indexes**: `name` (unique), `purpose`, `zone`

**Note**: Packing and exception locations have `storedItems: null` or `[]`

---

### Task Schema
```javascript
{
  _id: ObjectId,
  no: String (required, unique, format: PIR/PAR + YYYYMMDD000000E),
  taskCollection: ObjectId (required, ref: "TaskCollection"),
  sku: ObjectId (required, ref: "SKU"),
  expectedQty: Number (required) OR quantity: Number (required),
  processedQty: Number (required) OR quantity: Number (required),
  location: ObjectId (required, ref: "Location"),
  startedAt: Date (required),
  completedAt: Date (required),
  status: String (default: "completed")
}
```

**Indexes**: `no` (unique), `taskCollection`, `sku`

---

### TaskCollection Schema
```javascript
{
  _id: ObjectId,
  order: ObjectId (required, ref: "Order"),
  type: String (required, enum: TASK_TYPES),
  zone: String (required, enum: ZONES),
  no: String (required, unique, format: OBRYYYYMMDD000000E),
  createdAt: Date (required),
  assignedAt: Date,
  startedAt: Date,
  completedAt: Date,
  employee: ObjectId (ref: "Employee")
}
```

**Indexes**: `no` (unique), `order`, `type`

---

### Order Schema
```javascript
{
  _id: ObjectId,
  no: String (required, unique, format: WONYYYYMMDD000000E),
  estimatedDeliveryTime: Date (required),
  receivedAt: Date (required),
  completedAt: Date
}
```

**Indexes**: `no` (unique), `receivedAt`, `completedAt`

---

## API Endpoints

### Authentication

#### POST `/api/auth/signup`
**Description**: Register a new employee account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@company.com",
  "password": "securePassword123",
  "department": "outbound",
  "title": "operator",
  "role": "user"
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "message": "Employee registered successfully",
  "employee": {
    "_id": "...",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### POST `/api/auth/login`
**Description**: Authenticate employee and receive JWT token

**Request Body**:
```json
{
  "email": "john.doe@company.com",
  "password": "securePassword123"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "employee": {
    "_id": "...",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "role": "user",
    "title": "operator"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Exceptions

#### GET `/api/exceptions`
**Description**: Retrieve all exceptions with optional filtering

**Query Parameters**:
- `order` - Filter by order number
- `sku` - Filter by SKU number
- `type` - Filter by exception type (missing/damaged)
- `taskType` - Filter by task type (picking/packing)
- `status` - Filter by status
- `foundBy` - Filter by employee who found the exception
- `errorBy` - Filter by employee who caused the error
- `handledBy` - Filter by employee who handled the exception
- `startDate` - Filter by creation date (start)
- `endDate` - Filter by creation date (end)
- `search` - Full-text search across exception number, notes
- `page` - Pagination page number (default: 1)
- `limit` - Results per page (default: 20)

**Response**: `200 OK`
```json
{
  "success": true,
  "count": 45,
  "page": 1,
  "totalPages": 3,
  "exceptions": [
    {
      "_id": "...",
      "no": "EXO20251126000001E",
      "order": { "no": "WON20251126000023E", ... },
      "sku": { "no": "111459", "name": "Dyson V11 Vacuum Cleaner", ... },
      "type": "damaged",
      "taskType": "picking",
      "status": "replaced",
      "totalCost": 499,
      ...
    }
  ]
}
```

---

#### GET `/api/exceptions/:id`
**Description**: Get detailed information for a specific exception

**Response**: `200 OK`
```json
{
  "success": true,
  "exception": {
    "_id": "6928681e7a3fb57efbd560ce",
    "no": "EXO20251126000001E",
    "receivedAs": "operation error",
    "order": {
      "_id": "692843077a3fb57efbd55f80",
      "no": "WON20251126000023E"
    },
    "sku": {
      "_id": "69283b207a3fb57efbd55f0a",
      "no": "111459",
      "name": "Dyson V11 Vacuum Cleaner",
      "price": 499
    },
    "type": "damaged",
    "taskType": "picking",
    "rootcause": {
      "_id": "6928814a7a3fb57efbd56112",
      "title": "Carton Box Torn by Picker"
    },
    "foundBy": {
      "name": "Lily Morgan",
      "email": "lily.morgan01@company.com"
    },
    "errorBy": {
      "name": "Mark Simpson",
      "email": "mark.simpson01@company.com"
    },
    "handledBy": {
      "name": "Naim Ozcan",
      "email": "naim.ozcan01@company.com"
    },
    "status": "replaced",
    "image": "https://res.cloudinary.com/...",
    "notes": "lily found a torn item...",
    ...
  }
}
```

---

#### POST `/api/exceptions`
**Description**: Create a new exception log

**Authorization**: Bearer token required

**Request Body**:
```json
{
  "orderNo": "WON20251126000023E",
  "skuNo": "111459",
  "quantity": 1,
  "type": "damaged",
  "taskType": "picking",
  "rootcauseId": "6928814a7a3fb57efbd56112",
  "foundByEmail": "lily.morgan01@company.com",
  "errorByEmail": "mark.simpson01@company.com",
  "handledByEmail": "naim.ozcan01@company.com",
  "status": "replaced",
  "replacedFromLocationName": "AR024",
  "exceptionLocationName": "AX032",
  "notes": "Item damaged during picking process",
  "image": "base64_encoded_image_or_cloudinary_url"
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "message": "Exception created successfully",
  "exception": {
    "_id": "...",
    "no": "EXO20251127000002E",
    ...
  }
}
```

---

#### PUT `/api/exceptions/:id`
**Description**: Update an existing exception

**Authorization**: Bearer token required

**Request Body**: (partial update supported)
```json
{
  "status": "handled",
  "notes": "Updated notes after resolution",
  "handledByEmail": "naim.ozcan01@company.com"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Exception updated successfully",
  "exception": { ... }
}
```

---

#### DELETE `/api/exceptions/:id`
**Description**: Delete an exception (superAdmin only)

**Authorization**: Bearer token required (superAdmin role)

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Exception deleted successfully"
}
```

---

### Root Causes

#### GET `/api/rootcauses`
**Description**: Retrieve all root causes with optional filtering

**Query Parameters**:
- `task` - Filter by task type (picking/packing)
- `type` - Filter by exception type (missing/damaged)

**Response**: `200 OK`
```json
{
  "success": true,
  "count": 24,
  "rootcauses": [
    {
      "_id": "6928814a7a3fb57efbd56112",
      "task": "picking",
      "type": "damaged",
      "title": "Carton Box Torn by Picker"
    },
    ...
  ]
}
```

---

#### GET `/api/rootcauses/:id`
**Description**: Get a specific root cause

**Response**: `200 OK`
```json
{
  "success": true,
  "rootcause": {
    "_id": "6928814a7a3fb57efbd56112",
    "task": "picking",
    "type": "damaged",
    "title": "Carton Box Torn by Picker",
    "createdAt": "2024-12-18T11:20:00.000Z"
  }
}
```

---

#### POST `/api/rootcauses`
**Description**: Create a new root cause (admin only)

**Authorization**: Bearer token required (admin/superAdmin role)

**Request Body**:
```json
{
  "task": "picking",
  "type": "damaged",
  "title": "Item Crushed During Transport"
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "message": "Root cause created successfully",
  "rootcause": {
    "_id": "...",
    "task": "picking",
    "type": "damaged",
    "title": "Item Crushed During Transport",
    "createdBy": "6928333b7a3fb57efbd55ee8"
  }
}
```

---

#### PUT `/api/rootcauses/:id`
**Description**: Update a root cause (admin only)

**Authorization**: Bearer token required (admin/superAdmin role)

**Request Body**:
```json
{
  "title": "Item Crushed During Transport to Packing"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Root cause updated successfully",
  "rootcause": { ... }
}
```

---

#### DELETE `/api/rootcauses/:id`
**Description**: Delete a root cause (admin only)

**Authorization**: Bearer token required (admin/superAdmin role)

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Root cause deleted successfully"
}
```

---

### Supporting Endpoints

#### GET `/api/orders/:orderNo`
**Description**: Validate and retrieve order information

**Response**: `200 OK`
```json
{
  "success": true,
  "order": {
    "_id": "692843077a3fb57efbd55f80",
    "no": "WON20251126000023E",
    "receivedAt": "2025-11-26T11:22:00.000Z",
    "completedAt": "2025-11-26T17:41:06.000Z"
  }
}
```

---

#### GET `/api/skus/by-order/:orderId`
**Description**: Get all SKUs associated with an order

**Response**: `200 OK`
```json
{
  "success": true,
  "skus": [
    {
      "_id": "69283b207a3fb57efbd55f0a",
      "no": "111459",
      "name": "Dyson V11 Vacuum Cleaner",
      "price": 499
    },
    ...
  ]
}
```

---

#### GET `/api/locations/with-sku/:skuId`
**Description**: Get all locations that contain a specific SKU

**Response**: `200 OK`
```json
{
  "success": true,
  "locations": [
    {
      "_id": "6928581b7a3fb57efbd56003",
      "name": "AR024",
      "zone": "AR",
      "purpose": "picking",
      "storedItems": [
        {
          "sku": "69283b207a3fb57efbd55f0a",
          "totalQty": 10,
          "availableQty": 7,
          "occupiedQty": 3
        }
      ]
    }
  ]
}
```

---

#### GET `/api/locations/exception`
**Description**: Get all exception holding locations

**Response**: `200 OK`
```json
{
  "success": true,
  "locations": [
    { "_id": "6928414b7a3fb57efbd55f58", "name": "AX032" },
    { "_id": "692841597a3fb57efbd55f59", "name": "AX033" },
    ...
  ]
}
```

---

#### GET `/api/employees/handlers`
**Description**: Get all employees eligible to handle exceptions (shift leaders and exception handlers)

**Response**: `200 OK`
```json
{
  "success": true,
  "employees": [
    {
      "_id": "6928333b7a3fb57efbd55ee8",
      "name": "Naim Ozcan",
      "email": "naim.ozcan01@company.com",
      "title": "exception handler"
    },
    ...
  ]
}
```

---

## Business Flow

### Order Fulfillment Process

```
1. ORDER RECEIVED
   └─> Order created in system
       └─> no: WON20251126000023E
       └─> receivedAt: 2025-11-26T11:22:00Z

2. PICKING PHASE
   └─> TaskCollection created (type: picking)
       └─> no: OBR20251127000001E
       └─> Tasks generated for each SKU in order
           ├─> Task 1: PIR20251127000001E (SKU: 111459)
           └─> Task 2: PIR20251127000002E (SKU: 111464)
   
   └─> TaskCollection assigned to employee
       └─> employee: Mark Simpson (operator)
       └─> assignedAt: 2025-11-26T14:02:00Z
   
   └─> Employee starts picking
       └─> startedAt: 2025-11-26T14:30:00Z
       └─> Completes Task 1 → 2025-11-26T14:35:02Z
       └─> Completes Task 2 → 2025-11-26T14:41:04Z
   
   └─> TaskCollection completed
       └─> completedAt: 2025-11-26T14:41:05Z

3. PACKING PHASE
   └─> TaskCollection created (type: packing)
       └─> no: OBR20251127000002E
       └─> Tasks generated for picked items
           ├─> Task 1: PAR20251127000016E (SKU: 111459)
           └─> Task 2: PAR20251127000017E (SKU: 111464)
   
   └─> TaskCollection assigned to employee
       └─> employee: Lily Morgan (coach)
       └─> assignedAt: 2025-11-26T16:50:00Z
   
   └─> Employee starts packing
       └─> startedAt: 2025-11-26T17:35:00Z
       └─> Completes Task 1 → 2025-11-26T17:37:02Z
       └─> Completes Task 2 → 2025-11-26T17:41:04Z
   
   └─> TaskCollection completed
       └─> completedAt: 2025-11-26T17:41:05Z

4. ORDER COMPLETED
   └─> completedAt: 2025-11-26T17:41:06Z
   └─> Ready for shipment
```

---

### Exception Handling Flow

```
EXCEPTION DETECTED
│
├─> STEP 1: Exception Discovery
│   └─> Employee finds damaged/missing item during task
│       └─> foundBy: Lily Morgan (coach)
│
├─> STEP 2: Initial Documentation
│   ├─> Select Order: WON20251126000023E
│   ├─> Select SKU: 111459 (Dyson V11 Vacuum Cleaner)
│   ├─> Exception Type: damaged
│   └─> Task Type: picking
│
├─> STEP 3: Root Cause Analysis
│   └─> Filter root causes by:
│       ├─> task = "picking"
│       └─> type = "damaged"
│   └─> Select: "Carton Box Torn by Picker"
│
├─> STEP 4: Auto-Population
│   ├─> System retrieves task ID from order + SKU + taskType
│   ├─> Retrieves taskCollection ID from task
│   ├─> Retrieves zone from location
│   ├─> Retrieves location from task
│   ├─> Calculates: totalCost = skuPrice × quantity
│   └─> Generates exception number: EXO20251126000001E
│
├─> STEP 5: Accountability Assignment
│   ├─> foundBy: lily.morgan01@company.com
│   ├─> errorBy: mark.simpson01@company.com
│   └─> handledBy: naim.ozcan01@company.com
│       └─> (restricted to shift leader/exception handler)
│
├─> STEP 6: Resolution Action
│   └─> Status: replaced
│       ├─> replacedFrom: AR024 (original location with SKU)
│       └─> exceptionLocation: AX032 (damaged item moved here)
│
├─> STEP 7: Documentation
│   ├─> notes: "lily found a torn item, we discussed..."
│   ├─> image: Upload to Cloudinary
│   └─> CREATE exception record
│
└─> STEP 8: Exception Created
    └─> Exception logged in system
    └─> Available for reporting and analysis
```

---

## Features

### Frontend Pages

#### 1. **Signup Page** (`/signup`)
- New employee registration
- Form validation for all required fields
- Email uniqueness check
- Password hashing before storage

#### 2. **Login Page** (`/login`)
- Employee authentication
- JWT token generation
- Persistent session management
- Role-based redirect after login

#### 3. **Exceptions List** (`/exceptions`)
**Features**:
- Display all exceptions in tabular format
- Real-time search across all fields
- Advanced filtering:
  - By order number
  - By SKU
  - By exception type (missing/damaged)
  - By task type (picking/packing)
  - By status
  - By date range
  - By employees (found/error/handled)
- Pagination (20 records per page)
- Sort by date, cost, status
- Export functionality (CSV/Excel)
- Quick view modal for exception details
- Click row to navigate to detail page

#### 4. **New Exception** (`/exceptions/new`)
**Dynamic Form Flow**:

**Step 1: Order Selection**
- Input: Order number
- Validation: Order must exist in system
- On valid order: Enable next fields
- On invalid order: Show error, disable form

**Step 2: SKU Selection**
- Dropdown: Auto-populated with SKUs from selected order
- Displays: SKU number, name, price
- On selection: Auto-fill sku price field

**Step 3: Exception Type**
- Radio buttons: Missing / Damaged
- Required field

**Step 4: Task Type**
- Radio buttons: Picking / Packing
- Required field
- Triggers root cause filter update

**Step 5: Root Cause Selection**
- Dropdown: Filtered by task type + exception type
- Example: If picking + damaged → show only picking/damaged causes
- Displays: Root cause title

**Step 6: Auto-filled Fields** (Read-only)
- Task ID
- TaskCollection ID
- Zone
- Location
- SKU Price
- Total Cost (quantity × price)

**Step 7: Quantity**
- Number input (min: 1)
- Triggers total cost recalculation

**Step 8: Status Selection**
- Dropdown: handled / irrecoverable / replaced / backlog
- If "replaced" selected:
  - Enable "Replaced From" dropdown
    - Shows locations containing the SKU
  - Enable "Exception Location" dropdown
    - Shows exception purpose locations (AX###)
- Otherwise: Disable these fields

**Step 9: Employee Assignment**
- Found By: Dropdown with all employees
- Error By: Dropdown with all employees
- Handled By: Dropdown with shift leaders & exception handlers only

**Step 10: Additional Information**
- Notes: Textarea (optional)
- Image Upload: Cloudinary integration (optional)
  - Preview before upload
  - Max 5MB size limit

**Step 11: Submit**
- Validate all required fields
- Show loading state
- On success: Redirect to exception details
- On error: Display error messages

#### 5. **Exception Details** (`/exceptions/:id`)
**View Mode**:
- Display all exception information
- Show order details (linked)
- Show SKU information with image
- Display task and taskCollection details
- Show location information
- Display all employee information with avatars
- Show root cause analysis
- Display uploaded image (if exists)
- Show timeline of events
- Financial impact summary

**Edit Mode** (conditional):
- Editable fields: status, notes, image, handled by
- Same dynamic form logic as New Exception
- Version history tracking
- Audit log of changes

#### 6. **Root Causes List** (`/rootcauses`)
**Access**: Admin and superAdmin only

**Features**:
- Display root causes as cards
- Group by task type (Picking / Packing)
- Sub-group by exception type (Missing / Damaged)
- Card displays:
  - Root cause title
  - Task type badge
  - Exception type badge
  - Created date
  - Edit/Delete buttons (edit mode only)
- Search functionality
- Toggle edit mode (shows edit/delete controls)

#### 7. **New Root Cause** (`/rootcauses/new`)
**Access**: Admin and superAdmin only

**Form Fields**:
- Task Type: Radio buttons (picking/packing)
- Exception Type: Radio buttons (missing/damaged)
- Title: Text input (required)
- Submit button

**Validation**:
- Title uniqueness check within task+type combination
- Minimum 5 characters
- No special characters except spaces and hyphens

---

### Core Features

#### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes on frontend and backend
- Token refresh mechanism
- Secure password hashing with bcrypt (10 rounds)

#### Dynamic Form Controls
- Conditional field enabling based on selections
- Auto-population of related data
- Real-time validation
- Cascading dropdown filters
- Field dependencies management

#### Data Relationships
- Automatic linking of:
  - Orders ↔ TaskCollections ↔ Tasks
  - Tasks ↔ Exceptions
  - SKUs ↔ Locations ↔ Exceptions
  - Employees ↔ Exceptions (multiple roles)
- Referential integrity enforcement

#### Search & Filter
- Full-text search across multiple fields
- Multi-criteria filtering
- Date range queries
- Logical operators (AND/OR)
- Search query persistence in URL

#### Image Management
- Cloudinary integration for image uploads
- Image optimization and transformation
- Secure URL generation
- Lazy loading on frontend
- Thumbnail preview generation

#### Financial Tracking
- Automatic cost calculation (price × quantity)
- Exception cost aggregation
- Cost reporting by:
  - Employee
  - Root cause
  - Time period
  - Department

#### Audit Trail
- Track who created/modified records
- Timestamp all operations
- Version history for exceptions
- Employee action logging

---

## Naming Conventions

### Entity Number Formats

| Entity | Format | Example | Description |
|--------|--------|---------|-------------|
| Order | `WONYYYYMMDD000000E` | `WON20251126000023E` | Warehouse Order Number |
| Exception | `EXOYYYYMMDD000000E` | `EXO20251126000001E` | Exception Number |
| TaskCollection | `OBRYYYYMMDD000000E` | `OBR20251127000001E` | Outbound Route Number |
| Picking Task | `PIRYYYYMMDD000000E` | `PIR20251127000001E` | Picking Route Number |
| Packing Task | `PARYYYYMMDD000000E` | `PAR20251127000016E` |
