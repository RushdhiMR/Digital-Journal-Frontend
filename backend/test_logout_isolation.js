const http = require('http');

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

async function runLogoutIsolationTest() {
  console.log('====================================================');
  console.log('🧪 RUNNING SESSION ISOLATION & LOGOUT TEST');
  console.log('====================================================');

  try {
    // 1. Establish 3 independent sessions
    const readerLogin = await makeRequest({ path: '/api/auth/login', method: 'POST' }, { email: 'reader@digitaljournal.com', password: 'reader123' });
    const writerLogin = await makeRequest({ path: '/api/auth/login', method: 'POST' }, { email: 'writer@digitaljournal.com', password: 'writer123' });
    const adminLogin = await makeRequest({ path: '/api/auth/login', method: 'POST' }, { email: 'admin@digitaljournal.com', password: 'admin123' });

    let readerCookie = readerLogin.cookies ? readerLogin.cookies[0].split(';')[0] : '';
    const writerCookie = writerLogin.cookies ? writerLogin.cookies[0].split(';')[0] : '';
    const adminCookie = adminLogin.cookies ? adminLogin.cookies[0].split(';')[0] : '';

    console.log('[Setup] Created 3 independent sessions: Reader, Writer, Admin.');

    // 2. Perform Logout on Reader session only
    console.log('\n[Action] Executing POST /api/auth/logout for Reader...');
    const logoutRes = await makeRequest({ path: '/api/auth/logout', method: 'POST' }, null, { Cookie: readerCookie });
    console.log('  Logout response status:', logoutRes.statusCode);
    console.log('  Logout set-cookie header:', logoutRes.cookies);

    // Update readerCookie to cleared cookie header from server response
    if (logoutRes.cookies && logoutRes.cookies[0]) {
      readerCookie = logoutRes.cookies[0].split(';')[0];
    } else {
      readerCookie = '';
    }

    // 3. Verify Reader session is now logged out
    const readerMeAfter = await makeRequest({ path: '/api/auth/me', method: 'GET' }, null, { Cookie: readerCookie });
    console.log('  Reader /api/auth/me after logout -> Status:', readerMeAfter.statusCode, '| Authenticated:', readerMeAfter.body?.authenticated);

    // 4. Verify Writer session remains active
    const writerMeAfter = await makeRequest({ path: '/api/auth/me', method: 'GET' }, null, { Cookie: writerCookie });
    console.log('  Writer /api/auth/me after Reader logout -> Status:', writerMeAfter.statusCode, '| Role:', writerMeAfter.body?.user?.role);

    // 5. Verify Admin session remains active
    const adminMeAfter = await makeRequest({ path: '/api/auth/me', method: 'GET' }, null, { Cookie: adminCookie });
    console.log('  Admin /api/auth/me after Reader logout -> Status:', adminMeAfter.statusCode, '| Role:', adminMeAfter.body?.user?.role);

    if (readerMeAfter.statusCode === 401 && writerMeAfter.body?.user?.role === 'writer' && adminMeAfter.body?.user?.role === 'admin') {
      console.log('\n====================================================');
      console.log('✅ SESSION ISOLATION & LOGOUT TEST PASSED 100%!');
      console.log('====================================================');
    } else {
      console.error('❌ Session isolation test failed!');
    }
  } catch (err) {
    console.error('❌ Error during logout test:', err);
  }
}

runLogoutIsolationTest();
