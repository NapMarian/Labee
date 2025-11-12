# Tinder Laboral - Plan de Proyecto

## Stack Tecnológico Recomendado

### Frontend
- **Framework**: React + TypeScript
- **Mobile**: React Native (código compartido para iOS y Android)
- **UI/UX**: Tailwind CSS + shadcn/ui (componentes modernos y accesibles)
- **Estado**: Zustand o React Context API
- **Animaciones**: Framer Motion (para swipes tipo Tinder)

### Backend
- **Runtime**: Node.js + Express / NestJS (más estructurado)
- **Lenguaje**: TypeScript
- **Base de datos**: PostgreSQL (relacional, robusto y gratuito)
- **ORM**: Prisma (type-safe, migraciones fáciles)
- **Autenticación**: JWT + Refresh Tokens
- **Storage**: Supabase Storage o Cloudflare R2 (fotos de perfil, CVs)

### Comunicación en Tiempo Real
- **WebSockets**: Socket.io (chat)
- **Video/Audio**: WebRTC con:
  - **Opción 1**: Agora.io (1,000 minutos gratis/mes, luego desde $0.99/1000 min)
  - **Opción 2**: Daily.co (10,000 minutos gratis/mes)
  - **Opción 3**: Livekit (open source, self-hosted)

### Infraestructura y Hosting

#### Opción 1: Económica (Recomendada para MVP)
- **Frontend Web**: Vercel/Netlify (Gratis hasta 100GB bandwidth)
- **Backend**: Railway.app ($5/mes inicial) o Render.com (gratis con limitaciones)
- **Base de Datos**: Supabase (500MB gratis, luego $25/mes) o Neon.tech (gratis con límites)
- **Storage**: Supabase Storage o Cloudflare R2 ($0.015/GB)
- **Total estimado MVP**: $0-10/mes

#### Opción 2: Escalable (Para crecimiento)
- **Backend + DB**: DigitalOcean App Platform ($12-25/mes)
- **Frontend**: Vercel Pro ($20/mes con muchos más límites)
- **CDN**: Cloudflare (gratis)
- **Total estimado Fase 2**: $35-50/mes

#### Opción 3: Profesional (Para escala grande)
- **Cloud**: AWS/GCP con Kubernetes
- **Estimado**: $100-300/mes (con miles de usuarios)

---

## Plan por Fases

### 🎯 MVP (Mínimo Producto Viable) - 2-3 meses
**Objetivo**: Validar la idea con funcionalidad core

#### Funcionalidades:
1. **Autenticación**
   - Registro/Login con email y contraseña
   - Verificación de email
   - Recuperación de contraseña

2. **Perfiles**
   - **Candidatos**:
     - Foto de perfil
     - Información básica (nombre, edad, ubicación)
     - Experiencia laboral (última posición)
     - Habilidades (tags)
     - Tipo de trabajo buscado (full-time, part-time, freelance)
     - Categoría laboral (tecnología, ventas, administración, etc.)

   - **Reclutadores**:
     - Foto/logo empresa
     - Nombre empresa (opcional: ocultar)
     - Descripción de la oferta
     - Requisitos
     - Tipo de contrato
     - Rango salarial (opcional)
     - Ubicación/remoto

3. **Sistema de Matching (Swipe)**
   - Cards con información relevante
   - Swipe derecha (interesado) / izquierda (no interesado)
   - Notificación de match

4. **Chat Básico**
   - Solo disponible después de match
   - Mensajes de texto en tiempo real
   - Indicador de "escribiendo..."
   - Historial de conversaciones

5. **Filtros Básicos**
   - Por ubicación
   - Por tipo de trabajo (full-time, part-time, remoto)
   - Por categoría laboral

#### Stack MVP:
- Frontend: React + Vite + TypeScript + Tailwind
- Backend: Node.js + Express + Prisma + PostgreSQL
- Auth: JWT
- Chat: Socket.io
- Hosting: Vercel + Railway + Supabase

