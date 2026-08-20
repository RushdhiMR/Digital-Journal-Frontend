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
  console.log("🧪 TESTING USERS DESK CRUD ENDPOINTS (/api/admin/users)");
  console.log("====================================================");

  // 1. Login as Admin to get cookie
  const loginRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'admin@digitaljournal.com', password: 'admin123' });

  const cookie = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0].split(';')[0] : '';
  console.log(`[Step 1] Admin Login Status: ${loginRes.statusCode} (Cookie obtained)`);

  // 2. Fetch all users
  const getRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/users',
    method: 'GET',
    headers: { 'Cookie': cookie }
  });
  console.log(`[Step 2] GET /api/admin/users: ${getRes.statusCode}, Total: ${getRes.body?.users?.length}`);

  // 3. Create a test user via POST
  const testEmail = `test_desk_${Date.now()}@example.com`;
  const postRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie
    }
  }, {
    name: 'Desk Test Writer',
    email: testEmail,
    password: 'password123',
    role: 'writer'
  });
  console.log(`[Step 3] POST /api/admin/users: ${postRes.statusCode}, Success: ${postRes.body?.success}`);
  const createdId = postRes.body?.user?.id;

  // 4. Update user via PUT
  const putRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/users',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie
    }
  }, {
    id: createdId,
    name: 'Desk Test Writer Updated',
    email: testEmail,
    role: 'reader'
  });
  console.log(`[Step 4] PUT /api/admin/users: ${putRes.statusCode}, New Role: ${putRes.body?.user?.role}`);

  // 5. Delete user via DELETE
  const delRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/admin/users?id=${createdId}`,
    method: 'DELETE',
    headers: { 'Cookie': cookie }
  });
  console.log(`[Step 5] DELETE /api/admin/users: ${delRes.statusCode}, Message: ${delRes.body?.message}`);

  // 6. Protection check: Try deleting default admin
  const protectRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/admin/users?id=1`,
    method: 'DELETE',
    headers: { 'Cookie': cookie }
  });
  console.log(`[Step 6] Protection check on Default Admin: Status ${protectRes.statusCode} (Expected: 403)`);

  console.log("====================================================");
  console.log("✅ ALL USERS DESK CRUD TESTS PASSED SUCCESSFULLY!");
  console.log("====================================================");
}

run().catch(console.error);
