# 🧠 Riddle Game Server (Node.js Vanilla)

This is a basic riddle game server built with **Node.js** using only **core modules** (no Express).  
It supports full **CRUD** operations for riddles and players using **file-based JSON databases**.

---

## 🚀 Getting Started

### 📦 Install
No dependencies required!  
Just make sure you have **Node.js v18+** installed.

### ▶️ Run the server
```bash
node app.js
```

Server will run on:  
`http://localhost:7000`

---

## 📁 Project Structure

```
.
├── app.js
├── db
│   ├── riddles.txt       # Riddle DB (JSON array)
│   └── players.txt       # Player DB (JSON array)
├── dal
│   └── fs.dal.js         # File read/write abstraction
├── routes
│   ├── riddles-routes.js # Riddle routes
│   └── player-routes.js  # Player routes
├── services
│   ├── riddels-services.js
│   └── players-services.js
├── utils
│   └── helpers.js
```

---

## 📚 Riddle API

| Method | URL                        | Description                |
|--------|----------------------------|----------------------------|
| GET    | `/riddles`                 | Get all riddles            |
| POST   | `/riddles/addRiddle`       | Add new riddle             |
| PUT    | `/riddles/updateRiddle`    | Update riddle by `id`      |
| DELETE | `/riddles/deleteRiddle`    | Delete riddle by `id`      |

### ➕ Add Riddle (POST)
```json
{
  "name": "New Riddle",
  "taskDescription": "What is 10 + 5?",
  "correctAnswer": "15"
}
```

### 🔁 Update Riddle (PUT)
```json
{
  "id": 2,
  "name": "Updated Name",
  "correctAnswer": "Updated Answer"
}
```

### ❌ Delete Riddle (DELETE)
```json
{ "id": 2 }
```

---

## 👤 Player API

| Method | URL                        | Description                     |
|--------|----------------------------|---------------------------------|
| GET    | `/players`                 | Get all players                 |
| POST   | `/players/addPlayer`       | Add a new player                |
| PUT    | `/players/updateTime`      | Update player's lowest time     |
| GET    | `/players/leaderboard`     | Get sorted leaderboard          |

### ➕ Add Player (POST)
```json
{
  "name": "Sarah"
}
```

### 🕒 Update Player Time (PUT)
```json
{
  "name": "Sarah",
  "time": 65
}
```

---

## 🏆 Leaderboard Example Response
```json
[
  { "name": "Sarah", "lowestTime": 65 },
  { "name": "David", "lowestTime": 70 }
]
```

---

## 📌 Notes

- All data is stored in `.txt` files as JSON arrays.
- Riddle IDs are generated automatically.
- Player names must be unique.
- Times are stored in seconds and sorted ascending in leaderboard.

---

## 🔒 No External Libraries
Everything is implemented using only:
- `http`
- `url`
- `fs/promises`

---

## ✅ Author
Built by your team using plain Node.js 🧩
