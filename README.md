✨ Features
✅ User Authentication

Login/Register with JWT

Protected routes for users/admins

✅ Feed Dashboard

View aggregated Reddit & Twitter posts

Save, share, and report posts

✅ Credit System

Track earned credits

Admin credit management

✅ Responsive Design

Works on mobile, tablet & desktop

🛠 Tech Stack
Category	Technology
Frontend	React.js 
Styling	Tailwind CSS 
Hosting	Firebase Hosting
📋 Prerequisites
Before starting, ensure you have:

Node.js v16+ (Download)

Firebase Account (Sign Up)

Backend API (Deployed on AWS)

💻 Local Setup
1. Clone the Repository
bash
git clone https://github.com/pusty1830/creatorhub-client
2. Install Dependencies
bash
npm install

3. Run the Development Server
bash
npm start
Access at: http://localhost:3000

🔥 Firebase Deployment
1. Install Firebase CLI
bash
npm install -g firebase-tools
2. Login to Firebase
bash
firebase login
3. Initialize Firebase Hosting
bash
firebase init hosting
Select:

Project: Create new or select existing

Public Directory: build (for React) 

Configure as SPA: Yes

Auto-build: No

4. Build for Production
bash
npm run build
5. Deploy to Firebase
bash
firebase deploy --only hosting
 app is now live at:
https://creatorhub-d29c9.web.app

