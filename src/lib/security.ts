import { NextRequest } from 'next/server';
import { logger } from './logger';

/**
 * Verificar autenticación de administrador
 */
export function verifyAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const apiKey = process.env.ADMIN_API_KEY;

  if (!apiKey) {
    logger.error('ADMIN_API_KEY not configured');
    return false;
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === apiKey;
}

/**
 * Sanitizar entrada de usuario
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Generar un ID idempotente para operaciones
 */
export function generateIdempotencyKey(prefix: string, ...parts: string[]): string {
  return `${prefix}:${parts.join(':')}`;
}
