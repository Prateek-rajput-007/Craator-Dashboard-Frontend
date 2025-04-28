Creator Dashboard
A full-stack web application that enables creators to manage their profiles, earn credits, and interact with a personalized social media feed. Built with Node.js, Express.js, React.js, Tailwind CSS, MongoDB, and Redis, and deployed on Google Cloud Platform (GCP).
Features
User Authentication

Register/Login: Secure JWT-based authentication.
Role-Based Access: Supports User and Admin roles with restricted access to admin features.
Session Management: JWT tokens stored in Redis with 24-hour TTL for secure logout.

Credit Points System

Earn Credits:
Daily Login: 10 credits per day.
Profile Completion: Up to 100 credits (25 per field: name, bio, avatar, website).
Feed Interactions: 5 credits for saving a post, 3 credits for reporting a post.


Track Credits: Displayed on the user dashboard (Profile.jsx).
Admin Panel: View and update user credit balances (AdminPanel.jsx).

Feed Aggregator

Data Sources: Aggregates posts from JSON files simulating Twitter, Reddit, and LinkedIn APIs (due to API access limitations, static JSON files are used: twitter.json, reddit.json, linkedin.json).
Scrollable Feed: Displays posts sorted by date, with source, content, and author details.
User Interactions:
Save Content: Save posts to the user’s profile (stored in MongoDB).
Share Content: Copy post URL to clipboard (simulated sharing).
Report Posts: Flag inappropriate posts, marking them as reported in the database.


Caching: Redis caches feed data for 5 minutes to reduce file I/O and database queries.

Dashboard

User Dashboard (Profile.jsx):
Displays credit stats, saved posts, and recent activities (login, profile updates, post interactions).
Profile completion progress bar (0-100%) with visual feedback.
Edit profile with validation (name ≤ 50 chars, bio ≤ 200 chars, valid avatar URL/base64, valid website URL).
Logout functionality to invalidate Redis sessions.


Admin Dashboard (AdminPanel.jsx):
View all users’ email, role, and credits.
Update user credits with activity logging.
Monitor feed activity (e.g., saves, reports) with user details.


Redis Caching: User profiles and admin data cached for 10 minutes, invalidated on updates.

Extra Features

Redis Integration:
Caching for feed, user profiles, and admin data.
Session management with Redis-stored JWT tokens.
Rate limiting (5 login attempts/15 minutes, 100 API requests/minute).


Notification System: Toasts for actions (e.g., profile updated, post saved/reported, errors) using addToast in Profile.jsx.
Responsive UI: Tailwind CSS with dark mode, animations (animate.css), and hover effects.
Error Handling: Robust handling for invalid inputs, rate limits (HTTP 429), and session expiration (HTTP 401).

Deployment

Backend: Node.js + Express.js on Google Cloud Run.
Frontend: React.js + Tailwind CSS on Firebase Hosting.
Database: MongoDB Atlas for persistent storage.
Cache: Redis (local for development, managed service for production).

Project Structure
creator-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js         # MongoDB connection
│   │   │   ├── redis.js      # Redis client
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── feedController.js
│   │   │   ├── userController.js
│   │   │   ├── adminController.js
│   │   ├── data/
│   │   │   ├── twitter.json
│   │   │   ├── reddit.json
│   │   │   ├── linkedin.json
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── rateLimit.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   ├── Activity.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── feed.js
│   │   │   ├── user.js
│   │   │   ├── admin.js
│   │   ├── index.js           # Express server
│   ├── .env                 # Environment variables
│   ├── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Profile.jsx
│   │   │   ├── AdminPanel.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   ├── public/
│   ├── package.json
├── README.md

Prerequisites

Node.js (v16 or higher)
MongoDB Atlas account
Redis (local or managed service)
Google Cloud Platform account (for Cloud Run and Firebase Hosting)
Git and GitHub account

Running Locally
1. Clone the Repository
git clone https://github.com/your-username/creator-dashboard.git
cd creator-dashboard

2. Backend Setup

Navigate to the backend directory:cd backend


Install dependencies:npm install


Create a .env file in backend/:REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/your_database
PORT=5000


Replace MONGODB_URI with your MongoDB Atlas connection string.
Set a secure JWT_SECRET.


Install and start Redis:
Ubuntu: sudo apt-get install redis-server && redis-server
Mac: brew install redis && redis-server
Windows: Use WSL or Docker (docker run -d -p 6379:6379 redis).
Verify: redis-cli ping (should return PONG).


