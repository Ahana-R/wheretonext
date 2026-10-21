# 📒 My Travel Planner Notes

## 🍽️ The big picture (the restaurant)
- **Client** (React, port 5173) = dining area. What the user sees.
- **Server** (Express, port 3001) = kitchen. Talks to the AI, hides the key.
- **Proxy** (in vite.config.js) = messenger who carries `/api` orders to the kitchen.
- **Port** = door number on my computer.

## 🔐 Security
- API key lives ONLY in `server/.env`. Never in React, never on GitHub.
- `.gitignore` = "do not upload" list → `node_modules` and `.env`.
- Leaked a key? Delete it in console.anthropic.com and make a new one.

## 🤖 Talking to Claude
- `system` = job description (personality + rules). User never sees it.
- `messages` = the actual question. `role: "user"` = us talking.
- Prompt template = question with blanks → `` `Plan a ${days}-day trip to ${destination}` ``
- `max_tokens` = maximum length of the answer. Pay only for what's used, so set it high (16000).
- `stop_reason` = why it stopped:
  - `end_turn` ✅ finished
  - `max_tokens` ✂️ ran out of space
  - `refusal` 🙅 declined
- Answer = list of blocks → find the one with `type === "text"`.
- Claude THINKS before writing, and thinking uses tokens too (lesson from `max_tokens: 20` 😅).

## ⌨️ Streaming
- `.create()` = full thali at once 🍱 | `.stream()` = dishes one by one 🍛➡️🥗
- Server: `res.write(piece)` = send a piece, `res.end()` = done.
- Browser: `getReader()` + `reader.read()` in a `while` loop. `TextDecoder` turns bytes into text.
- Add to the old value: `setPlan((old) => old + piece)`

## 🍳 Express (server)
- `app.get("/path", (req, res) => {...})` = menu item
- `req.query` = details from the URL after `?`
- `res.json(...)` = send everything at once
- `res.status(400)` = user's mistake | `res.status(500)` = server's mistake
- `return` = stop here, don't continue
- `async` / `await` = "wait here until the slow thing finishes"
- `try { } catch (error) { }` = safety net 🎪

## ⚛️ React (client)
- `useState` = memory box. Change memory → screen updates.
- `fetch(url)` = place an order with the server
- `disabled={loading}` = stop button spam (and my money disappearing 💸)
- `{plan && (...)}` = show only if plan exists
- `condition ? A : B` = short if/else

## 🔧 Terminal & Git
- `cd folder` = go in | `cd ..` = go up one folder
- npm commands only work where there's a `package.json`!
- `node --watch index.js` = auto-restart server on save
- Ctrl + C = stop the running thing
- `git add .` → `git commit -m "message"` → `git push` = save point ☁️

## 🐛 Bugs I fixed (my hall of fame 🏆)
- `ERR_PACKAGE_PATH_NOT_EXPORTED` → typo in an import
- `Cannot read properties of undefined` → thing didn't exist (max_tokens too low)
- `Cannot GET /api/hello` → missing `/` in the route 🤦‍♀️
- `ENOENT package.json` → wrong folder
- `Failed to connect to port 3001` → server not running / crashed

## 💡 My own notes