const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body ? (tryParse(body)) : null
        });
      });
    });
    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

function tryParse(str) {
  try { return JSON.parse(str); } catch (e) { return str; }
}

async function run() {
  console.log("====================================================");
  console.log("🧪 TESTING MUBA WRITER ACCOUNT LOGIN & ROLE SESSION");
  console.log("====================================================");

  // 1. Login with muba@gmail.com
  const loginRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'muba@gmail.com', password: 'writer123' });

  console.log(`[Step 1] Login Status: ${loginRes.statusCode}`);
  console.log(`[Step 1] User payload from login:`, loginRes.body?.user);

  const cookie = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0].split(';')[0] : '';

  // 2. Fetch /api/auth/me using session cookie
  const meRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { 'Cookie': cookie }
  });

  console.log(`[Step 2] GET /api/auth/me Status: ${meRes.statusCode}`);
  console.log(`[Step 2] Authenticated:`, meRes.body?.authenticated);
  console.log(`[Step 2] User role from server session:`, meRes.body?.user?.role);

  if (meRes.body?.user?.role === 'writer') {
    console.log("====================================================");
    console.log("✅ SUCCESS: muba@gmail.com is strictly verified as WRITER!");
    console.log("====================================================");
  } else {
    console.error("❌ ERROR: Expected role 'writer' but got:", meRes.body?.user?.role);
  }
}

run().catch(console.error);