---

### 🚀 Fase 1 - Mejoras y Retención (3-4 meses después del MVP)
**Objetivo**: Mejorar UX y retener usuarios

#### Funcionalidades:
1. **Apps Móviles**
   - React Native para iOS y Android
   - Push notifications (Expo)

2. **Perfiles Mejorados**
   - CV/Portfolio en PDF
   - Video presentación (30 seg)
   - Portfolio de trabajos
   - Certificaciones
   - Referencias

3. **Sistema de Matching Avanzado**
   - Algoritmo de recomendación básico (basado en skills, ubicación, experiencia)
   - "Super likes" limitados
   - Boost de perfil

4. **Chat Mejorado**
   - Envío de archivos
   - Mensajes de voz
   - Emojis/reacciones
   - Marcar como leído

5. **Dashboard**
   - Estadísticas para reclutadores (vistas, matches, respuestas)
   - Estadísticas para candidatos (postulaciones, matches)

6. **Sistema de Reportes**
   - Reportar perfiles fake
   - Bloquear usuarios
   - Moderación básica

---

### 💼 Fase 2 - Funcionalidades Premium (4-6 meses después de Fase 1)
**Objetivo**: Monetización y diferenciación

#### Funcionalidades:
1. **Sistema de Videollamadas**
   - Videollamadas programadas
   - Screen sharing
   - Grabación de entrevistas (con consentimiento)
   - Chat durante videollamada
   - Integración: Daily.co o Agora.io

2. **Simulador de Entrevistas (IA)**
   - Modo práctica para candidatos
   - Modo práctica para reclutadores
   - Preguntas generadas por IA
   - Feedback automático con IA (OpenAI GPT-4)
   - Análisis de lenguaje corporal (opcional con ML)

3. **Sistema de Suscripciones**
   - **Candidatos Free**: 10 swipes/día
   - **Candidatos Premium** ($9.99/mes):
     - Swipes ilimitados
     - Ver quién te dio like
     - 3 Super likes/día
     - Boost mensual

   - **Reclutadores Free**: 1 oferta activa, 20 swipes/día
   - **Reclutadores Pro** ($49.99/mes):
     - 5 ofertas activas
     - Swipes ilimitados
     - Estadísticas avanzadas
     - Prioridad en búsquedas

   - **Empresas Enterprise** ($199/mes):
     - Múltiples reclutadores
     - Ofertas ilimitadas
     - API access
     - Soporte prioritario

4. **Sistema de Pagos**
   - Stripe o Mercado Pago (LATAM)
   - Facturación automática

5. **Filtros Avanzados**
   - Por salario
   - Por habilidades específicas
   - Por años de experiencia
   - Por educación

---

### 🏆 Fase 3 - Escala y Expansión (6-12 meses después de Fase 2)
**Objetivo**: Convertirse en líder del mercado

#### Funcionalidades:
1. **Algoritmo de ML**
   - Recomendaciones personalizadas con Machine Learning
   - Predicción de probabilidad de match
   - Análisis de comportamiento

2. **Integración con LinkedIn**
   - Importar perfil de LinkedIn
   - Compartir logros

3. **Sistema de Referencias**
   - Verificación de experiencia laboral
   - Sistema de endorsements

4. **Eventos y Networking**
   - Ferias laborales virtuales
   - Webinars
   - Speed interviews (múltiples candidatos)

5. **Analytics Avanzados**
   - Dashboard para empresas con BI
   - Reportes descargables
   - A/B testing de ofertas

6. **Internacionalización**
   - Multi-idioma (i18n)
   - Multi-moneda
   - Expansión regional

---

## Estructura de Datos (Prisma Schema Básico)

