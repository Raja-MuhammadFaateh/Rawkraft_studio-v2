import crypto from 'crypto';

// Secret used to cryptographically sign session cookies
// In production, ADMIN_SESSION_SECRET must be set. Fallback derives from SUPABASE_SERVICE_ROLE_KEY or a stable local seed.
function getSigningKey(): Buffer {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'rawkraft-studio-default-dev-signing-key-32-chars-min!!';
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Hash a password using scrypt with random salt
 */
export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve({
        hash: derivedKey.toString('hex'),
        salt,
      });
    });
  });
}

/**
 * Verify a plaintext password against stored hash and salt (constant-time comparison)
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  return new Promise((resolve) => {
    if (!password || !storedHash || !salt) {
      return resolve(false);
    }
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return resolve(false);
      try {
        const storedBuffer = Buffer.from(storedHash, 'hex');
        if (storedBuffer.length !== derivedKey.length) {
          return resolve(false);
        }
        const matches = crypto.timingSafeEqual(storedBuffer, derivedKey);
        resolve(matches);
      } catch {
        resolve(false);
      }
    });
  });
}

export interface SessionPayload {
  id: string;
  email: string;
  role: string;
  fullName: string;
  issuedAt: number;
  expiresAt: number;
  nonce?: string;
}

/**
 * Sign a session payload with HMAC-SHA256
 */
export function signSessionPayload(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  const dataB64 = Buffer.from(json, 'utf-8').toString('base64url');
  const hmac = crypto.createHmac('sha256', getSigningKey());
  hmac.update(dataB64);
  const sigB64 = hmac.digest('base64url');
  return `${dataB64}.${sigB64}`;
}

/**
 * Verify and decode an HMAC-SHA256 signed session payload
 */
export function verifySessionToken(token: string): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [dataB64, sigB64] = parts;
  if (!dataB64 || !sigB64) return null;

  try {
    const hmac = crypto.createHmac('sha256', getSigningKey());
    hmac.update(dataB64);
    const expectedSig = hmac.digest('base64url');

    const sigBuf = Buffer.from(sigB64);
    const expectedBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expectedBuf.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const json = Buffer.from(dataB64, 'base64url').toString('utf-8');
    const payload = JSON.parse(json) as SessionPayload;

    // Verify expiry
    if (typeof payload.expiresAt !== 'number' || payload.expiresAt <= Date.now()) {
      return null;
    }

    if (!payload.id || !payload.email || !payload.role) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// In-Memory Rate Limiter for Login and Sensitive Endpoints
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Check and record a rate-limited action
 * Returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || record.resetAt <= now) {
    const newRecord: RateLimitRecord = { count: 1, resetAt: now + windowMs };
    rateLimitStore.set(key, newRecord);
    return { allowed: true, remaining: maxAttempts - 1, resetAt: newRecord.resetAt };
  }

  if (record.count >= maxAttempts) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: maxAttempts - record.count, resetAt: record.resetAt };
}

/**
 * Reset rate limit counter upon successful authentication
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}
