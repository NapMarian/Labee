# Opciones de Base de Datos

## Opción 1: Supabase (Recomendada - 5 minutos) 🚀

**Ventajas:**
- ✅ Gratis para desarrollo
- ✅ No requiere instalación local
- ✅ 500MB de almacenamiento gratis
- ✅ Listo para producción
- ✅ Incluye autenticación, storage, y más features
- ✅ Interface visual para ver los datos

**Pasos:**

1. **Crear cuenta:**
   - Ve a https://supabase.com
   - Haz clic en "Start your project"
   - Regístrate con GitHub o email

2. **Crear proyecto:**
   - Haz clic en "New Project"
   - Nombre: `tinder-laboral`
   - Database Password: Crea una contraseña segura (guárdala!)
   - Region: Elige la más cercana (South America - São Paulo)
   - Plan: Free

3. **Obtener connection string:**
   - Espera 1-2 minutos a que el proyecto se cree
   - Ve a "Settings" (⚙️) → "Database"
   - En "Connection string", selecciona "URI"
   - Copia la URL que comienza con `postgresql://`
   - Reemplaza `[YOUR-PASSWORD]` con tu contraseña

4. **Ejemplo de URL:**
   ```
   postgresql://postgres.xxxxx:[TU-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

---

## Opción 2: PostgreSQL Local (30-45 minutos) 💻

**Ventajas:**
- ✅ Control total
- ✅ Funciona offline
- ✅ No depende de servicios externos

**Desventajas:**
- ❌ Requiere instalación
- ❌ Configuración más compleja en Windows
- ❌ Ocupa espacio en disco (~250MB)

**Pasos:**

1. **Descargar PostgreSQL:**
   - Ve a https://www.postgresql.org/download/windows/
   - Descarga el instalador (versión 16 recomendada)

2. **Instalar:**
   - Ejecuta el instalador
   - Password: Crea una contraseña para el usuario `postgres` (guárdala!)
   - Puerto: 5432 (default)
   - Instala Stack Builder: NO (no es necesario)

3. **Verificar instalación:**
   ```bash
   psql --version
   ```

4. **Crear la base de datos:**
   ```bash
   # Abrir PowerShell como Administrador
   psql -U postgres
   # Ingresar password

   # Dentro de psql:
   CREATE DATABASE tinder_laboral;
   \q
   ```

5. **Connection string:**
   ```
   postgresql://postgres:[TU-PASSWORD]@localhost:5432/tinder_laboral
   ```

---

## Opción 3: Neon.tech (Alternativa en la nube) 🌐

Similar a Supabase, también gratis:
- Ve a https://neon.tech
- Crea proyecto
- Copia la connection string

---

## ¿Cuál elegir?

### Para este MVP: **Supabase (Opción 1)** ⭐

Es la más rápida y no requiere instalación. Además, Supabase tiene features que podríamos usar más adelante (storage para fotos de perfil, autenticación avanzada, etc.).

### Para aprender PostgreSQL: **Opción 2**

Si quieres aprender a administrar bases de datos.

---

## Próximo paso

Una vez que tengas la connection string, la agregaremos al archivo `.env` del backend.