```prisma
enum UserType {
  CANDIDATE
  RECRUITER
}

enum WorkType {
  FULL_TIME
  PART_TIME
  FREELANCE
  INTERNSHIP
}

enum JobCategory {
  TECHNOLOGY
  SALES
  ADMINISTRATION
  MARKETING
  DESIGN
  FINANCE
  HR
  OPERATIONS
  OTHER
}

model User {
  id            String      @id @default(uuid())
  email         String      @unique
  passwordHash  String
  userType      UserType
  verified      Boolean     @default(false)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  profile       Profile?
  swipes        Swipe[]
  matches       Match[]     @relation("UserMatches")
  messages      Message[]

  @@index([email])
}

model Profile {
  id              String        @id @default(uuid())
  userId          String        @unique
  user            User          @relation(fields: [userId], references: [id])

  // Común
  name            String
  avatar          String?
  bio             String?
  location        String?

  // Candidato
  skills          String[]
  experience      Json?         // {company, position, years}
  education       String?
  resume          String?       // URL del CV
  workTypes       WorkType[]
  categories      JobCategory[]

  // Reclutador
  companyName     String?
  companyVisible  Boolean       @default(true)

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model JobOffer {
  id              String        @id @default(uuid())
  recruiterId     String

  title           String
  description     String
  requirements    String[]
  workType        WorkType
  category        JobCategory
  location        String?
  remote          Boolean       @default(false)
  salaryMin       Int?
  salaryMax       Int?
  companyName     String?
  companyVisible  Boolean       @default(true)

  active          Boolean       @default(true)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  swipes          Swipe[]

  @@index([recruiterId])
  @@index([category])
  @@index([workType])
}

model Swipe {
  id              String        @id @default(uuid())
  userId          String
  user            User          @relation(fields: [userId], references: [id])

  // Si es candidato swipeando ofertas
  jobOfferId      String?
  jobOffer        JobOffer?     @relation(fields: [jobOfferId], references: [id])

  // Si es reclutador swipeando candidatos
  targetUserId    String?

  liked           Boolean       // true = right swipe, false = left swipe
  createdAt       DateTime      @default(now())

  @@unique([userId, jobOfferId])
  @@unique([userId, targetUserId])
  @@index([userId])
}

model Match {
  id              String        @id @default(uuid())
  user1Id         String
  user2Id         String
  user1           User          @relation("UserMatches", fields: [user1Id], references: [id])

  jobOfferId      String?       // Si el match es por una oferta específica

  createdAt       DateTime      @default(now())

  messages        Message[]

  @@unique([user1Id, user2Id])
  @@index([user1Id])
  @@index([user2Id])
}

model Message {
  id              String        @id @default(uuid())
  matchId         String
  match           Match         @relation(fields: [matchId], references: [id])
  senderId        String
  sender          User          @relation(fields: [senderId], references: [id])

  content         String
  read            Boolean       @default(false)
  createdAt       DateTime      @default(now())

  @@index([matchId])
  @@index([senderId])
}
```

---

## Consideraciones de Seguridad

1. **Autenticación**
   - Bcrypt para hashear passwords (salt rounds: 12)
   - JWT con expiración corta (15 min) + Refresh tokens (7 días)
   - Rate limiting en endpoints de auth (express-rate-limit)

2. **Validación**
   - Zod para validación de schemas
   - Sanitización de inputs (evitar XSS)
   - CORS configurado correctamente

3. **Base de Datos**
   - Prisma previene SQL injection por defecto
   - Row Level Security en Supabase

4. **Archivos**
   - Validar tipo y tamaño de archivos
   - Escaneo antivirus para CVs (ClamAV)
   - URLs firmadas para acceso temporal

5. **Chat y Video**
   - Cifrado end-to-end en video
   - Moderación de contenido
   - Sistema de reportes

---

## Próximos Pasos

1. ¿Quieres que empiece con el MVP?
2. ¿Prefieres que comience con la estructura del proyecto y configuración inicial?
3. ¿Tienes alguna preferencia de stack específica?

Recomiendo comenzar con:
1. Estructura del proyecto
2. Backend con autenticación
3. Frontend con login/registro
4. Sistema de perfiles
5. Sistema de swipes/matching
6. Chat básico
