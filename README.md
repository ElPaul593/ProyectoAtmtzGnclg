# Clínica Ginecológica - Sistema de Reservas

Sistema de gestión de citas médicas con integración de pagos PayPal y calendario Google.

## 🚀 Deploy en Vercel

### Prerequisitos

1. Cuenta en [Vercel](https://vercel.com)
2. Cuenta en [Supabase](https://supabase.com)
3. Cuenta de desarrollador en [PayPal](https://developer.paypal.com)
4. (Opcional) Proyecto en [Google Cloud](https://console.cloud.google.com)

---

### 📋 Variables de Entorno Requeridas

#### Mínimo para Deploy Inicial (OBLIGATORIAS)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiI...

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AbCdEf123...
PAYPAL_CLIENT_SECRET=EFGhIj789...
PAYPAL_MODE=sandbox
```

#### Post-Deploy (se agregan después)

```bash
PAYPAL_WEBHOOK_ID=WH-xxxxx
```

#### Opcionales (funcionalidades adicionales)

```bash
# Google Calendar
GOOGLE_CLIENT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=xxx@group.calendar.google.com

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Admin
ADMIN_API_KEY=tu-clave-secreta
```

---

### 🔧 Pasos de Deploy

#### 1. Preparar Supabase

```bash
# Ir a: https://app.supabase.com
# 1. Crear nuevo proyecto
# 2. Ir a Settings > API
# 3. Copiar:
#    - URL (NEXT_PUBLIC_SUPABASE_URL)
#    - anon/public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
#    - service_role key (SUPABASE_SERVICE_ROLE_KEY)
```

#### 2. Configurar PayPal

```bash
# Ir a: https://developer.paypal.com/dashboard
# 1. Crear App en "Sandbox" o "Live"
# 2. Copiar:
#    - Client ID (NEXT_PUBLIC_PAYPAL_CLIENT_ID)
#    - Secret (PAYPAL_CLIENT_SECRET)
# 3. Guardar PAYPAL_MODE=sandbox (o "live")
```

#### 3. Deploy en Vercel

```bash
# Opción A: Desde la web
# 1. Ir a: https://vercel.com/new
# 2. Importar repositorio: ElPaul593/ProyectoAtmtzGnclg
# 3. Framework Preset: Next.js (detectado automáticamente)
# 4. Root Directory: ./
# 5. NO cambiar Build/Output settings

# Opción B: Desde CLI
npm i -g vercel
vercel login
vercel
```

#### 4. Configurar Variables de Entorno en Vercel

```bash
# En el dashboard de Vercel:
# 1. Project Settings > Environment Variables
# 2. Agregar TODAS las variables obligatorias (ver arriba)
# 3. Seleccionar ambientes: Production, Preview, Development
# 4. Save
```

#### 5. Trigger Deploy

```bash
# Opción A: Desde dashboard
# Deployments > ... > Redeploy

# Opción B: Push a git
git push origin main
```

#### 6. Verificar Deploy Exitoso

```bash
# 1. Esperar que termine el build (2-3 min)
# 2. Verificar logs: no debe haber errores
# 3. Abrir la URL: https://tu-proyecto.vercel.app
# 4. Probar endpoint de salud:
curl https://tu-proyecto.vercel.app/api/paypal/webhook
# Debe responder: { "status": "pending", "message": "..." }
```

---

### 🔗 Configurar PayPal Webhook (POST-DEPLOY)

**IMPORTANTE:** Esto se hace DESPUÉS del primer deploy exitoso.

#### 1. Obtener URL del webhook

```bash
# Tu URL de producción:
https://tu-proyecto.vercel.app/api/paypal/webhook
```

#### 2. Crear webhook en PayPal

```bash
# Ir a: https://developer.paypal.com/dashboard/webhooks
# (Asegúrate de estar en Sandbox o Live según PAYPAL_MODE)

# 1. Click "Create Webhook"
# 2. Webhook URL: https://tu-proyecto.vercel.app/api/paypal/webhook
# 3. Event types:
#    ✓ Payment capture completed
#    ✓ Payment capture denied
#    ✓ Payment capture refunded
# 4. Save
# 5. Copiar el "Webhook ID" (WH-xxxxx)
```

#### 3. Agregar Webhook ID a Vercel

```bash
# En Vercel dashboard:
# 1. Settings > Environment Variables
# 2. Add New:
#    Key: PAYPAL_WEBHOOK_ID
#    Value: WH-xxxxx (copiado de PayPal)
#    Environments: Production, Preview
# 3. Save
```

#### 4. Redeploy

```bash
# Vercel redeployará automáticamente
# O forzar: Deployments > ... > Redeploy

# Verificar configuración:
curl https://tu-proyecto.vercel.app/api/paypal/webhook
# Debe responder: { "status": "configured", "message": "..." }
```

---

### 🧪 Probar Integración PayPal

#### En Sandbox

```bash
# 1. Crear orden de pago en tu app
# 2. Usar cuenta de prueba PayPal:
#    - Buyer: sb-xxxxx@personal.example.com
#    - Password: (generada en PayPal sandbox)
# 3. Completar pago
# 4. Verificar webhook en logs de Vercel:
#    Runtime Logs > Filter: "/api/paypal/webhook"
```

---

### 🐛 Troubleshooting

#### Error: "Module not found" durante build

```bash
# Verificar que todas las importaciones usen rutas correctas
# Ejemplo: import { env } from '@/lib/env'
# Si falla, revisar tsconfig.json > paths
```

#### Error: "Variable XXX is required"

```bash
# Esto es ESPERADO en runtime si falta configuración
# NO debe fallar en build, solo al usar la funcionalidad
# Verificar:
# 1. La variable está en Vercel (Settings > Env Variables)
# 2. El redeploy se ejecutó después de agregar la variable
```

#### Webhook no recibe eventos

```bash
# 1. Verificar URL en PayPal dashboard
# 2. Verificar PAYPAL_WEBHOOK_ID en Vercel
# 3. Ver logs en Vercel: Runtime Logs
# 4. Probar manualmente:
curl -X POST https://tu-app.vercel.app/api/paypal/webhook \
  -H "Content-Type: application/json" \
  -d '{"event_type":"TEST"}'
```

#### Error 503 en webhook

```bash
# Esto es NORMAL si PAYPAL_WEBHOOK_ID no está configurado
# Solución: seguir paso 6 (Configurar PayPal Webhook)
```

---

### 📊 Monitoreo

#### Logs en Vercel

```bash
# Dashboard > Logs
# - Build Logs: errores durante npm run build
# - Runtime Logs: errores en ejecución (API routes)
# - Filter por ruta: /api/paypal/webhook
```

#### Verificar variables

```bash
# Dashboard > Settings > Environment Variables
# - Verificar que estén todas las requeridas
# - Verificar que estén en Production Y Preview
```

---

### 📦 Estructura del Proyecto

## 🤖 Agente de IA (OpenAI)

El endpoint `/api/agent` ahora integra OpenAI (opcional) para generar respuestas más naturales en el flujo de reservas. Para activarlo, configura `OPENAI_API_KEY` en Vercel o en tu entorno local. Si no está configurada, el agente usa mensajes de respaldo basados en reglas.

Variables necesarias:

```bash
OPENAI_API_KEY=sk-...
```

---

## 📈 Reportes de impacto (Python)

Se incluye un script de Python para generar reportes con el impacto de las reservas (volumen diario y revenue estimado por servicios confirmados). El script consulta Supabase vía REST y genera archivos en `reports/`.

```bash
python3 scripts/report_impact.py
```

Variables necesarias:

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiI...
```

Salidas:

```
reports/impact_report.csv
reports/impact_report.json
```
