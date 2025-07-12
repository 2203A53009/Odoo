# Odoo
# 🔄 Skill Swap Platform

A real-time **Skill Exchange Web Application** built for the **OODO Hackathon** by Team **PAIDAKULA SRIKANTH**, featuring a powerful admin system, user profile management, swap requests, feedback, and moderation — all powered by **MongoDB**.

---

## 👥 Team

- **PAIDAKULA SRIKANTH** – Team Leader
- **CHAKILAM SAMHITHA**
- **DIVYANSHU SHEKHAR**

---

## 🚀 Overview

The **Skill Swap Platform** enables users to **offer** and **request** skills in return. From Photoshop to Excel, users can find matches and mutually exchange knowledge based on availability. This app supports **real-time updates**, **admin control**, and a **rating system** for trusted skill exchange.

---

## 🧩 Features

### 👤 User Profiles
- Register/Login with email and password
- Profile includes: Name, Location, Profile Photo (optional)
- Add skills you **offer** and **want**
- Set **availability** (e.g., weekends, evenings)
- Make profile **public/private**

### 🔍 Discover & Connect
- Search users by skills (e.g., "React", "Java")
- Browse skill-based profiles
- Send and receive **Swap Requests**

### 🔄 Swap System
- Accept/Reject/Delete swap offers
- View **pending**, **active**, and **completed** swaps
- Give **ratings and feedback** after each swap

### 📊 Real-Time Functionality
- Instant updates for swap status
- Live rating calculations
- Realtime search and filtering

---

## 🔐 Authentication & Roles

- **JWT Authentication**
- **Role-based access control**
  - `User`
  - `Admin`
  - `Super Admin` (non-removable)
- **Plain text passwords** for simplicity (in demo only)

---

## 🛠️ Admin Features

### Super Admin
- **Email**: `2203a53009@sru.edu.in`
- **Password**: `Sri@123`

### Admin Panel
- Ban/Unban users
- Promote/Demote admins (Super Admin is protected)
- Review and delete inappropriate swaps or feedback
- View platform analytics
- Send global announcements

---

# Clone repository
git clone https://github.com/your-org/skill-swap-platform.git
cd skill-swap-platform

# Install dependencies
npm install

# Copy environment config
cp .env.example .env.local
# Add your MongoDB URI and JWT_SECRET inside .env.local

# Seed database
npm run seed

# Start development server
npm run dev


## 🧠 MongoDB Data Models

### Users (`users`)
```js
{
  _id,
  name,
  email,
  password, // plain text (for demo)
  location,
  profilePhoto,
  skillsOffered: [String],
  skillsWanted: [String],
  availability: [String],
  isPublic: Boolean,
  role: "user" | "admin" | "superadmin",
  isBanned: Boolean
}
