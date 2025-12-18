![App Logo](https://res.cloudinary.com/dq7qhhd0l/image/upload/v1764941872/tiap-main-logo_iftjew.png)

## **TIAP Server – Warehouse Exception Management System**

## **Description**
TIAP Server is a backend API designed for managing warehouse operations with a strong focus on exception handling, root cause tracking, and WMS flow simulation. The system includes role-based access, automated log creation, image handling, filtering, and analytics support.

---

## **Client & Server Repositories**
#### **[Client Repo](https://github.com/naimyasirozcan/tiap-app)**
#### **[Server Repo](https://github.com/naimyasirozcan/tiap-server)**

---

## **Technologies, Libraries & APIs Used**

### **Core**
- Node.js (18+)
- Express.js  
- MongoDB (Mongoose ODM)

### **Authentication & Security**
- JWT  
- bcryptjs  
- CORS  

### **Logging**
- Morgan

### **File Handling**
- Multer  
- Cloudinary API  

### **Other**
- Custom validation middleware  
- Log number generation utility  

---

## **Backlog Functionalities**
- Advanced search and filter improvements for dashboard  
- Extended analytics for departments and exception types  

---

# **Server Structure**

## **User Stories**
**All actions the system enables:**

- **Authentication**
  - Users can sign up, log in, and verify tokens.
- **Exception Management**
  - Users can create, view, update, and delete exception logs.
- **Root Cause Tracking**
  - Admin users can add or manage root causes.
- **WMS Simulation**
  - The system provides endpoints for orders, task collections, tasks, locations, and SKUs.
- **Employee Management**
  - SuperAdmins can manage employee accounts.
- **Image Upload**
  - Users can upload images for exception documentation.

---

## **API Routes Overview**

| Path | Method | Description |
|------|--------|-------------|
| /api/auth/signup | POST | Register new employee |
| /api/auth/login | POST | Login and retrieve token |
| /api/auth/verify | GET | Verify JWT |
| /api/exceptions | GET/POST | List or create exceptions |
| /api/exceptions/:id | GET/PUT/DELETE | Manage single exception |
| /api/root-causes | GET/POST | List or create root causes |
| /api/root-causes/:id | PUT/DELETE | Manage single root cause |
| /api/orders | GET | List orders |
| /api/orders/:id | GET | Single order |
| /api/task-collections | GET | List task collections |
| /api/tasks | GET | List tasks |
| /api/locations | GET | List locations |
| /api/skus | GET | List SKUs |
| /api/employees | GET | List employees |
| /api/uploads | POST | Image upload to Cloudinary |

---

## **Other Important Components**
- Global error handler  
- Log number generator utilities  
- Authentication and role-based authorization middleware  

---

## **Links**

### **Project**
- **Client Repository:** https://github.com/naimozcan/tiap-app  
- **Server Repository:** https://github.com/naimozcan/tiap-server  

### **Slides**
https://drive.google.com/file/d/17XfbTA0k-XnWR5mMsHag2n2y_nyqXMkR/view?usp=sharing
