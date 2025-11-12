# Guía de Configuración - Tinder Laboral MVP

Esta guía te ayudará a configurar y ejecutar el proyecto completo en tu máquina local.

## Prerrequisitos

Asegúrate de tener instalado:

- **Node.js** >= 18.x ([Descargar](https://nodejs.org/))
- **PostgreSQL** >= 14.x ([Descargar](https://www.postgresql.org/download/))
- **npm** >= 9.x (viene con Node.js)
- **Git** ([Descargar](https://git-scm.com/))

## Paso 1: Configurar la Base de Datos

### 1.1. Crear la base de datos PostgreSQL

```bash
# Iniciar sesión en PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE tinder_laboral;

# Crear usuario (opcional, puedes usar postgres)
CREATE USER tinder_user WITH PASSWORD 'tu_password_seguro';

# Dar permisos
GRANT ALL PRIVILEGES ON DATABASE tinder_laboral TO tinder_user;

# Salir
\q
```

### 1.2. Configurar variables de entorno del Backend

```bash
# Ir a la carpeta del backend
cd apps/backend

# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo .env con tus datos
```

Contenido del archivo `apps/backend/.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/tinder_laboral?schema=public"

# JWT Secrets (CÁMBIALOS en producción)
JWT_SECRET="tu-super-secret-jwt-key-de-al-menos-32-caracteres-aqui"
JWT_REFRESH_SECRET="tu-refresh-secret-key-diferente-tambien-de-32-caracteres"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# CORS
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR="uploads"
```

## Paso 2: Instalar Dependencias

```bash
# Desde la raíz del proyecto
npm install

# Esto instalará las dependencias del workspace root y de todos los subproyectos
```

Si tienes problemas con los workspaces, instala manualmente:

```bash
# Backend
cd apps/backend
npm install
cd ../..

# Frontend
cd apps/frontend
npm install
cd ../..
```

## Paso 3: Configurar Prisma y Migrar la Base de Datos

```bash
# Ir al backend
cd apps/backend

# Generar el cliente de Prisma
npx prisma generate

# Ejecutar las migraciones (crear tablas)
npx prisma migrate dev --name init

# Poblar la base de datos con datos de prueba
npm run prisma:seed
```

Deberías ver un mensaje de éxito con las credenciales de prueba:

```
🎉 Database seeded successfully!

📝 Test users:
Candidates:
  - maria.garcia@example.com (Password123!)
  - juan.perez@example.com (Password123!)
  - laura.martinez@example.com (Password123!)

Recruiters:
  - hr@techcorp.com (Password123!)
  - jobs@startup.io (Password123!)
```

## Paso 4: Configurar el Frontend

```bash
# Ir al frontend
cd apps/frontend

# Copiar el archivo de ejemplo
cp .env.example .env

# Editar si es necesario (por defecto está bien)
```

Contenido del archivo `apps/frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Paso 5: Ejecutar el Proyecto

Tienes dos opciones:

### Opción A: Ejecutar todo desde la raíz (Recomendado)

```bash
# Desde la raíz del proyecto
npm run dev
```

Esto iniciará automáticamente:
- **Backend** en http://localhost:3000
- **Frontend** en http://localhost:5173

### Opción B: Ejecutar cada servicio por separado

En terminales separadas:

```bash
# Terminal 1 - Backend
cd apps/backend
npm run dev

# Terminal 2 - Frontend
cd apps/frontend
npm run dev
```

## Paso 6: Probar la Aplicación

1. Abre tu navegador en http://localhost:5173
2. Deberías ver la página de login
3. Usa una de las credenciales de prueba:
   - **Candidato**: maria.garcia@example.com / Password123!
   - **Reclutador**: hr@techcorp.com / Password123!

## Verificar que todo funciona

### Backend API Health Check

```bash
curl http://localhost:3000/api/health
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-XX..."
}
```

### Prisma Studio (Opcional)

Para ver los datos en la base de datos visualmente:

```bash
cd apps/backend
npx prisma studio
```

Esto abrirá una interfaz web en http://localhost:5555

## Comandos Útiles

### Backend

```bash
cd apps/backend

# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start

# Ver base de datos
npx prisma studio

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Resetear base de datos (CUIDADO: borra todo)
npx prisma migrate reset
```

### Frontend

```bash
cd apps/frontend

# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## Solución de Problemas Comunes

### Error: "Cannot connect to database"

- Verifica que PostgreSQL esté corriendo: `pg_isready`
- Verifica la conexión: `psql -U postgres -d tinder_laboral`
- Revisa que la `DATABASE_URL` en `.env` sea correcta

### Error: "Module not found"

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules apps/*/node_modules
npm install
```

### Error de Prisma: "Prisma Client not generated"

```bash
cd apps/backend
npx prisma generate
```

### Puerto 3000 o 5173 ya en uso

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error de CORS

Verifica que `ALLOWED_ORIGINS` en `apps/backend/.env` incluya `http://localhost:5173`

## Estructura del Proyecto

```
tinder-laboral/
├── apps/
│   ├── backend/                 # API REST
│   │   ├── prisma/             # Schema y migraciones
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   ├── config/         # Configuración
│   │   │   ├── controllers/    # Controladores
│   │   │   ├── middlewares/    # Middlewares
│   │   │   ├── routes/         # Rutas
│   │   │   ├── services/       # Lógica de negocio
│   │   │   ├── utils/          # Utilidades
│   │   │   └── index.ts        # Entry point
│   │   ├── .env                # Variables de entorno
│   │   └── package.json
│   │
│   └── frontend/               # React App
│       ├── src/
│       │   ├── components/     # Componentes React
│       │   ├── lib/           # Utilidades (API client)
│       │   ├── pages/         # Páginas
│       │   ├── store/         # Zustand stores
│       │   ├── types/         # TypeScript types
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── .env               # Variables de entorno
│       └── package.json
│
├── package.json               # Workspace root
├── README.md
├── PLAN_PROYECTO.md          # Plan completo del proyecto
└── SETUP.md                  # Esta guía
```

## Próximos Pasos

Ahora que tienes el MVP funcionando, puedes:

1. **Explorar el código** y familiarizarte con la estructura
2. **Crear tu propio usuario** desde el registro
3. **Revisar el plan completo** en [PLAN_PROYECTO.md](PLAN_PROYECTO.md)
4. **Empezar a desarrollar** las siguientes funcionalidades:
   - Sistema de swipes
   - Matching
   - Chat en tiempo real
   - Perfiles mejorados

## Recursos

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de React](https://react.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)
- [Documentación de Zustand](https://zustand-demo.pmnd.rs/)

## Soporte

Si encuentras problemas:
1. Revisa esta guía
2. Verifica los logs en la consola
3. Revisa la configuración de `.env`
4. Asegúrate de que PostgreSQL esté corriendo

¡Feliz desarrollo! 🚀
