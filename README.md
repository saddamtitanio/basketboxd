# BasketBoxd

BasketBoxd is a basketball-focused social platform inspired by https://letterboxd.com/, where users can rate basketball games, review player performances, create watchlists, and interact with other basketball fans.

Live Website: https://basketboxd-mx4q.vercel.app/

---

## About The Project

BasketBoxd reimagines the Letterboxd experience for basketball fans.

Instead of reviewing movies, users can:
- Rate basketball games
- Rate players individually
- Write reviews and comments
- Track watched games
- Create personalized lists and watchlists
- Discover trending games and player performances

The platform is designed for basketball enthusiasts who want to share opinions, discuss performances, and keep track of memorable games.

---

## Features

- User Authentication
- Basketball Game Reviews
- Player Rating System
- Comment & Discussion System
- Watchlists / Favorite Games
- User Profiles
- Search for Games and Players
- Trending & Popular Games
- Responsive UI

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- Service / Repository Architecture

### Database & Auth
- Supabase

### Deployment
- Vercel

---

## 📂 Project Structure

```bash
├───public
├───src
│   ├───app
│   │   ├───api
│   │   │   ├───auth
│   │   │   │   ├───login
│   │   │   │   ├───profile
│   │   │   │   └───register
│   │   │   ├───games
│   │   │   │   └───[id]
│   │   │   │       ├───leaderboard
│   │   │   │       └───reviews
│   │   │   │           └───[reviewId]
│   │   │   ├───lists
│   │   │   │   ├───public
│   │   │   │   └───[id]
│   │   │   │       └───games
│   │   │   ├───player-ratings
│   │   │   ├───profile
│   │   │   │   └───[id]
│   │   │   │       ├───follow
│   │   │   │       ├───followers
│   │   │   │       └───following
│   │   │   ├───search
│   │   │   └───users
│   │   │       ├───me
│   │   │       └───[id]
│   │   ├───auth
│   │   │   ├───login
│   │   │   └───register
│   │   ├───components
│   │   │   ├───game
│   │   │   ├───home
│   │   │   ├───layout
│   │   │   └───ui
│   │   │       └───ListUI
│   │   ├───games
│   │   │   └───[id]
│   │   │       └───reviews
│   │   ├───lib
│   │   │   └───supabase
│   │   ├───list
│   │   │   └───[id]
│   │   ├───profile
│   │   │   ├───watchlist
│   │   │   └───[id]
│   │   └───types
│   └───modules
│       ├───auth
│       ├───follows
│       ├───games
│       ├───lists
│       ├───player-ratings
│       ├───reviews
│       └───users
└───supabase
```

---

## Getting Started

### Prerequisites

Make sure you have installed:
- Node.js
- npm or yarn

---

### Installation

Clone the repository:

```bash
git clone https://github.com/saddamtitanio/basketboxd.git
```

Go into the project directory:

```bash
cd basketboxd
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_SHARABLE_KEY=your_SHARABLE_key
```

---

##  Project Goals

The main goal of BasketBoxd is to create a social platform for basketball fans where discussions and ratings focus on games and player performances instead of films.

The project also aims to:
- Encourage community interaction
- Provide detailed player/game reviews
- Help users track memorable games
- Deliver a modern sports-focused social experience

---

##  Inspiration

BasketBoxd is heavily inspired by https://letterboxd.com/, adapting its social review and rating system into the basketball world.

---

##  Contributors

- Nicolas Chriscia
- Saddam Titanio Darmawan
- Mochammad Rafly Fatih Rabbani
- Hafizh Akbar Ghifarie Ramadhan

---

## License

This project is for educational purposes.

---

## Deployment

BasketBoxd is deployed on:

https://basketboxd-mx4q.vercel.app/

---
