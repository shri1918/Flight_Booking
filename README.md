# Flight Booking App

A modern web application for searching, viewing, and managing flights, built with Next.js, React, and the Aviationstack API.

## ✈️ Features

- **Flight Search:**
  - Search for flights by departure, arrival, and date.
  - View real-time and historical flight data from the Aviationstack API.
  - Advanced filters: price range, airlines, stops, and time slots.
  - Pagination for browsing large sets of flight results.

- **Flight Management (Admin):**
  - Add, edit, and delete flights (local management for demo purposes).
  - View all flights and their details.

- **Booking Management:**
  - View and manage flight bookings (local management for demo purposes).

- **User Dashboard:**
  - Search and book flights.
  - View booking history.

- **Authentication:**
  - User login and registration (context-based, demo only).

## 🛠️ Tech Stack

- **Frontend:**
  - [Next.js 13+ (App Router)](https://nextjs.org/)
  - [React 18+](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
  - [Lucide Icons](https://lucide.dev/) for icons

- **API/Data:**
  - [Aviationstack API](https://aviationstack.com/) for real-time and historical flight data
  - [Axios](https://axios-http.com/) for HTTP requests

- **State Management:**
  - React Context API
  - React Hooks

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/flight-booking-app.git
cd flight-booking-app
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory and add your Aviationstack API key:

```
NEXT_PUBLIC_AVIATIONSTACK_API_KEY=your_aviationstack_api_key_here
```

You can get a free API key from [aviationstack.com](https://aviationstack.com/).

### 4. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## 📁 Project Structure

- `app/` — Next.js app directory (pages, layouts, API routes)
- `components/` — Reusable UI and feature components
- `lib/` — Utility functions and axios instance
- `contexts/` — React context providers (e.g., Auth)
- `styles/` — Global and component styles

## 📝 Notes
- This project is for demo/educational purposes. Bookings and admin changes are stored in localStorage.
- The flight data is fetched live from the Aviationstack API.
- You can extend the app to use a real backend and database for production use.

## 📜 License
MIT 