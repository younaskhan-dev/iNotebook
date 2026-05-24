# 📝 iNotebook – Secure MERN Notes App

A modern full-stack notes management application built with the **MERN Stack** that allows users to securely create, organize, edit, and manage notes with authentication, favorites, reminders, and rich text editing.

🔗 **Live Demo:** https://i-notebook-secure.vercel.app  
⚙️ **Backend API:** https://inotebook-production-6a57.up.railway.app

---

## ✨ Features

### 🔐 Authentication & Security

- User Signup & Login
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt
- Secure API authorization

### 📝 Notes Management

- Create notes
- Edit notes
- Delete notes
- Favorite notes
- Pin important notes
- Rich text editor support
- Search notes instantly

### ⏰ Reminder System

- Add reminders to notes
- Background reminder checker
- Reminder scheduling

### 👤 Profile Management

- Update profile details
- Upload profile image
- Cloud image storage

### 🎨 UI/UX

- Responsive dashboard
- Modern clean interface
- Mobile-friendly layout
- Smooth navigation

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router DOM
- Context API
- CSS / Custom Styling

## Backend

- Node.js
- Express.js

## Database

- MongoDB Atlas
- Mongoose

## Authentication

- JWT
- bcryptjs

## Image Upload

- Cloudinary

## Deployment

- **Frontend:** Vercel
- **Backend:** Railway

---

# 📁 Project Structure

```bash
iNotebook/
│
├── backend/
│   ├── db.js
│   ├── index.js
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
│
├── public/
├── src/
│   ├── components/
│   ├── context/
│   └── App.js
│
├── package.json
└── README.md
```

---

# 🚀 Installation

## Clone repository

```bash
git clone https://github.com/younaskhan-dev/iNotebook.git
cd iNotebook
```

---

## Install frontend dependencies

```bash
npm install
```

---

## Install backend dependencies

```bash
cd backend
npm install
```

---

# 🔑 Environment Variables

## Frontend `.env`

```env
REACT_APP_API_URL=your_backend_url
```

---

## Backend `.env`

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# ▶️ Run Locally

## Frontend

```bash
npm start
```

## Backend

```bash
cd backend
npm run dev
```

---

# 🌐 Deployment

### Frontend

Deployed on **Vercel**

### Backend

Deployed on **Railway**

### Database

Hosted on **MongoDB Atlas**

### Media Uploads

Handled via **Cloudinary**

---


# 👨‍💻 Author

**Younas Khan**

GitHub: https://github.com/younaskhan-dev  
LinkedIn: https://www.linkedin.com/in/younaskhanofficial/

---

# ⭐ Support

If you found this project helpful:

⭐ Star this repository  
🍴 Fork it  
📢 Share feedback