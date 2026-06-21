# PrepNext

A platform built for students to easily share, discover, and organize study materials like notes, cheat sheets, and past year questions. 

## What it does
- **Resource Sharing**: Anyone can upload links to notes, assignments, or PYQs to help out their peers.
- **Organized by Subject**: Materials are categorized by specific classes (like Operating Systems, System Design, etc.) so finding exactly what you need is quick.
- **Bookmarks**: Save important resources to your personal dashboard so you don't lose track of them before exams.

## Tech Stack
- **Frontend**: React + Vite (styled with Tailwind CSS)
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)

## How to run it locally

1. Clone the repo -  git clone https://github.com/ronak3011/PrepNext.git

2. Set up the backend -  

cd backend
npm install
# You will need to create a .env file here with your MONGO_URI and JWT_SECRET
node server.js
   
3. Set up the frontend - 

cd ../frontend
npm install
npm run dev


4. Open the local host on your respective browser.
