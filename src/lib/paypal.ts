import { logger } from './logger';

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

/**
 * Obtener token de acceso de PayPal
 */
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Crear una orden de PayPal
 */
export async function createPayPalOrder(
  amount: string,
  appointmentId: string
): Promise<{ orderId: string }> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: appointmentId,
            amount: {
              currency_code: 'USD',
              value: amount,
            },
            description: 'Cita médica - Clínica Ginecológica',
          },
        ],
        application_context: {
          brand_name: 'Clínica Ginecológica',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error({ error }, 'PayPal order creation failed');
      throw new Error('Failed to create PayPal order');
    }

    const data = await response.json();
    logger.info({ orderId: data.id, appointmentId }, 'PayPal order created');
    
    return { orderId: data.id };
  } catch (error) {
    logger.error({ error, appointmentId }, 'Error creating PayPal order');
    throw error;
  }
}

/**
 * Capturar una orden de PayPal
 */
export async function capturePayPalOrder(
  orderId: string
): Promise<{ captureId: string; status: string }> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      logger.error({ error, orderId }, 'PayPal capture failed');
      throw new Error('Failed to capture PayPal order');
    }

    const data = await response.json();
    const captureId = data.purchase_units[0].payments.captures[0].id;
    
    logger.info({ orderId, captureId, status: data.status }, 'PayPal order captured');
    
    return {
      captureId,
      status: data.status,
    };
  } catch (error) {
    logger.error({ error, orderId }, 'Error capturing PayPal order');
    throw error;
  }
}

/**
 * Verificar firma de webhook de PayPal
 */
export async function verifyWebhookSignature(
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          transmission_id: headers['paypal-transmission-id'],
          transmission_time: headers['paypal-transmission-time'],
          cert_url: headers['paypal-cert-url'],
          auth_algo: headers['paypal-auth-algo'],
          transmission_sig: headers['paypal-transmission-sig'],
          webhook_id: process.env.PAYPAL_WEBHOOK_ID,
          webhook_event: JSON.parse(body),
        }),
      }
    );

    if (!response.ok) {
      logger.error('Webhook signature verification failed');
      return false;
    }

    const data = await response.json();
    return data.verification_status === 'SUCCESS';
  } catch (error) {
    logger.error({ error }, 'Error verifying webhook signature');
    return false;
  }
}
