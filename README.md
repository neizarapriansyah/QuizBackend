# Backend Programming Template (2025)

## Development Setup

1. Fork and clone this repository to your local computer.
2. Open the project using VS Code.
3. Install the recommended VS Code extensions: `ESLint` and `Prettier`.
4. Copy and rename `.env.example` to `.env`. Open `.env` and change the database connection string.
5. Run `npm install` to install the project dependencies.
6. Run `npm run dev` to start the dev server.
7. Test the endpoints in the API client app.

## Add New API Endpoints

1. Create a new database schema in `./src/models`.
2. Create a new folder in `./src/api/components` (if needed). Remember to separate your codes to repositories, services, controllers, and routes.
3. Add the new route in `./src/api/routes.js`.
4. Test your new endpoints in the API client app.

# Gacha System API

REST API untuk sistem undian (gacha) menggunakan Node.js, Express.js, dan MongoDB.

## Base URL

`http://localhost:5000/api`

## Features

1. Sistem Gacha dengan weighted random berdasarkan sisa kuota
2. Limit maksimal 5x per user per hari
3. Hadiah dengan kuota terbatas
4. History gacha user (harian)
5. Daftar pemenang dengan nama disamarkan
6. Informasi sisa kuota hadiah

## Seeding Data Reward

Jalankan perintah berikut sekali saja untuk mengisi data reward awal di terminal:
`node src/seed.js`

⚠️Perhatian:Jangan menjalankan `seed.js` lebih dari sekali saat sistem sedang berjalan karena
akan mereset semua data `claimed` kembali ke 0.

# API Endpoints

## 1. Gacha

- Melakukan gacha untuk user
POST `http://localhost:5000/api/gacha`

Request Body (JSON):

{
  "userId": "string (ObjectId)"
}

Response:
{
  "status": "Win!" | "Lose!",
  "reward": "string | null"
}

Error Response (jika limit tercapai):
HTTP 429
{
  "message": "Limit 5x per hari"
}

## 2. History Gacha

- Menampilkan riwayat gacha user
GET `http://localhost:5000/api/gacha/history/:userId`

Parameter:
userId (path) → ObjectId user

Response:
{
	"total": 2,
	"history": [
		{
			"status": "Win!",
			"reward": "Voucher Rp 100.000",
			"date": "2026-04-12T00:25:46.724Z"
		},
		{
			"status": "Lose!",
			"reward": null,
			"date": "2026-04-12T00:25:34.831Z"
		}
	]
}

## 3. Limit Gacha

- Menampilkan jumlah penggunaan gacha
GET `http://localhost:5000/api/gacha/limit/:userId`

Response:
{
	"today": 0,
	"remaining": 5
}

## 4. Daftar Hadiah & Sisa Kuota

- Menampilkan semua hadiah beserta kuota
GET `http://localhost:5000/api/gacha/rewards`

Response:
{
	"total": 5,
	"rewards": [
		{
			"name": "Emas 10g",
			"quota": 1,
			"claimed": 0,
			"remaining": 1
		},
		{
			"name": "Smartphone X",
			"quota": 5,
			"claimed": 0,
			"remaining": 5
		},
		{
			"name": "Smartwatch Y",
			"quota": 10,
			"claimed": 0,
			"remaining": 10
		},
		{
			"name": "Voucher Rp 100.000",
			"quota": 100,
			"claimed": 0,
			"remaining": 100
		},
		{
			"name": "Pulsa Rp 50.000",
			"quota": 500,
			"claimed": 0,
			"remaining": 500
		}
	]
}

## 5. Daftar Pemenang (Masked)

- Menampilkan daftar user yang menang
GET `http://localhost:5000/api/gacha/winners`

Response:
{
	"total": 2,
	"winners": [
		{
			"user": "*e*t U*er",
			"reward": "Voucher Rp 100.000",
			"date": "2026-04-12T00:25:46.724Z"
		},
		{
			"user": "T*s* ***r",
			"reward": "Emas 10g",
			"date": "2026-04-10T01:26:52.090Z"
		}
	]
}

## 6. Users

### POST `http://localhost:5000/api/users`
- Membuat user baru

Request Body (JSON):

{
  "email": "string",
  "password": "string (min 8 karakter)",
  "confirm_password": "string",
  "full_name": "string"
}

### GET `http://localhost:5000/api/users`
- Menampilkan semua user

### GET `http://localhost:5000/api/users/:id`
- Menampilkan detail user

### PUT `http://localhost:5000/api/users/:id`
- Update data user

### DELETE `http://localhost:5000/api/users/:id`
- Menghapus user
