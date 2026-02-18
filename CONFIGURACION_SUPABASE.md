# 🔐 Configuración de Supabase - Guía Rápida

## ✅ Credenciales que ya tienes:

- **Project URL**: `https://lpudorszrdnvgzgearvz.supabase.co`
- **Publishable API Key**: `sb_publishable_jDC3riUkxaae0xKiiQ_blw_lnJcUyxK`

## ⚠️ IMPORTANTE: Falta el Service Role Key

Para que la aplicación funcione completamente, necesitas obtener el **Service Role Key** (clave secreta del servidor).

### Cómo obtener el Service Role Key:

1. **Ve a tu proyecto en Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/lpudorszrdnvgzgearvz

2. **Navega a Settings > API**
   - En el menú lateral, haz clic en "Settings" (⚙️)
   - Luego haz clic en "API"

3. **Busca la sección "Project API keys"**
   - Verás dos claves:
     - **anon/public** key (ya la tienes) - Esta es la que compartiste
     - **service_role** key (la que necesitas) - ⚠️ Esta es SECRETA

4. **Copia el Service Role Key**
   - Normalmente es un JWT token largo que empieza con `eyJ...`
   - Haz clic en el ícono de "eye" 👁️ para revelarla
   - Copia toda la clave

5. **Agrega la clave al archivo `.env.local`**
   - Abre el archivo `.env.local` en la raíz del proyecto
   - Encuentra la línea: `SUPABASE_SERVICE_ROLE_KEY=`
   - Pega la clave después del `=`

### Ejemplo del archivo `.env.local` completo:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://lpudorszrdnvgzgearvz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_jDC3riUkxaae0xKiiQ_blw_lnJcUyxK
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdWRvcnN6cmRudmd6Z2VhcnZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODc2NDMyMCwiZXhwIjoyMDE0MzQwMzIwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 📋 Próximos Pasos:

1. ✅ **Obtener el Service Role Key** (ver arriba)
2. ✅ **Agregarlo al archivo `.env.local`**
3. ✅ **Ejecutar la migración SQL** (ver `MIGRATION.md`)
4. ✅ **Reiniciar el servidor de desarrollo**

## 🗄️ Ejecutar la Migración SQL:

Después de configurar las variables de entorno:

1. Ve a **SQL Editor** en Supabase Dashboard
2. Abre el archivo `supabase/schema.sql` de este proyecto
3. Copia y pega todo el contenido en el SQL Editor
4. Haz clic en "Run" para ejecutar el script
5. Esto creará todas las tablas necesarias (patients, appointments, services, etc.)

## ✅ Verificar que todo funciona:

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre http://localhost:3000 en tu navegador

3. Intenta acceder a la página de reservar: http://localhost:3000/reservar

4. Si ves errores en la consola, verifica:
   - Que el Service Role Key esté correctamente configurado
   - Que hayas ejecutado la migración SQL
   - Que las tablas existan en Supabase

## 🔒 Seguridad:

- ⚠️ **NUNCA** compartas el Service Role Key públicamente
- ⚠️ **NUNCA** subas el archivo `.env.local` a Git (ya está en `.gitignore`)
- ✅ El Service Role Key solo debe usarse en el servidor
- ✅ La Anon Key puede usarse en el cliente (pero con RLS habilitado)

## 🆘 Si tienes problemas:

1. Verifica que las claves estén correctamente copiadas (sin espacios extra)
2. Verifica que hayas ejecutado la migración SQL
3. Revisa la consola del navegador y del servidor para ver errores específicos
4. Verifica en Supabase Dashboard que las tablas existan
