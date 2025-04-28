
# Creator Dashboard

A full-stack web application that enables creators to manage their profiles, earn credits, and interact with a personalized social media feed. Built with **Node.js**, **Express.js**, **React.js**, **Tailwind CSS**, **MongoDB**, and **Redis**, and deployed on **Google Cloud Platform (GCP)**.

## Features

### User Authentication
- **Register/Login**: Secure JWT-based authentication.
- **Role-Based Access**: Supports User and Admin roles with restricted access to admin features.
- **Session Management**: JWT tokens stored in Redis with a 24-hour TTL for secure logout.

### Credit Points System
- **Earn Credits**:
  - **Daily Login**: 10 credits per day.
  - **Profile Completion**: Up to 100 credits (25 per field: name, bio, avatar, website).
  - **Feed Interactions**: 5 credits for saving a post, 3 credits for reporting a post.
- **Track Credits**: Displayed on the user dashboard (`Profile.jsx`).
- **Admin Panel**: View and update user credit balances (`AdminPanel.jsx`).

### Feed Aggregator
- **Data Sources**: Aggregates posts from public APIs (Twitter, Reddit, LinkedIn) via their public endpoints. Static data files (`twitter.json`, `reddit.json`, `linkedin.json`) are used for demonstration purposes due to API access limitations.
- **Scrollable Feed**: Displays posts sorted by date, with source, content, and author details.
- **User Interactions**:
  - Save posts to the user’s profile (stored in MongoDB).
  - Copy post URL to clipboard (simulated sharing).
  - Flag inappropriate posts, marking them as reported in the database.
- **Caching**: Redis caches feed data for 5 minutes to reduce file I/O and database queries.

### Dashboard

- **User Dashboard (`Profile.jsx`)**:
  - Displays credit stats, saved posts, and recent activities (login, profile updates, post interactions).
  - Profile completion progress bar (0-100%) with visual feedback.
  - Edit profile with validation (name ≤ 50 chars, bio ≤ 200 chars, valid avatar URL/base64, valid website URL).
  - Logout functionality to invalidate Redis sessions.
  
- **Admin Dashboard (`AdminPanel.jsx`)**:
  - View all users’ email, role, and credits.
  - Update user credits with activity logging.
  - Monitor feed activity (e.g., saves, reports) with user details.

### Redis Caching
- User profiles and admin data are cached for 10 minutes and invalidated on updates.

### Extra Features
- **Redis Integration**: Caching for feed, user profiles, and admin data. Session management with Redis-stored JWT tokens. Rate limiting (5 login attempts/15 minutes, 100 API requests/minute).
- **Notification System**: Toast notifications for actions (e.g., profile updated, post saved/reported, errors) using `addToast` in `Profile.jsx`.
- **Responsive UI**: Tailwind CSS with dark mode, animations (animate.css), and hover effects.
- **Error Handling**: Robust handling for invalid inputs, rate limits (HTTP 429), and session expiration (HTTP 401).

## Deployment

- **Backend**: Node.js + Express.js on **Google Cloud Run**.
- **Frontend**: React.js + Tailwind CSS on **Firebase Hosting**.
- **Database**: MongoDB Atlas for persistent storage.
- **Cache**: Redis (local for development, managed service for production).

## Project Structure

```
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
```

## Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB Atlas** account
- **Redis** (local or managed service)
- **Google Cloud Platform** account (for Cloud Run and Firebase Hosting)
- **Git** and **GitHub** account

## Running Locally

1. **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/creator-dashboard.git
    cd creator-dashboard
    ```

2. **Backend Setup**
    - Navigate to the backend directory:
        ```bash
        cd backend
        ```
    - Install dependencies:
        ```bash
        npm install
        ```
    - Create a `.env` file in the `backend/` directory with the following:
        ```bash
        REDIS_HOST=localhost
        REDIS_PORT=6379
        REDIS_PASSWORD=
        JWT_SECRET=your_jwt_secret
        MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/your_database
        PORT=5000
        ```
    - Install and start Redis:
        - Ubuntu: `sudo apt-get install redis-server && redis-server`
        - Mac: `brew install redis && redis-server`
        - Windows: Use WSL or Docker (`docker run -d -p 6379:6379 redis`).
    - Start the backend:
        ```bash
        npm start
        ```
    - The backend will be available at `http://localhost:5000`.

3. **Frontend Setup**
    - Navigate to the frontend directory:
        ```bash
        cd frontend
        ```
    - Install dependencies:
        ```bash
        npm install
        ```
    - Start the frontend development server:
        ```bash
        npm start
        ```
    - The frontend will be available at `http://localhost:3000`.

4. **Test the Application**
    - **Register/Login**: Use `http://localhost:3000` to register (POST `/api/auth/register`) or log in (POST `/api/auth/login`).
    - **User Dashboard**: View profile, credits, and feed at `http://localhost:3000/profile`.
    - **Admin Dashboard**: Access the admin panel (admin role required) to manage users and view feed activity.
    - **Feed**: Interact with posts (save, share, report) via `GET /api/feed`.
    - **Redis**: Verify caching with `redis-cli KEYS *` and session management (`session:<user_id>`).

## Deployment

### Backend (Google Cloud Run)
1. **Set Up Google Cloud Project**
   - Create a project in GCP Console.
   - Enable Cloud Run and Artifact Registry APIs.

2. **Containerize Backend**
   - Create a `Dockerfile` in the backend:
     ```dockerfile
     FROM node:16
     WORKDIR /app
     COPY package*.json ./
     RUN npm install
     COPY . .
     EXPOSE 5000
     CMD ["npm", "start"]
     ```

3. **Build and Test Locally**
   ```bash
   docker build -t creator-dashboard-backend .
   docker run -p 5000:5000 --env-file .env creator-dashboard-backend
   ```

4. **Push to Artifact Registry**
   ```bash
   docker tag creator-dashboard-backend gcr.io/<project-id>/creator-dashboard-backend:latest
   docker push gcr.io/<project-id>/creator-dashboard-backend:latest
   ```

5. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy creator-dashboard-backend \
     --image gcr.io/<project-id>/creator-dashboard-backend:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars "MONGODB_URI=<your_mongo_uri>,JWT_SECRET=<your_secret>,REDIS_HOST=<redis_host>,REDIS_PORT=<redis_port>,REDIS_PASSWORD=<redis_password>"
   ```

### Frontend (Firebase Hosting)
1. **Set Up Firebase**
   ```bash
   npm install -g firebase-tools
   firebase login
   cd frontend
   firebase init hosting
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

3. **Update Firebase Hosting**
   - Update Firebase Hosting to point API requests to Cloud Run URL (e.g., `https://<cloud-run-service>.run.app`).
