# Tinder Laboral

Plataforma de matching laboral que conecta candidatos con reclutadores de manera eficiente y moderna.

## Estructura del Proyecto

```
tinder-laboral/
├── apps/
│   ├── backend/          # API REST con Node.js + Express + Prisma
│   └── frontend/         # React + TypeScript + Vite
├── package.json          # Workspace root
└── PLAN_PROYECTO.md      # Plan completo del proyecto
```

## Stack Tecnológico

### Backend
- Node.js + TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Socket.io (chat en tiempo real)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- React Router

## Requisitos Previos

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

## Instalación

1. Clonar el repositorio
```bash
git clone <repository-url>
cd tinder-laboral
```

2. Instalar dependencias
```bash
npm run install:all
```

3. Configurar variables de entorno

Backend (`apps/backend/.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/tinder_laboral"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
PORT=3000
```

Frontend (`apps/frontend/.env`):
```env
VITE_API_URL=http://localhost:3000
```

4. Inicializar base de datos
```bash
cd apps/backend
npx prisma migrate dev
npx prisma db seed
```

5. Ejecutar en desarrollo
```bash
npm run dev
```

Esto iniciará:
- Backend en http://localhost:3000
- Frontend en http://localhost:5173

## Scripts Disponibles

- `npm run dev` - Ejecuta backend y frontend en desarrollo
- `npm run dev:backend` - Solo backend
- `npm run dev:frontend` - Solo frontend
- `npm run build` - Build de producción

## Roadmap

- [x] Setup inicial del proyecto
- [ ] Autenticación (JWT)
- [ ] Sistema de perfiles
- [ ] Sistema de swipes/matching
- [ ] Chat en tiempo real
- [ ] Sistema de filtros

Ver [PLAN_PROYECTO.md](PLAN_PROYECTO.md) para el plan completo.

## Licencia

MIT
