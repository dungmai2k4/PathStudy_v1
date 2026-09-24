const http = require('http');

function post(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let respData = '';
      res.on('data', chunk => respData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(respData) });
        } catch(e) {
          resolve({ status: res.statusCode, raw: respData });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'GET',
      headers,
    }, (res) => {
      let respData = '';
      res.on('data', chunk => respData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(respData) });
        } catch(e) {
          resolve({ status: res.statusCode, raw: respData });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('1. Đăng nhập student...');
  const loginRes = await post('http://localhost:8081/api/v1/auth/login', {
    username: 'student',
    password: '123456'
  });
  console.log('Login Response:', JSON.stringify(loginRes.body));
  const userData = loginRes.body?.data;
  const token = userData?.token;
  const studentId = userData?.user?.userId || userData?.userId;
  console.log('Đăng nhập thành công! User ID:', studentId);

  const authHeaders = { 'Authorization': `Bearer ${token}` };

  console.log('\n2. Sinh Placement Test cho môn Tiếng Anh 10...');
  const subjectId = '11111111-1111-1111-1111-111111111101';
  const testRes = await post('http://localhost:8084/api/v1/assessments/placement/generate', {
    subjectId: subjectId,
    studentId: studentId
  });
  console.log('Kết quả tạo Placement Test status:', testRes.status);
  const testData = testRes.body.data;
  const attemptId = testData.attemptId;
  console.log('Test Attempt ID:', attemptId);
  console.log('Tổng số câu hỏi trong bài test:', (testData.questions || []).length);
  console.log('Thời gian làm bài (phút):', testData.timeLimitMinutes);

  // Thống kê câu hỏi theo module / topic
  const topicCounts = {};
  for (const q of (testData.questions || [])) {
    topicCounts[q.topicId] = (topicCounts[q.topicId] || 0) + 1;
  }
  console.log('Phân bố câu hỏi theo topicId trong đề thi:');
  console.log(topicCounts);

  console.log('\n3. Nộp bài test (mô phỏng nộp bài có đáp án đúng/sai để khảo sát năng lực)...');
  const answers = (testData.questions || []).map((q, idx) => ({
    questionId: q.questionId || q.id,
    selectedOptionId: (q.options && q.options.length > 0) ? q.options[0].id : null,
  }));
  const submitRes = await post(`http://localhost:8084/api/v1/assessments/${attemptId}/submit`, { answers });
  console.log('Kết quả nộp bài status:', submitRes.status);
  console.log('Chi tiết kết quả nộp bài:', JSON.stringify(submitRes.body));

  console.log('\n4. Gọi Adaptive Learning Service để sinh Lộ trình học từ kết quả bài test...');
  const pathRes = await post('http://localhost:8085/api/v1/adaptive/study-path/generate', {
    studentId: studentId,
    subjectId: subjectId,
    assessmentAttemptId: attemptId
  });
  console.log('Kết quả sinh lộ trình status:', pathRes.status);
  const pathData = pathRes.body.data;
  console.log('Study Path ID:', pathData?.id);
  console.log('Tổng số nodes trong lộ trình:', (pathData?.nodes || []).length);

  // Group nodes by moduleId
  const modGroups = {};
  for (const node of (pathData.nodes || [])) {
    const mId = node.moduleId || 'UNKNOWN';
    if (!modGroups[mId]) modGroups[mId] = [];
    modGroups[mId].push({
      sequenceOrder: node.sequenceOrder,
      skillName: node.skillName,
      status: node.status,
      moduleName: node.moduleName,
      topicId: node.topicId,
      proficiencyLevel: node.proficiencyLevel,
      priorityReason: node.priorityReason
    });
  }

  console.log('\n=== CẤU TRÚC LỘ TRÌNH HỌC TẠO RA DỰA TRÊN CẤU TRÚC DYNAMIC MODULES ===');
  for (const [mId, nodes] of Object.entries(modGroups)) {
    console.log(`\n* Module: [${nodes[0]?.moduleName || 'N/A'}] (ID: ${mId}) - Có ${nodes.length} topics:`);
    for (const n of nodes) {
      console.log(`   - [Thứ tự: ${n.sequenceOrder}] [Trạng thái: ${n.status}] ${n.skillName}`);
      console.log(`     -> Lý do phân bổ: ${n.priorityReason}`);
    }
  }
}

run().catch(console.error);
