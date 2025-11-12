# Solución: Proyecto de Supabase Pausado

## El Problema

El error `Can't reach database server` significa que tu proyecto de Supabase está pausado o la URL no es correcta.

## Solución Paso a Paso

### 1. Ve al Dashboard de Supabase
- Abre https://supabase.com/dashboard
- Inicia sesión con tu cuenta

### 2. Verifica el Estado del Proyecto
- Busca tu proyecto "tinder-laboral"
- Si dice **"Paused"** o **"Inactive"**, necesitas reactivarlo

### 3. Reactivar el Proyecto
- Haz clic en el proyecto pausado
- Verás un botón **"Restore project"** o **"Resume project"**
- Haz clic y espera 2-3 minutos

### 4. Obtener la Connection String Correcta

Una vez que el proyecto esté activo:

1. Ve a **Settings** (⚙️ en la barra lateral)
2. Haz clic en **Database**
3. Baja hasta la sección **"Connection string"**
4. Selecciona **"URI"**
5. Verás algo como:
   ```
   postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. **IMPORTANTE**: Copia esa URL COMPLETA
7. Reemplaza `[YOUR-PASSWORD]` con tu contraseña: `Necro3010!`

### 5. Pégame la Nueva Connection String

Una vez que tengas la connection string correcta, pégala aquí y yo la configuraré.

---

## Alternativa: Crear un Nuevo Proyecto

Si el proyecto anterior no funciona o prefieres empezar de cero:

1. En el dashboard de Supabase, haz clic en **"New Project"**
2. Nombre: `tinder-laboral-v2`
3. Password: Crea una password **SIN CARACTERES ESPECIALES** (solo letras y números)
   - Ejemplo: `Necro3010Pass`
4. Region: **South America - São Paulo**
5. Espera 2-3 minutos
6. Obtén la connection string como se indicó arriba

---

## ¿Necesitas Ayuda?

Si tienes problemas, puedes:
1. Tomar un screenshot del dashboard de Supabase
2. Copiar el mensaje de error exacto
3. Intentar con otro servicio de base de datos (Neon.tech o local)
