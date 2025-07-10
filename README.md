# 📄 PaperTrail — Invoice Generator & Management System

**PaperTrail** is a full-stack invoice generation and management web app built for freelancers and businesses. It simplifies billing, enhances professionalism, and streamlines the process of creating, sending, and tracking invoices.

---

## 🚀 Features

- 🧾 Generate professional invoices with custom templates (PDF)
- 📬 Send invoices to clients via email
- 💳 Razorpay integration for seamless online payments
- 👤 Client management with GSTIN support
- 📦 CSV upload for bulk invoice creation
- 📊 Dashboard with invoice tracking & status updates
- 🛡️ Authenticated access with JWT-based login

---

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **TailwindCSS**
- **Radix UI**
- **React Router**
- **Axios**

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **html-pdf-node** (PDF generation)
- **SendGrid** (Emailing)
- **Razorpay** (Payment gateway)
- **Multer** + **csv-parser** (CSV handling)
- **Multer** + **Cloudinary** (Logo upload)
- **Dotenv**, **CORS**, **Body-parser**

---

## 🖼️ Screenshots

| Dashboard | Invoice Preview | Email with Payment Link |
|----------|------------------|--------------------------|
| ![Dashboard](https://github.com/Devarora13/PaperTrail/assets/.../dashboard.png) | ![Invoice](https://github.com/Devarora13/PaperTrail/assets/.../invoice.png) | ![Email](https://github.com/Devarora13/PaperTrail/assets/.../email.png) |

> Replace with actual screenshots if available.

---

## 🔧 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB URI
- SendGrid API Key
- Razorpay Key ID & Secret

---

### 1. Clone the repo

```bash
git clone https://github.com/Devarora13/PaperTrail.git
cd PaperTrail
