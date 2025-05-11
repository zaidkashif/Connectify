# 📱 Connectify

A full-stack social media application where users can register, log in, follow others, post content, like/comment on posts, and receive email notifications for key actions like registration and account deletion.

---

## 🔧 Project Setup

### 🌐 Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
````

### ⚙️ Backend (Node.js + Express + MongoDB)

```bash
cd backend
npm install
npm start
```

---

## ✨ Features

### 🔐 Authentication

* User registration (sends welcome email)
* Login / Logout
* Password reset via OTP (email-based)
* Account deletion (sends goodbye email)

### 🧑‍🤝‍🧑 Social Interactions

* Follow/unfollow users
* Like and comment on posts
* View others' posts

### 📝 Post Management

* Create posts (with location)
* Edit your own posts
* Delete your own posts

### 📍 Location Support

* Add location to posts

---

## 📬 Email Notifications

| Action               | Email Sent      |
| -------------------- | --------------- |
| Registration         | ✅ Welcome Email |
| Password Reset (OTP) | ✅ OTP Email     |
| Account Deletion     | ✅ Goodbye Email |

---

## 🧠 Tech Stack

* **Frontend**: React, Vite, Tailwind (optional)
* **Backend**: Node.js, Express
* **Database**: MongoDB
* **Email Service**: Nodemailer (Gmail)
* **Authentication**: JWT
* **Environment Variables**: `.env` file

---

## ⚠️ Environment Variables

Create a `.env` file in the root of your backend directory with the following:

```
MONGO_URI=your_mongodb_uri
PORT=5000
JWT_SECRET=your_jwt_secret
PASS=your_gmail_app_password
EMAIL=your_gmail_email
```

---

## 🚀 Author

**Mujtaba Ali**
*BS Software Engineering @ FAST NUCES*

---

## 📝 License

This project is for educational/demo purposes.

