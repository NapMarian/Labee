# 💼 Labee

### *Match your next job*

A modern job matching platform that connects candidates with recruiters through an intuitive swipe-based interface. Find your perfect job match or discover talented candidates - all with a swipe.

---

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth with refresh token rotation
- 👆 **Swipe Interface** - Tinder-style matching for jobs and candidates
- 💬 **Real-time Messaging** - Chat with your matches instantly
- 🎯 **Smart Matching** - Bidirectional matching system
- 🌓 **Dark/Light Mode** - Beautiful glassmorphism design with theme toggle
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 👤 **User Profiles** - Detailed profiles for candidates and recruiters
- 🔔 **Match Notifications** - Get notified when you match

## 🚀 Tech Stack

### Backend
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT with refresh tokens
- **Security:** Helmet, CORS, Rate Limiting

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS with custom glassmorphism design
- **State Management:** Zustand
- **Routing:** React Router v6
- **HTTP Client:** Axios

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **npm** >= 9.x

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/NapMarian/Labee.git
cd Labee
```

### 2. Install dependencies

```bash
npm install
```

This will install dependencies for both frontend and backend.

### 3. Configure environment variables

**Backend** (`apps/backend/.env`):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/labee"
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-this"
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175
```

**Frontend** (`apps/frontend/.env`):

```env
VITE_API_URL=http://localhost:3000
```

### 4. Set up the database

```bash
cd apps/backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

This will:
- Generate Prisma Client
- Run database migrations
- Seed the database with demo data (recruiters, job offers, candidates)

### 5. Start development servers

From the root directory:

```bash
npm run dev
```

This will start both servers:
- **Backend API:** http://localhost:3000
- **Frontend:** http://localhost:5173

## 📁 Project Structure

```
labee/
├── apps/
│   ├── backend/                 # Backend API
│   │   ├── src/
│   │   │   ├── config/         # Configuration files
│   │   │   ├── controllers/    # Route controllers
│   │   │   ├── middlewares/    # Express middlewares
│   │   │   ├── routes/         # API routes
│   │   │   ├── services/       # Business logic
│   │   │   ├── utils/          # Utility functions
│   │   │   └── index.ts        # Entry point
│   │   └── prisma/
│   │       ├── schema.prisma   # Database schema
│   │       └── seed.ts         # Database seeding
│   │
│   └── frontend/                # React frontend
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── pages/          # Page components
│       │   ├── services/       # API services
│       │   ├── store/          # Zustand stores
│       │   ├── hooks/          # Custom hooks
│       │   ├── lib/            # Libraries & utilities
│       │   └── types/          # TypeScript types
│       └── public/             # Static assets
│
└── package.json                # Root package.json (workspace)
```

## 🎮 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and frontend in development mode |
| `npm run dev:backend` | Start only the backend server |
| `npm run dev:frontend` | Start only the frontend dev server |
| `npm run build` | Build both apps for production |
| `npm run build:backend` | Build backend only |
| `npm run build:frontend` | Build frontend only |

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Swipes & Matches
- `GET /api/swipes/candidates` - Get candidates to swipe (recruiters only)
- `GET /api/swipes/offers` - Get job offers to swipe (candidates only)
- `POST /api/swipes` - Create a swipe (like/dislike)
- `GET /api/swipes/matches` - Get all matches

### Messages
- `GET /api/messages` - Get all conversations
- `GET /api/messages/:matchId` - Get messages for a match
- `POST /api/messages/:matchId` - Send a message
- `PUT /api/messages/:matchId/read` - Mark messages as read

## 👥 User Roles

### Candidates
- Create profile with skills, experience, and preferences
- Swipe on job offers
- Match with recruiters
- Chat with matched recruiters

### Recruiters
- Create company profile
- Post job offers
- Swipe on candidate profiles
- Match with candidates
- Chat with matched candidates

## 🎨 Design System

The app uses a modern **glassmorphism** design with:
- Backdrop blur effects
- Translucent surfaces
- Smooth transitions
- Dark/Light theme support
- Blue/gray color scheme
- Responsive layouts

## 🗄️ Database Schema

Key entities:
- **Users** - Authentication and user data
- **Profiles** - Extended user information
- **JobOffers** - Job postings by recruiters
- **Swipes** - Like/dislike actions
- **Matches** - Successful bidirectional matches
- **Messages** - Chat messages between matches
- **RefreshTokens** - JWT refresh tokens

## 🔐 Security Features

- JWT authentication with access/refresh tokens
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Input validation
- SQL injection prevention (Prisma ORM)

## 🚧 Roadmap

- [x] User authentication system
- [x] Profile management
- [x] Swipe interface for matching
- [x] Bidirectional match system
- [x] Real-time messaging
- [x] Dark/light theme
- [ ] Advanced filtering and search
- [ ] Email notifications
- [ ] File uploads (resumes, avatars)
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mariano Knaap**
- GitHub: [@NapMarian](https://github.com/NapMarian)

---

<p align="center">Made with ❤️ and lots of ☕</p>
