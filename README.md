# 💼 Labee

### *Swipe Your Way to Your Dream Job*

**Labee** is a modern job matching platform that revolutionizes the hiring process by combining the simplicity of Tinder-style swiping with professional networking. Connect candidates with their ideal opportunities and help recruiters discover top talent - all through an intuitive, engaging interface.

---

## 🎯 What is Labee?

Labee transforms traditional job hunting and recruiting into an interactive, efficient experience:

- **For Candidates**: Browse job opportunities with a simple swipe. Like positions that interest you, pass on those that don't. When a recruiter likes you back, it's a match!

- **For Recruiters**: Review candidate profiles effortlessly. Post job offers and swipe through qualified candidates. Matched candidates can start conversations immediately.

### The Problem We Solve

Traditional job boards are overwhelming and time-consuming. Candidates scroll through hundreds of irrelevant listings, while recruiters sift through countless unqualified applications. Labee cuts through the noise by:

- ✅ Making job discovery fun and efficient
- ✅ Ensuring mutual interest before communication
- ✅ Reducing time-to-hire for recruiters
- ✅ Providing a mobile-first, modern UX
- ✅ Creating a two-sided matching system (both parties must like each other)

---

## ✨ Core Features

### 🔐 **Authentication & Profiles**
- Secure JWT-based authentication with refresh token rotation
- Role-based access (Candidate vs Recruiter)
- Rich profile management with LinkedIn-style fields
- Image upload with crop functionality for avatars/company logos
- Skills, experience, education, and portfolio showcasing

### 👆 **Swipe Interface**
- Smooth, physics-based swipe animations using Framer Motion
- Candidate cards with comprehensive information
- Job offer cards with salary ranges, location, and requirements
- Queue system for offline swipe batching
- Real-time match notifications

### 💼 **Job Offer Management** (Recruiters)
- Create and publish job postings
- Edit and update active offers
- Activate/deactivate postings
- Track views and matches per offer
- Categorization by work type, industry, and location

### 💬 **Messaging System**
- Real-time chat between matched users
- Conversation threading per match
- Read/unread message tracking
- Message history persistence

### 🎨 **Modern Design**
- Glassmorphism UI with backdrop blur effects
- Dark/Light theme with seamless transitions
- Responsive design for all screen sizes
- Blue/gray color scheme with translucent surfaces
- Accessibility-focused components

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon serverless)
- **ORM:** Prisma
- **Authentication:** JWT with httpOnly cookies + refresh tokens
- **Security:** Helmet, CORS, express-rate-limit
- **File Upload:** Multer with image processing

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS with custom glassmorphism utilities
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Routing:** React Router v6
- **HTTP Client:** Axios with interceptors

### DevOps & Tools
- **Version Control:** Git + GitHub
- **Package Manager:** npm workspaces (monorepo)
- **Database Migrations:** Prisma Migrate
- **Environment:** dotenv for configuration
- **Development:** tsx for TypeScript execution

---

## 🚀 Roadmap & Development Journey

### ✅ Phase 1: Foundation (Completed)
- [x] Monorepo setup with npm workspaces
- [x] PostgreSQL database with Prisma ORM
- [x] User authentication (register, login, JWT, refresh tokens)
- [x] Basic API structure with error handling
- [x] Frontend routing and authentication flow

### ✅ Phase 2: Core Matching (Completed)
- [x] Swipe service and queue system
- [x] Bidirectional match algorithm
- [x] Candidate and job offer retrieval APIs
- [x] Match detection and storage
- [x] Swipe UI with custom React hooks

### ✅ Phase 3: Enhanced UX (Completed)
- [x] Framer Motion swipe animations
- [x] Glassmorphism design system
- [x] Dark/Light theme toggle
- [x] Profile page with comprehensive fields
- [x] Image upload with crop modal
- [x] Responsive sidebar navigation
- [x] Match notifications

### ✅ Phase 4: Job Management (Completed)
- [x] Job offer CRUD operations
- [x] Recruiter job posting interface
- [x] Job statistics (views, matches)
- [x] Active/inactive offer toggling
- [x] Salary ranges, requirements, and categorization

### 🚧 Phase 5: Messaging (In Progress)
- [x] Message data model
- [x] Message API endpoints
- [ ] Real-time messaging UI
- [ ] WebSocket integration
- [ ] Typing indicators
- [ ] Message notifications

