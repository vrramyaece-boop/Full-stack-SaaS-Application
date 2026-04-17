🚀 Project Management SaaS

A subscription-based SaaS application with User and Admin panels, built using FastAPI and React.

📌 Features
User authentication (JWT)
Role-based access (User / Admin)
Project management
Subscription system (Free & Pro)
Stripe payment integration
Admin dashboard to monitor users & subscriptions

🧰 Tech Stack

Backend

FastAPI
SQLAlchemy / SQLModel
MySQL
Alembic
JWT Auth
Stripe

Frontend

React (Vite)
Tailwind CSS
React Router
Axios
Stripe.js
👤 User Features
Register & login
Create and manage projects
Free plan: max 3 projects
Pro plan: unlimited projects
Upgrade or cancel subscription
🛠️ Admin Features
View all users
View subscriptions
Monitor user activity
⚙️ Setup
Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
Frontend
cd frontend
npm install
npm run dev
🔑 Environment Variables

Create a .env file:

DATABASE_URL=
SECRET_KEY=

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
💳 Stripe
stripe listen --forward-to localhost:8000/subscriptions/webhook