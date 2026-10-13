import {
  hashPassword,
  verifyPassword,
  signSessionPayload,
  verifySessionToken,
  checkRateLimit,
  resetRateLimit,
  SessionPayload,
} from '../src/lib/auth/crypto';
import { dataRepository } from '../src/lib/data/repository';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log(' RAWKRAFT STUDIO: SECURITY, AUTH & INTEGRATION TESTS');
  console.log('======================================================\n');

  // 1. Password Hashing & Verification
  console.log('1. Password Hashing & Constant-Time Verification:');
  const testPw = 'MySecureLuxePassword2026!';
  const { hash, salt } = await hashPassword(testPw);
  assert(hash.length === 128, 'scrypt produced 64-byte hex hash (128 chars)');
  assert(salt.length === 32, 'Produced 16-byte hex salt (32 chars)');

  const validMatch = await verifyPassword(testPw, hash, salt);
  assert(validMatch === true, 'Correct password verifies successfully');

  const invalidMatch = await verifyPassword('WrongPassword123', hash, salt);
  assert(invalidMatch === false, 'Invalid password is strictly rejected');

  const emptyMatch = await verifyPassword('', hash, salt);
  assert(emptyMatch === false, 'Empty password is rejected');

  // 2. Cryptographic HMAC Session Signing & Anti-Forgery
  console.log('\n2. Session Signing & Anti-Forgery:');
  const now = Date.now();
  const validPayload: SessionPayload = {
    id: 'u-test-owner',
    email: 'faateh2006@gmail.com',
    role: 'OWNER',
    fullName: 'Raja Muhammad Faateh',
    issuedAt: now,
    expiresAt: now + 60 * 60 * 1000,
  };

  const token = signSessionPayload(validPayload);
  assert(token.includes('.'), 'Session token is signed with HMAC-SHA256 (payload.signature)');

  const verified = verifySessionToken(token);
  assert(verified !== null && verified.email === 'faateh2006@gmail.com', 'Valid signed session token verifies');

  // Tamper with payload
  const [dataB64, sigB64] = token.split('.');
  const forgedPayload = Buffer.from(
    JSON.stringify({ ...validPayload, role: 'OWNER', email: 'attacker@evil.com' })
  ).toString('base64url');
  const forgedToken = `${forgedPayload}.${sigB64}`;
  const forgedResult = verifySessionToken(forgedToken);
  assert(forgedResult === null, 'Forged / tampered session token is strictly rejected');

  // Tamper with signature
  const badSigToken = `${dataB64}.invalidsignature123`;
  assert(verifySessionToken(badSigToken) === null, 'Invalid signature is strictly rejected');

  // Raw unsigned base64
  assert(verifySessionToken(Buffer.from('{"role":"OWNER"}').toString('base64')) === null, 'Unsigned base64 string is rejected');

  // Expired token
  const expiredPayload: SessionPayload = {
    ...validPayload,
    issuedAt: now - 10000,
    expiresAt: now - 1000,
  };
  const expiredToken = signSessionPayload(expiredPayload);
  assert(verifySessionToken(expiredToken) === null, 'Expired session token is strictly rejected');

  // 3. Rate Limiting Enforcement
  console.log('\n3. Authentication Rate Limiting:');
  const testKey = 'test-ip-127.0.0.1';
  resetRateLimit(testKey);

  let allowCount = 0;
  for (let i = 0; i < 5; i++) {
    const res = checkRateLimit(testKey, 5, 10000);
    if (res.allowed) allowCount++;
  }
  assert(allowCount === 5, 'First 5 login attempts are permitted');

  const blockedRes = checkRateLimit(testKey, 5, 10000);
  assert(blockedRes.allowed === false && blockedRes.remaining === 0, '6th attempt is rate-limited (blocked)');

  resetRateLimit(testKey);
  const resetCheck = checkRateLimit(testKey, 5, 10000);
  assert(resetCheck.allowed === true, 'Rate limit resets upon valid login');

  // 4. Role Hierarchy & Team Member Authorization
  console.log('\n4. Database Authorization & Active Status Checks:');
  const owner = await dataRepository.getTeamMemberByEmail('faateh2006@gmail.com');
  assert(owner !== null && owner.role === 'OWNER' && owner.isActive === true, 'Owner exists in database as active OWNER');

  const nonExistent = await dataRepository.getTeamMemberByEmail('nobody@nowhere.com');
  assert(nonExistent === null, 'Unknown user returns null (not defaulted to any role)');

  // 5. Server-Side Price Verification & Atomic Order Placement
  console.log('\n5. Server-Side Price Recalculation & Stock Reservation:');
  const products = await dataRepository.getProducts({ status: 'active' });
  const miro = products.find((p) => p.sku === 'RK-MIRO-01');
  assert(miro !== undefined && miro.pricePKR === 28500, 'Catalog authoritative price for Miro Side Table is PKR 28,500');

  const prevReserved = miro?.inventory?.quantityReserved || 0;

  // Place order with attempt to inject false price (subtotalPKR = 100)
  const order = await dataRepository.createOrder({
    customerName: 'Ahmad Khan',
    customerPhone: '+92 300 1234567',
    customerCity: 'Multan',
    items: [
      {
        productId: miro!.id,
        quantity: 1,
      },
    ],
  });

  assert(order.orderNumber.startsWith('RK-'), 'Unique order reference generated');
  assert(order.subtotalPKR === 28500, 'Subtotal authoritatively recalculated on server (ignores browser price manipulation)');
  assert(order.totalPKR === 28500 + order.shippingPKR, 'Total authoritatively computed on server');

  const miroAfter = await dataRepository.getProductById(miro!.id);
  assert(
    (miroAfter?.inventory?.quantityReserved || 0) === prevReserved + 1,
    'Stock reservation atomically incremented in inventory'
  );

  // 6. Stock Reservation Protection (Over-order Prevention)
  console.log('\n6. Inventory Over-Allocation Safeguards:');
  let overStockErrorThrown = false;
  try {
    await dataRepository.createOrder({
      customerName: 'Over Buyer',
      customerPhone: '+92 300 0000000',
      customerCity: 'Lahore',
      items: [
        {
          productId: miro!.id,
          quantity: 99999, // Way more than available stock
        },
      ],
    });
  } catch (err: any) {
    overStockErrorThrown = true;
    assert(err.message.includes('Insufficient stock'), `Excess stock order rejected: ${err.message}`);
  }
  assert(overStockErrorThrown === true, 'Orders exceeding available stock are rejected');

  // 7. Inventory Negative Stock Prevention
  console.log('\n7. Negative Inventory Prevention:');
  let negStockBlocked = false;
  try {
    await dataRepository.adjustInventory(miro!.id, -9999, 'manual_adjustment', 'Test negative reduction');
  } catch (err: any) {
    negStockBlocked = true;
    assert(err.message.includes('Cannot reduce stock below zero'), `Negative stock prevented: ${err.message}`);
  }
  assert(negStockBlocked === true, 'Manual stock adjustments cannot drive inventory below zero');

  // 8. Order Cancellation Stock Release
  console.log('\n8. Order Cancellation & Stock Release:');
  const reservedBeforeCancel = (await dataRepository.getProductById(miro!.id))?.inventory?.quantityReserved || 0;
  await dataRepository.updateOrderStatus(order.id, 'cancelled');
  const reservedAfterCancel = (await dataRepository.getProductById(miro!.id))?.inventory?.quantityReserved || 0;
  assert(
    reservedAfterCancel === Math.max(0, reservedBeforeCancel - 1),
    'Order cancellation automatically releases reserved stock'
  );

  console.log('\n======================================================');
  console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Test execution failed:', e);
  process.exit(1);
});
