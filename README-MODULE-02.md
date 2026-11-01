# InkSpace — Module 02: Backend Development

This project connects your original HTML/CSS blog frontend to a Node.js + Express REST API.

## What is included
- Express server and REST API
- Register/login with bcrypt password hashing
- JWT-based authentication
- Blog create, read, update and delete (CRUD) endpoints
- Server-side validation and ownership checks
- JSON-file storage for this backend module (Module 03 can replace it with MongoDB)
- Frontend updated to call the API instead of storing accounts/posts in localStorage

## Requirements
Install Node.js LTS and VS Code. Check in the VS Code terminal:
`node -v` and `npm -v`

## Run the backend
1. Open the `backend` folder in VS Code (File → Open Folder).
2. Open Terminal → New Terminal.
3. Run `npm install`
4. Copy `.env.example` to a new file named `.env`.
5. Open `.env` and change `JWT_SECRET` to a long random private string. Keep `.env` private; never upload it to GitHub.
6. Run `npm run dev` (or `npm start`).
7. You should see: `InkSpace API running at http://localhost:5000`
8. Open `http://localhost:5000/api/health` in your browser. It should return a status message.

## Run the frontend
The frontend must be served from a local web server (not opened by double-clicking index.html).
1. In VS Code, open the project root folder (the folder containing `index.html`).
2. Install the VS Code extension **Live Server** by Ritwick Dey, if it is not already installed.
3. Right-click `index.html` → **Open with Live Server**.
4. Keep the backend terminal running while using the website.
5. Register a new account, log in, create a story, edit it, and delete it.

If Live Server uses a port other than 5500, update `CLIENT_ORIGIN` in `backend/.env` to match the exact frontend origin, then restart the backend. Example: `http://127.0.0.1:5501`.

## API endpoints
Base URL: `http://localhost:5000/api`

| Method | Endpoint | Login required? | Purpose |
|---|---|---:|---|
| GET | `/health` | No | Check server |
| POST | `/auth/register` | No | Create user account |
| POST | `/auth/login` | No | Log in and receive JWT |
| GET | `/auth/me` | Yes | Get current user |
| GET | `/blogs` | No | List all stories |
| POST | `/blogs` | Yes | Create a story |
| PUT | `/blogs/:id` | Yes | Update your story |
| DELETE | `/blogs/:id` | Yes | Delete your story |

### Example registration request
```json
{ "name":"Asha", "email":"asha@example.com", "password":"example123" }
```
The API returns a user object and a JWT token. The frontend stores the token in localStorage and sends it as `Authorization: Bearer <token>` for protected requests.

## Test the API
Use the website forms, or use Postman:
- Register: POST `http://localhost:5000/api/auth/register`
- Login: POST `http://localhost:5000/api/auth/login`
- List blogs: GET `http://localhost:5000/api/blogs`
- Create blog: POST `http://localhost:5000/api/blogs` with a Bearer token

## Notes
- This module uses local JSON files as a simple persistence layer so you can focus on Express APIs. It is suitable for learning/local development, not production or multiple-server deployment.
- Module 03 should introduce a real database such as MongoDB.
- Do not commit `.env` or real passwords. Use a test password for your internship demo.
