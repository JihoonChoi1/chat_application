# Talkative

Real-time one-on-one and group chat. Node/Express/Socket.IO backend, React (Vite) frontend.

## Stack

- **Backend**: Express, Mongoose (MongoDB), Socket.IO, JWT auth — `backend/`
- **Frontend**: React 18, Vite, Tailwind CSS v4, Socket.IO client — `frontend/`

## First-time setup

```bash
docker compose up -d        # starts a local MongoDB on :27017
npm install                 # backend deps
npm install --prefix frontend
cp backend/.env.example backend/.env   # then edit JWT_SECRET if you like
npm run seed                 # creates guest@example.com / jordan@example.com / sam@example.com (password: 123456)
```

## Running

```bash
npm run dev
```

This runs the API on `http://localhost:8000` and the Vite dev server on `http://localhost:5173` together. Open the frontend URL — API calls and WebSocket traffic are proxied to the backend automatically.

Log in with the seeded guest account (`guest@example.com` / `123456`, or use the "Use guest demo account" button) or sign up a new account.

## Production build

```bash
npm run build      # builds frontend/dist and installs backend deps
NODE_ENV=production npm start   # serves the built frontend from the Express server
```

## Environment variables (`backend/.env`)

| Variable      | Purpose                                      |
| ------------- | --------------------------------------------- |
| `PORT`        | Backend port (default `8000`)                 |
| `MONGO_URI`   | MongoDB connection string                      |
| `JWT_SECRET`  | Secret used to sign auth tokens                |
| `CLIENT_URL`  | Frontend origin, for Socket.IO CORS in prod    |
