import { NextRequest } from 'next/server';
import { logger } from './logger';
import crypto from 'crypto';

export function verifyAdminAuth(request: NextRequest): boolean {
  const apiKey = process.env.ADMIN_API_KEY;
  
  if (!apiKey) {
    logger.warn('ADMIN_API_KEY not configured');
    return false;
  }

  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === apiKey;
}

export function generateIdempotencyKey(...data: string[]): string {
  return crypto.createHash('sha256').update(data.join('-')).digest('hex');
}
