# 🔐 Guía de Configuración de Variables de Entorno

## ⚠️ IMPORTANTE: Seguridad

**NUNCA subas archivos con credenciales a Git**. Todos los archivos `.env*` están protegidos en `.gitignore`.

## 📋 Pasos de Configuración

### 1. Crear archivo .env.local

```bash
cp .env.example .env.local
```

Luego edita `.env.local` con tus credenciales reales.

---

## 🗄️ SUPABASE

### Cómo obtener las credenciales:

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea un nuevo proyecto (o usa uno existente)
3. Ve a **Settings** > **API**
4. Copia:
   - **URL**: La URL del proyecto
   - **service_role key**: La clave de servicio (¡SECRETA!)

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Ejecutar el schema SQL:

1. Ve a **SQL Editor** en Supabase
2. Copia y pega el contenido de `supabase/schema.sql`
3. Ejecuta el script

---

## 💳 PAYPAL

### Modo Sandbox (Pruebas):

1. Ve a [https://developer.paypal.com](https://developer.paypal.com)
2. Inicia sesión
3. Ve a **Dashboard** > **Apps & Credentials** > **Sandbox**
4. Crea una nueva app o usa una existente
5. Copia el **Client ID** y **Secret**

### Configurar Webhook:

1. En la misma página, ve a **Webhooks**
2. Crea un nuevo webhook con la URL:
   - Desarrollo: `https://tu-url-ngrok.ngrok.io/api/paypal/webhook`
   - Producción: `https://tu-dominio.com/api/paypal/webhook`
3. Selecciona estos eventos:
   - `CHECKOUT.ORDER.APPROVED`
   - `PAYMENT.CAPTURE.COMPLETED`
4. Copia el **Webhook ID** generado

```bash
PAYPAL_CLIENT_ID=Axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_CLIENT_SECRET=Exxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_WEBHOOK_ID=WH-xxxxxxxxxxxxxxxxxxxxxx
PAYPAL_MODE=sandbox
```

### Modo Producción:

Cambia a la pestaña **Live** y repite el proceso. Asegúrate de cambiar `PAYPAL_MODE=live`.

---

## 📅 GOOGLE CALENDAR

### Crear Service Account:

1. Ve a [https://console.cloud.google.com](https://console.cloud.google.com)
2. Crea un nuevo proyecto (o usa uno existente)
3. Habilita **Google Calendar API**:
   - **APIs & Services** > **Enable APIs and Services**
   - Busca "Google Calendar API" y habilítala
4. Crea una Service Account:
   - **APIs & Services** > **Credentials**
   - **Create Credentials** > **Service Account**
   - Dale un nombre y crea
5. Genera una clave:
   - Haz clic en la Service Account creada
   - Ve a **Keys** > **Add Key** > **Create new key**
   - Selecciona **JSON** y descarga
6. Abre el archivo JSON descargado y copia:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY` (mantén los `\n`)

### Configurar el Calendario:

1. Ve a [https://calendar.google.com](https://calendar.google.com)
2. Crea un nuevo calendario (o usa uno existente)
3. Ve a **Configuración del calendario** > **Compartir con usuarios específicos**
4. Agrega el email de la Service Account con permisos de **"Hacer cambios en los eventos"**
5. Copia el **ID del calendario** (está en la configuración del calendario)

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=nombre@proyecto-xxxxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=tu-email@gmail.com
```

⚠️ **Importante**: El `GOOGLE_PRIVATE_KEY` debe estar entre comillas y mantener los `\n`.

---

## 🔑 ADMIN API KEY

Genera una clave segura usando OpenSSL:

```bash
openssl rand -base64 32
```

O usa un generador online: [https://www.grc.com/passwords.htm](https://www.grc.com/passwords.htm)

```bash
ADMIN_API_KEY=tu-clave-super-secreta-generada
```

Esta clave se usará para acceder al panel de administración.

---

## 🤖 ANTHROPIC (Opcional)

Si quieres usar el agente de IA:

1. Ve a [https://console.anthropic.com](https://console.anthropic.com)
2. Crea una cuenta y obtén tu API Key
3. Agrégala:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🌐 APP URL

### Desarrollo:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Producción:
```bash
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

---

## ✅ Verificar Configuración

Después de configurar todo:

1. **Nunca** commits el archivo `.env.local`
2. Verifica que `.gitignore` está funcionando:
   ```bash
   git status
   ```
   No deberías ver `.env.local` en la lista

3. Si accidentalmente agregaste `.env.local` a Git:
   ```bash
   git rm --cached .env.local
   git commit -m "Remove .env.local from git"
   ```

---

## 🚨 En caso de exposición de claves

Si accidentalmente expones una clave:

1. **Supabase**: Regenera la Service Role Key inmediatamente
2. **PayPal**: Regenera el Client Secret
3. **Google**: Elimina la Service Account y crea una nueva
4. **GitHub**: Si subiste claves, usa herramientas como [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) para limpiar el historial

---

## 📞 Ayuda

Si tienes problemas con la configuración, revisa:
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de PayPal](https://developer.paypal.com/docs/)
- [Google Calendar API Docs](https://developers.google.com/calendar)
