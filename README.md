# SCHOLARO - Eligible Scholarship Finder

SCHOLARO is an intelligent, full-stack web application designed to help school and college students discover, match, and apply for verified government scholarship schemes across India.

---

## 🌟 Features

* **Multi-Step Eligibility Assessment**: Comprehensive 6-step form collecting personal, community, academic, performance, financial, and bank/DBT details.
* **Smart Matching Engine**: Automated compatibility scoring algorithm evaluating eligibility rules (residency, income limits, academic criteria, community category, gender, and backlogs).
* **Dual Student Support**: Custom eligibility workflows for both **School Students** (Class 6-12) and **College Students** (Undergraduate / Postgraduate).
* **Official Government Scheme Directory**: Filter and search through verified central and state (Tamil Nadu) government scholarship schemes.
* **Verified Application Links**: Direct, safe external redirection to official portal domains (`scholarships.gov.in`, `tnesevai.tn.gov.in`, `penkalvi.tn.gov.in`).
* **Document Verification Summary**: Tracks and validates required document uploads (Aadhaar, Marksheets, Income Certificates, Community Certificates, Bank Passbook).
* **Student Bookmarks**: Save preferred scholarships to personal dashboard for tracking.
* **Admin Portal**: Dashboard for managing scholarship schemes, viewing registered students, and controlling active listings.

---

## 🛠️ Tech Stack

### Frontend
* **Core**: React 18 (Vite build system)
* **Routing**: React Router v7
* **Icons**: Lucide React
* **Styling**: Vanilla CSS (Custom Design System with CSS Tokens)
* **HTTP Client**: Axios with request/response interceptors

### Backend
* **Runtime**: Node.js
* **Framework**: Express.js (v4)
* **Database Driver**: `mysql2` (Promise-based connection pool)
* **Authentication**: JSON Web Tokens (JWT) & `bcryptjs` password hashing
* **File Uploads**: `multer`

### Database
* **Engine**: MySQL 8.0+

---

## 📂 Project Structure

```text
SCHOLARO/
├── backend/
│   ├── config/           # MySQL Database connection configuration
│   ├── controllers/      # Request handlers for Auth, Student, Scholarship & Admin
│   ├── middleware/       # Auth JWT verification & Error handlers
│   ├── routes/           # Express API endpoints
│   ├── services/         # Eligibility matching algorithm service
│   ├── uploads/          # Uploaded document files
│   ├── utils/            # Helper utilities and URL sanitizers
│   ├── .env.example      # Environment variables template
│   ├── package.json      # Node.js backend dependencies
│   └── server.js         # Entry point for backend API server
├── database/
│   ├── schema.sql        # Database tables schema creation script
│   └── seed.sql          # Seed data with official government scholarships
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable UI components (Buttons, Inputs, Cards, etc.)
│   │   ├── context/      # Auth & Eligibility state providers
│   │   ├── pages/        # Application views (Eligibility steps, Results, Admin)
│   │   ├── services/     # API service methods
│   │   ├── utils/        # Utility helpers
│   │   ├── App.jsx       # Main App component & routes
│   │   └── main.jsx      # React DOM entry point
│   ├── .env.example      # Environment variables template
│   ├── package.json      # Frontend React dependencies
│   ├── vite.config.js    # Vite build & proxy setup
│   └── vercel.json       # Vercel SPA rewrite configuration
└── README.md             # Project documentation
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
Create a `.env` file inside the `backend/` folder based on `.env.example`:

```env
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=scholaro_db

# JWT Authentication Secret
JWT_SECRET=your_jwt_secret_key_here
```

### Frontend (`frontend/.env`)
Create a `.env` file inside the `frontend/` folder based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 How to Run Locally

### Prerequisites
* Node.js (v18 or higher)
* MySQL Server (v8.0 or higher)

### Step 1: Database Setup
1. Log into your local MySQL server:
   ```bash
   mysql -u root -p
   ```
2. Create the database and import schema and seed data:
   ```sql
   CREATE DATABASE scholaro_db;
   USE scholaro_db;
   SOURCE database/schema.sql;
   SOURCE database/seed.sql;
   ```

### Step 2: Backend Setup & Start
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file with your local MySQL password:
   ```bash
   cp .env.example .env
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will start on `http://localhost:5000`.

### Step 3: Frontend Setup & Start
1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will open on `http://localhost:3000`.

---

## 🛡️ License

This project is open source and available under the [ISC License](LICENSE).
