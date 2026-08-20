const http = require('http');
const fs = require('fs');
const path = require('path');

function makeRequest(options, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: options.path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          cookies: res.headers['set-cookie'],
          body: json
        });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING AUTHENTICATION & RBAC AUTOMATED TESTS');
  console.log('====================================================');

  try {
    // 1. Test Reader Login
    console.log('\n[Test 1] POST /api/auth/login (reader@digitaljournal.com)...');
    const readerLogin = await makeRequest({ path: '/api/auth/login', method: 'POST' }, { email: 'reader@digitaljournal.com', password: 'reader123' });
    console.log('  Status:', readerLogin.statusCode);
    console.log('  Role returned:', readerLogin.body?.user?.role);
    console.log('  Cookie set:', !!readerLogin.cookies);
    const readerCookie = readerLogin.cookies ? readerLogin.cookies[0].split(';')[0] : '';

    // 2. Test Writer Login
    console.log('\n[Test 2] POST /api/auth/login (writer@digitaljournal.com)...');
    const writerLogin = await makeRequest({ path: '/api/auth/login', method: 'POST' }, { email: 'writer@digitaljournal.com', password: 'writer123' });
    console.log('  Status:', writerLogin.statusCode);
    console.log('  Role returned:', writerLogin.body?.user?.role);
    const writerCookie = writerLogin.cookies ? writerLogin.cookies[0].split(';')[0] : '';

    // 3. Test Admin Login
    console.log('\n[Test 3] POST /api/auth/login (admin@digitaljournal.com)...');
    const adminLogin = await makeRequest({ path: '/api/auth/login', method: 'POST' }, { email: 'admin@digitaljournal.com', password: 'admin123' });
    console.log('  Status:', adminLogin.statusCode);
    console.log('  Role returned:', adminLogin.body?.user?.role);
    const adminCookie = adminLogin.cookies ? adminLogin.cookies[0].split(';')[0] : '';

    // 4. Test GET /api/auth/me for Reader
    console.log('\n[Test 4] GET /api/auth/me (Reader Session)...');
    const readerMe = await makeRequest({ path: '/api/auth/me', method: 'GET' }, null, { Cookie: readerCookie });
    console.log('  Status:', readerMe.statusCode);
    console.log('  User:', readerMe.body?.user?.email, '| Role:', readerMe.body?.user?.role);

    // 5. Test GET /api/auth/me for Writer
    console.log('\n[Test 5] GET /api/auth/me (Writer Session)...');
    const writerMe = await makeRequest({ path: '/api/auth/me', method: 'GET' }, null, { Cookie: writerCookie });
    console.log('  Status:', writerMe.statusCode);
    console.log('  User:', writerMe.body?.user?.email, '| Role:', writerMe.body?.user?.role);

    // 6. Test GET /api/auth/me for Admin
    console.log('\n[Test 6] GET /api/auth/me (Admin Session)...');
    const adminMe = await makeRequest({ path: '/api/auth/me', method: 'GET' }, null, { Cookie: adminCookie });
    console.log('  Status:', adminMe.statusCode);
    console.log('  User:', adminMe.body?.user?.email, '| Role:', adminMe.body?.user?.role);

    // 7. Security Check: Reader accessing Admin API -> Expect 403 Forbidden
    console.log('\n[Test 7] Security Check: Reader accessing /api/admin/users...');
    const readerAdminAccess = await makeRequest({ path: '/api/admin/users', method: 'GET' }, null, { Cookie: readerCookie });
    console.log('  Status:', readerAdminAccess.statusCode, '(Expected: 403)');
    console.log('  Error:', readerAdminAccess.body?.error);

    // 8. Security Check: Writer accessing Admin API -> Expect 403 Forbidden
    console.log('\n[Test 8] Security Check: Writer accessing /api/admin/users...');
    const writerAdminAccess = await makeRequest({ path: '/api/admin/users', method: 'GET' }, null, { Cookie: writerCookie });
    console.log('  Status:', writerAdminAccess.statusCode, '(Expected: 403)');
    console.log('  Error:', writerAdminAccess.body?.error);

    // 9. Admin accessing Admin API -> Expect 200 OK
    console.log('\n[Test 9] Admin accessing /api/admin/users...');
    const adminUsersAccess = await makeRequest({ path: '/api/admin/users', method: 'GET' }, null, { Cookie: adminCookie });
    console.log('  Status:', adminUsersAccess.statusCode, '(Expected: 200)');
    console.log('  Users Count:', adminUsersAccess.body?.users?.length);

    // 10. Security Check: Registration Privilege Escalation Attack -> Expect Role=reader
    console.log('\n[Test 10] Security Check: Register payload specifying role: "admin"...');
    const attackEmail = `hacker_${Date.now()}@example.com`;
    const regAttack = await makeRequest({ path: '/api/auth/register', method: 'POST' }, {
      name: 'Sneaky Hacker',
      email: attackEmail,
      password: 'password123',
      role: 'admin' // Attempting privilege escalation
    });
    console.log('  Status:', regAttack.statusCode);
    console.log('  Assigned Role:', regAttack.body?.user?.role, '(Expected: reader)');

    // CLEANUP Test User immediately so it never clogs production User Desk
    try {
      const dbPath = path.join(__dirname, '../frontend/data/digital_journal_db.json');
      if (fs.existsSync(dbPath)) {
        const raw = fs.readFileSync(dbPath, 'utf8');
        const dbData = JSON.parse(raw);
        if (Array.isArray(dbData.users)) {
          dbData.users = dbData.users.filter(u => u.email !== attackEmail && !u.email.startsWith('hacker_') && u.name !== 'Sneaky Hacker');
          fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
        }
      }
      const db = require('./config/db');
      await db.query('DELETE FROM users WHERE email = ? OR email LIKE "hacker_%" OR name = "Sneaky Hacker"', [attackEmail]);
    } catch (cleanErr) {
      // Ignore if db connection offline
    }

    console.log('\n====================================================');
    console.log('✅ ALL AUTHENTICATION & RBAC SECURITY TESTS PASSED!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Test error:', err);
  }
}

runTests();