Start the backend:npm start


Server runs on http://localhost:5000.



3. Frontend Setup

Navigate to the frontend directory:cd frontend


Install dependencies:npm install


Start the development server:npm start


Frontend runs on http://localhost:3000.



4. Test the Application

Register/Login: Use http://localhost:3000 to register (POST /api/auth/register) or login (POST /api/auth/login).
User Dashboard: View profile, credits, and feed at http://localhost:3000/profile.
Admin Dashboard: Access admin panel (admin role required) to manage users and view feed activity.
Feed: Interact with posts (save, share, report) via GET /api/feed.
Redis: Verify caching (redis-cli KEYS *) and session management (session:<user_id>).

Deployment
Backend (Google Cloud Run)

Set Up Google Cloud Project:
Create a project in GCP Console.
Enable Cloud Run and Artifact Registry APIs.


Containerize Backend:
Create a Dockerfile in backend/:FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]


Build and test locally:docker build -t creator-dashboard-backend .
docker run -p 5000:5000 --env-file .env creator-dashboard-backend




Push to Artifact Registry:
Create a repository in Artifact Registry (gcr.io/<project-id>/creator-dashboard-backend).
Authenticate Docker:gcloud auth configure-docker


Tag and push:docker tag creator-dashboard-backend gcr.io/<project-id>/creator-dashboard-backend:latest
docker push gcr.io/<project-id>/creator-dashboard-backend:latest




Deploy to Cloud Run:
Deploy the image:gcloud run deploy creator-dashboard-backend \
  --image gcr.io/<project-id>/creator-dashboard-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "MONGODB_URI=<your_mongo_uri>,JWT_SECRET=<your_secret>,REDIS_HOST=<redis_host>,REDIS_PORT=<redis_port>,REDIS_PASSWORD=<redis_password>"


Note: Use a managed Redis service (e.g., Redis Labs, AWS ElastiCache) for production.



Frontend (Firebase Hosting)

Set Up Firebase:
Install Firebase CLI:npm install -g firebase-tools


Login and initialize:firebase login
cd frontend
firebase init hosting


Select your GCP project and set public to build.


Build and Deploy:
Build the frontend:npm run build


Deploy to Firebase Hosting:firebase deploy --only hosting


Update Firebase Hosting to point API requests to Cloud Run URL (e.g., https://<cloud-run-service>.run.app).



Database and Cache

MongoDB Atlas:
Create a cluster in MongoDB Atlas.
Update MONGODB_URI in .env or Cloud Run environment variables.


Redis:
Use a local Redis instance for development (redis-server).
For production, use a managed service (e.g., Redis Labs).
Update REDIS_HOST, REDIS_PORT, REDIS_PASSWORD in .env or Cloud Run.



Live Demo

Frontend: https://your-project.firebaseapp.com
Backend: https://your-service.run.app
GitHub: https://github.com/your-username/creator-dashboard

Evaluation Criteria

Functionality: All core features (auth, credits, feed, dashboard) are fully implemented and tested.
Code Quality: Modular structure with clear naming, separated concerns (controllers, routes, models), and error handling.
UI/UX: Responsive design with Tailwind CSS, dark mode, animations, and intuitive navigation.
GCP Deployment: Successfully deployed on Cloud Run (backend) and Firebase Hosting (frontend).
Extra Points:
Redis used for caching (feed, profiles, admin data) and session management.
Notification system via toasts for user actions and errors.



Troubleshooting

Redis Connection:
Verify Redis is running: redis-cli ping.
Check .env for correct REDIS_HOST, REDIS_PORT, REDIS_PASSWORD.


MongoDB Connection:
Ensure MONGODB_URI is correct and Atlas IP whitelist includes your server.


Rate Limiting:
If HTTP 429 errors occur, wait or adjust limits in src/middleware/rateLimit.js.


Frontend API Errors:
Verify backend URL in frontend API calls matches Cloud Run URL.
Check token validity for 401 errors.


Deployment Issues:
Ensure GCP APIs are enabled (Cloud Run, Artifact Registry, Firebase).
Check Cloud Run logs for environment variable or connection errors.



Future Improvements

Real APIs: Integrate actual Twitter, Reddit, LinkedIn APIs with OAuth.
Real-Time Updates: Use Redis Pub/Sub with WebSockets for live feed or credit updates.
Advanced Analytics: Add charts for user engagement in the admin panel.
Mobile App: Extend to a React Native app with the same backend.
