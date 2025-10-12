# 🛍️ E-Commerce Platform

Fullstack aplikacija za prodaju proizvoda sa korisničkim nalozima, korpom i sistemom porudžbina.  
Kreirana korišćenjem **React + Zustand + TailwindCSS** na frontendu i **Node.js + Express + Prisma** na backendu.

---

## 🚀 Funkcionalnosti

### 👤 Korisnici

- Registracija i prijava (JWT u HTTP-only cookie-u)
- Pregled ličnih podataka (Account stranica)
- Pregled svojih porudžbina
- Samo admin korisnici imaju pristup menadžment panelu

### 🛒 Korpa i porudžbine

- Dodavanje/uklanjanje proizvoda u korpi
- Podešavanje količine artikala
- Kreiranje porudžbine sa podacima o dostavi
- Pregled pojedinačne porudžbine
- Admin može menjati status porudžbine (Pending, Paid, Shipped, Delivered, Canceled)

### 📦 Proizvodi

- Prikaz proizvoda sa slikom, opisom i cenom
- Detaljna stranica proizvoda
- Filtriranje, pretraga i sortiranje proizvoda
- Dodavanje u korpu direktno sa kartice

### 🧑‍💼 Admin panel

- Pregled svih korisnika, porudžbina i proizvoda
- Promena uloga korisnika (USER/ADMIN)
- Menjanje statusa porudžbina
- Pregled proizvoda i njihovih kategorija

### 🔒 Autentifikacija i zaštita ruta

- Korisnički token se čuva u sigurnom cookie-u
- Zaštićene rute (ProtectedRoute, AdminRoute)
- Samo admin vidi admin panel
- Samo ulogovan korisnik može praviti porudžbine i pristupiti `/account`

---

## 🧱 Arhitektura

### Frontend

- **React 19 (Vite)**
- **Zustand** – globalno stanje (auth, cart, orders, users)
- **Tailwind CSS** – brzi, responzivni stilovi
- **React Router DOM** – rute i zaštita pristupa
- **React Icons** – ikone u UI-ju

### Backend

- **Express.js** REST API
- **Prisma ORM** – interakcija sa bazom
- **MySQL** baza podataka
- **JWT** za autentifikaciju
- **CORS + cookie-parser + morgan** – middleware sloj

---

## ⚙️ Pokretanje projekta

### 1️⃣ Pokreni backend

```bash
cd server
npm install
```

Konfiguriši `.env`:

PORT=8000
DATABASE_URL=""
JWT_SECRET="secret_token_key"
CORS_ORIGIN=http://localhost:5173
COOKIE_NAME=token

Migriraj bazu i pokreni server:

```bash
npm prisma:migrate
npm run dev
```

### 3️⃣ Pokreni frontend

```bash
cd client
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:8000

---

## 🧑‍💻 Komande

| Komanda               | Opis                          |
| --------------------- | ----------------------------- |
| `npm run dev`         | Pokreće razvojni server       |
| `npx prisma:migrate`  | Pokreće migracije             |
| `npx prisma:generate` | Generiše Prisma klijenta      |
| `npx prisma:seed`     | Popunjava bazu sa proizvodima |