### 📋 Phase 6: Advanced Features (Planned)
- [ ] Advanced filtering (skills, location, salary)
- [ ] Search functionality
- [ ] Analytics dashboard for recruiters
- [ ] Email notifications
- [ ] CV/Resume uploads and parsing
- [ ] Video introduction clips
- [ ] Application tracking system
- [ ] Interview scheduling

### 🌟 Phase 7: Scale & Polish (Future)
- [ ] Performance optimization
- [ ] Caching layer (Redis)
- [ ] Full-text search (Elasticsearch)
- [ ] Mobile app (React Native)
- [ ] A/B testing framework
- [ ] Admin dashboard
- [ ] Multi-language support

---

## 🧗 Technical Challenges & Solutions

### 1. **Smooth Swipe Animations**
**Challenge**: Creating native-feeling swipe gestures with proper physics and momentum.

**Solution**:
- Initially implemented custom `useSwipe` hook with mouse/touch events
- Migrated to Framer Motion for built-in gesture handling and spring physics
- Used `useMotionValue` and `useTransform` for 60fps animations
- Exposed programmatic swipe methods via window object for button clicks

```typescript
const performSwipe = useCallback((direction: number) => {
  setExitX(direction * 1000);
  setTimeout(() => {
    if (direction > 0) onSwipeRight?.();
    else onSwipeLeft?.();
  }, 200);
}, [onSwipeLeft, onSwipeRight]);
```

### 2. **Image Upload & Cropping**
**Challenge**: Allowing users to upload and crop images without external dependencies.

**Solution**:
- Implemented custom `ImageCropModal` component with canvas API
- Used FileReader for client-side preview
- Multer middleware for server-side upload handling
- Created `getImageUrl` helper to construct proper backend URLs
- Handled avatar/companyLogo conditional rendering based on user type

### 3. **Race Condition in Match Creation**
**Challenge**: Duplicate match errors when two users liked each other simultaneously.

**Solution**:
```typescript
try {
  const match = await prisma.match.create({
    data: { user1Id, user2Id, jobOfferId }
  });
  return match;
} catch (error: any) {
  if (error.code === 'P2002') { // Unique constraint violation
    const existingMatch = await prisma.match.findFirst({
      where: { OR: [{ user1Id, user2Id }, { user1Id: user2Id, user2Id: user1Id }] }
    });
    if (existingMatch) return existingMatch;
  }
  throw error;
}
```

### 4. **Offline Swipe Queue**
**Challenge**: Preventing network latency from blocking the swipe UI.

**Solution**:
- Implemented `useSwipeQueue` hook with batching
- Queue stores swipes in memory and sends them asynchronously
- User can continue swiping even if previous requests are pending
- Debounced flush mechanism to reduce API calls

### 5. **Theme Persistence**
**Challenge**: Maintaining theme preference across sessions without flash.

**Solution**:
- Used Zustand for global theme state
- Stored preference in localStorage
- Applied theme class to `<html>` element before React hydration
- Implemented smooth CSS transitions for theme changes

### 6. **Bidirectional Matching Logic**
**Challenge**: Ensuring matches only occur when both parties like each other.

**Solution**:
```typescript
// When a swipe occurs, check if the other party already liked us
const reciprocalSwipe = await prisma.swipe.findFirst({
  where: {
    swiperId: targetUserId,
    targetUserId: swiperId,
    liked: true
  }
});

if (reciprocalSwipe) {
  // Create match!
  await createMatch(swiperId, targetUserId, jobOfferId);
}
```

### 7. **Profile Image URL Construction**
**Challenge**: Frontend trying to load images from its own origin instead of backend.

**Solution**:
- Created centralized `getImageUrl` utility
- Checks if path is already absolute URL
- Prepends `API_URL` to relative paths
- Updated all components to use helper consistently

