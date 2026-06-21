# PrepNext 📚

> Share notes. Find resources. Survive exams.

PrepNext is a student-built platform where you can upload and discover study materials — notes, cheat sheets, past year questions — all organized by subject. No more hunting through WhatsApp groups or asking seniors at 2am before an exam.

---

## What you can do

- **Upload resources** — Share links to notes, assignments, or PYQs so your peers don't have to start from scratch
- **Browse by subject** — Everything's organized by class (Operating Systems, System Design, etc.) so you find what you need fast
- **Bookmark for later** — Save resources to your personal dashboard and actually find them when exam week hits

---

## Tech Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | React + Vite + Tailwind CSS |
| Backend  | Node.js + Express           |
| Database | MongoDB (Mongoose)          |

---

## Running it locally

### 1. Clone the repo

```bash
git clone https://github.com/ronak3011/PrepNext.git
cd PrepNext
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Then start the server:

```bash
node server.js
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

The app should now be running at `http://localhost:5173`

---

## Contributing

Got ideas or found a bug? PRs are welcome. This is a student project — built for students, by a student.
