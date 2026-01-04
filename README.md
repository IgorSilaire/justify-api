# Justify API

A REST API that **justifies text to 80 characters per line**.  
Built with **Node.js + TypeScript**

Live deployment on Render:  
https://justify-api-5syu.onrender.com/

Author: **Igor SILAIRE**  
igor.silaire@gmail.com

---

## Features

- Text justification to **80 columns**
- REST endpoint `/api/justify`
- **Token-based authentication**
- Per-token rate-limit: **80,000 words per day**
- HTTP error responses:
  - `400` – invalid request body
  - `401` – missing or invalid token
  - `402` – daily word quota exceeded

---

##  Endpoints

###  `POST /api/token`

Generates a token associated with an email.

**Request body (JSON):**
```json
{
  "email": "foo@bar.com"
}
```
**Response**
```json
{
  "token": "xxxxxxxx"
}
```

### `POST /api/justify`

Justifies text to 80-character lines.

**Headers**
```pgsql
Authorization: Bearer <TOKEN>
Content-Type: text/plain
```
**Body**
```nginx
word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word
```
**Response**
```arduino
<justified text> 
```

## Rate limiting

- **80,000 words per day per token**  
- When exceeded → **402 Payment Required**

---

##  Run locally

```bash
npm install
npm run dev
```

Server runs at: http://localhost:3000

## Production run

npm run build
npm start

## Test

npm test

- The test suite includes:
- token generation
- authentication validation
- text justification correctness
- 80-column constraint
- quota limit behavior
- edge cases

# Thanks for reading