```typescript
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${API_URL}${imagePath}`;
};
```

---

## 📁 Project Structure

```
labee/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── config/         # Database & environment config
│   │   │   ├── controllers/    # Request handlers
│   │   │   ├── middlewares/    # Auth, error handling, upload
│   │   │   ├── routes/         # API endpoint definitions
│   │   │   ├── services/       # Business logic layer
│   │   │   ├── utils/          # JWT, validation helpers
│   │   │   └── index.ts        # Express app entry
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── migrations/     # Version-controlled DB changes
│   │   └── uploads/            # User-uploaded images
│   │
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── layout/     # DashboardLayout, navigation
│       │   │   ├── swipe/      # SwipeCard, CandidateCard
│       │   │   ├── matches/    # MatchCard
│       │   │   ├── ui/         # Reusable components
│       │   │   └── ImageCropModal.tsx
│       │   ├── pages/          # Swipes, Matches, Profile, JobOffers
│       │   ├── services/       # API client services
│       │   ├── store/          # Zustand state management
│       │   ├── hooks/          # useSwipeQueue, custom hooks
│       │   ├── lib/            # API client, utilities
│       │   └── types/          # TypeScript definitions
│       └── public/             # Static assets
│
└── package.json                # Root workspace config
```

---

## 🗄️ Database Schema

### Core Entities

**Users** - Authentication and role information
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  userType      UserType  // CANDIDATE | RECRUITER
  verified      Boolean   @default(false)
  active        Boolean   @default(true)
}
```

**Profiles** - Extended user information (LinkedIn-style fields)
- Candidates: skills, experience, education, portfolio, resume
- Recruiters: companyName, companyLogo, companyDescription, industry

**JobOffers** - Job postings by recruiters
- title, description, requirements, salary range
- workType, category, location, remote flag
- active/inactive status

**Swipes** - Like/pass actions
- Candidates swipe on JobOffers (jobOfferId)
- Recruiters swipe on Candidates (targetUserId)
- Unique constraint prevents duplicate swipes

**Matches** - Successful bidirectional matches
- Created when both parties like each other
- Links user1, user2, and optionally a JobOffer
- Can be deleted (unmatch)

**Messages** - Chat messages between matched users
- Belongs to a Match
- Tracks read/unread status
- Ordered by createdAt

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account (candidate/recruiter)
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Invalidate refresh token
- `GET /api/auth/me` - Get current user + profile

### Profile
- `GET /api/profile` - Get own profile
- `PUT /api/profile` - Update profile fields

### Uploads
- `POST /api/upload/profile-image` - Upload avatar/logo
- `DELETE /api/upload/profile-image` - Delete image

### Swipes & Matches
- `GET /api/swipes/potential` - Get cards to swipe
- `POST /api/swipes` - Submit swipe (like/pass)
- `GET /api/swipes/matches` - Get all matches
- `DELETE /api/swipes/matches/:id` - Unmatch

### Job Offers (Recruiters only)
- `GET /api/job-offers/my-offers` - Get own postings
- `POST /api/job-offers` - Create job offer
- `GET /api/job-offers/:id` - Get single offer
- `PUT /api/job-offers/:id` - Update offer
- `DELETE /api/job-offers/:id` - Deactivate offer
- `PATCH /api/job-offers/:id/toggle-status` - Toggle active/inactive

### Messages
- `GET /api/messages/:matchId` - Get conversation
- `POST /api/messages/:matchId` - Send message
- `PUT /api/messages/:matchId/read` - Mark as read

---

## 🎨 Design Philosophy

### Glassmorphism
We chose glassmorphism for its modern, depth-rich aesthetic:
- **Frosted glass effect** with `backdrop-filter: blur()`
- **Translucent surfaces** with `bg-white/70` and `bg-gray-900/50`
- **Subtle borders** with `border-white/20`
- **Layered depth** through shadow and opacity

### Color Palette
- **Primary**: Blue (#3B82F6) for actions and highlights
- **Neutrals**: Gray scale for text and surfaces
- **Dark Mode**: Inverted neutrals with blue accents preserved

### Animations
- **Swipe gestures**: Spring physics for natural feel
- **Page transitions**: Fade and slide animations
- **Loading states**: Spinners and skeleton screens
- **Hover effects**: Scale and color transitions

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- PostgreSQL >= 14.x (or Neon serverless account)
- npm >= 9.x

### Installation

```bash
# Clone repo
git clone https://github.com/NapMarian/Labee.git
cd Labee

# Install dependencies
npm install

# Set up environment variables
# Create apps/backend/.env and apps/frontend/.env

# Run database migrations
cd apps/backend
npx prisma generate
npx prisma migrate dev

# Start both servers
cd ../..
npm run dev
```

Visit:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

---

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Mariano Knaap**
- GitHub: [@NapMarian](https://github.com/NapMarian)

---

<p align="center">
Built with 💙 React, Express, and a passion for better hiring experiences
</p>
