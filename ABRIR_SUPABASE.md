# 🚀 Cómo Abrir y Configurar Supabase

## 📍 Paso 1: Abrir Supabase Dashboard

1. **Ve a la página de Supabase**: https://supabase.com
2. **Haz clic en "Sign In"** (arriba a la derecha)
3. **Inicia sesión** con tu cuenta (o crea una si no tienes)

## 📍 Paso 2: Acceder a tu Proyecto

Una vez dentro del dashboard:

1. **Busca tu proyecto** en la lista de proyectos
2. **Haz clic en el proyecto** llamado algo como `lpudorszrdnvgzgearvz` o el nombre que le diste

**O directamente ve a:**
```
https://supabase.com/dashboard/project/lpudorszrdnvgzgearvz
```

## 📍 Paso 3: Obtener el Service Role Key

1. **En el menú lateral izquierdo**, busca y haz clic en **"Settings"** (⚙️)
2. **Haz clic en "API"** (dentro de Settings)
3. **Desplázate hasta la sección "Project API keys"**
4. Verás dos claves:
   - **anon public** - Esta ya la tienes
   - **service_role** - Esta es la que necesitas ⚠️

5. **Para ver el Service Role Key:**
   - Haz clic en el ícono de **ojo** 👁️ junto a "service_role"
   - Se revelará la clave (es un JWT token largo que empieza con `eyJ...`)
   - **Copia toda la clave**

6. **Pega la clave en tu archivo `.env.local`:**
   - Abre el archivo `.env.local` en la raíz de tu proyecto
   - Busca la línea: `SUPABASE_SERVICE_ROLE_KEY=`
   - Pega la clave después del `=`

## 📍 Paso 4: Ejecutar la Migración SQL

1. **En el menú lateral izquierdo**, haz clic en **"SQL Editor"**
2. **Haz clic en "New query"** (botón verde)
3. **Abre el archivo `supabase/schema.sql`** de tu proyecto
4. **Copia TODO el contenido** del archivo
5. **Pega el contenido** en el SQL Editor de Supabase
6. **Haz clic en "Run"** (botón verde) o presiona `Ctrl+Enter`
7. **Espera a que termine** - deberías ver un mensaje de éxito

## ✅ Verificar que Funcionó

1. **En el menú lateral**, haz clic en **"Table Editor"**
2. **Deberías ver las tablas creadas:**
   - `patients`
   - `appointments`
   - `services`
   - `daily_metrics`

Si ves estas tablas, ¡la migración fue exitosa! 🎉

## 🔗 Enlaces Rápidos

- **Dashboard principal**: https://supabase.com/dashboard
- **Tu proyecto**: https://supabase.com/dashboard/project/lpudorszrdnvgzgearvz
- **Settings > API**: https://supabase.com/dashboard/project/lpudorszrdnvgzgearvz/settings/api
- **SQL Editor**: https://supabase.com/dashboard/project/lpudorszrdnvgzgearvz/sql/new

## 🆘 Si no puedes acceder

1. **Verifica que estés logueado** en Supabase
2. **Verifica que el proyecto existe** - puede que necesites crearlo primero
3. **Si el proyecto no existe**, créalo:
   - Haz clic en "New Project"
   - Usa la misma URL que tienes: `lpudorszrdnvgzgearvz`
   - O crea uno nuevo y actualiza las variables de entorno

## 📝 Nota sobre la Clave Anon

La clave que compartiste (`sb_publishable_jDC3riUkxaae0xKiiQ_blw_lnJcUyxK`) parece tener un formato diferente. 

**Normalmente las claves de Supabase son JWT tokens largos** que empiezan con `eyJ...`

Si esta clave no funciona:
1. Ve a Settings > API
2. Verifica que estés copiando la clave correcta
3. Asegúrate de copiar toda la clave completa (sin espacios)
