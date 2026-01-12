import { NextRequest, NextResponse } from 'next/server';
import { 
  env, 
  serverEnvOptional, 
  isPayPalWebhookConfigured,
  serverEnvRequired 
} from '@/lib/env';
import { createClient } from '@supabase/supabase-js';

/**
 * Verifica la firma del webhook de PayPal
 */
async function verifyPayPalWebhook(
  webhookId: string,
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  try {
    const mode = serverEnvOptional.paypalMode();
    const baseUrl = mode === 'live' 
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    // Obtener access token
    const clientId = env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = serverEnvRequired.paypalClientSecret('PayPal webhook verification');
    
    const authResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!authResponse.ok) {
      console.error('Failed to get PayPal access token');
      return false;
    }

    const { access_token } = await authResponse.json();

    // Verificar webhook signature
    const verifyResponse = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        transmission_id: headers['paypal-transmission-id'],
        transmission_time: headers['paypal-transmission-time'],
        cert_url: headers['paypal-cert-url'],
        auth_algo: headers['paypal-auth-algo'],
        transmission_sig: headers['paypal-transmission-sig'],
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    });

    const verification = await verifyResponse.json();
    return verification.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Error verifying PayPal webhook:', error);
    return false;
  }
}

/**
 * POST /api/paypal/webhook
 * Endpoint para recibir notificaciones de PayPal
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar si el webhook está configurado
    if (!isPayPalWebhookConfigured()) {
      console.warn('⚠️ PayPal webhook endpoint called but PAYPAL_WEBHOOK_ID not configured');
      return NextResponse.json(
        { 
          error: 'Webhook not configured',
          message: 'PAYPAL_WEBHOOK_ID must be set after creating the webhook in PayPal dashboard'
        },
        { status: 503 }
      );
    }

    // Leer body como texto (necesario para verificación de firma)
    const body = await request.text();
    const event = JSON.parse(body);

    // Extraer headers necesarios para verificación
    const headers: Record<string, string> = {
      'paypal-transmission-id': request.headers.get('paypal-transmission-id') || '',
      'paypal-transmission-time': request.headers.get('paypal-transmission-time') || '',
      'paypal-cert-url': request.headers.get('paypal-cert-url') || '',
      'paypal-auth-algo': request.headers.get('paypal-auth-algo') || '',
      'paypal-transmission-sig': request.headers.get('paypal-transmission-sig') || '',
    };

    // Verificar firma del webhook
    const webhookId = serverEnvOptional.paypalWebhookId()!;
    const isValid = await verifyPayPalWebhook(webhookId, headers, body);

    if (!isValid) {
      console.error('❌ Invalid PayPal webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    console.log('✅ PayPal webhook verified:', event.event_type);

    // Procesar eventos de pago
    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const captureId = event.resource.id;
      const orderId = event.resource.supplementary_data?.related_ids?.order_id;
      
      console.log(`💰 Payment completed - Order: ${orderId}, Capture: ${captureId}`);

      // Actualizar estado en Supabase
      const supabase = createClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        serverEnvRequired.supabaseServiceRoleKey('PayPal webhook - update booking')
      );

      // Buscar reserva por custom_id u order_id
      const customId = event.resource.custom_id;
      if (customId) {
        const { error } = await supabase
          .from('reservas')
          .update({
            estado_pago: 'completado',
            paypal_order_id: orderId,
            paypal_capture_id: captureId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', customId);

        if (error) {
          console.error('Error updating booking:', error);
          return NextResponse.json(
            { error: 'Database update failed' },
            { status: 500 }
          );
        }

        console.log(`✅ Booking ${customId} marked as paid`);
      }
    }

    // Otros eventos relevantes
    if (event.event_type === 'PAYMENT.CAPTURE.DENIED') {
      console.log('❌ Payment denied:', event.resource.id);
      // Opcional: marcar como fallido en DB
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/paypal/webhook
 * Endpoint de salud para verificar configuración
 */
export async function GET() {
  const configured = isPayPalWebhookConfigured();
  
  return NextResponse.json({
    status: configured ? 'configured' : 'pending',
    message: configured 
      ? 'PayPal webhook is configured and ready'
      : 'PayPal webhook needs PAYPAL_WEBHOOK_ID to be set',
    environment: serverEnvOptional.paypalMode(),
  });
}
