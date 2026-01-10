import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { logger } from './logger';

let paypalClient: any = null;

function getPayPalClient() {
  if (paypalClient) return paypalClient;

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    logger.warn('PayPal credentials not configured');
    return null;
  }

  const environment =
    process.env.NODE_ENV === 'production'
      ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
      : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);

  paypalClient = new checkoutNodeJssdk.core.PayPalHttpClient(environment);
  return paypalClient;
}

/**
 * Crear una orden de PayPal
 */
export async function createPayPalOrder(
  amount: number,
  currency = 'USD'
): Promise<{ orderId: string }> {
  const client = getPayPalClient();

  if (!client) {
    throw new Error('PayPal not configured');
  }

  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toString(),
        },
      },
    ],
  });

  try {
    const response = await client.execute(request);
    const orderId = response.result.id;

    logger.info({ orderId }, 'PayPal order created');
    return { orderId };
  } catch (error) {
    logger.error({ error }, 'Error creating PayPal order');
    throw new Error('Failed to create PayPal order');
  }
}

/**
 * Capturar una orden de PayPal
 */
export async function capturePayPalOrder(
  orderId: string
): Promise<{ captureId: string; status: string }> {
  const client = getPayPalClient();

  if (!client) {
    throw new Error('PayPal not configured');
  }

  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const response = await client.execute(request);
    const captureId = response.result.purchase_units[0].payments.captures[0].id;
    const status = response.result.status;

    logger.info({ orderId, captureId, status }, 'PayPal order captured');
    return {
      captureId,
      status,
    };
  } catch (error) {
    logger.error({ error }, 'Error capturing PayPal order');
    throw new Error('Failed to capture PayPal order');
  }
}

/**
 * Verificar firma de webhook de PayPal
 */
export function verifyWebhookSignature(headers: any, body: any): boolean {
  if (!process.env.PAYPAL_WEBHOOK_ID) {
    logger.warn('PayPal webhook not configured');
    return false;
  }

  const signature = headers['paypal-transmission-sig'];
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  // Aquí deberías implementar la lógica para verificar la firma
  // Esto generalmente implica recuperar el certificado de PayPal y usarlo para verificar la firma

  return true; // Cambia esto según el resultado de la verificación
}
