const fs = require('fs');

const BASE = 'http://localhost:8082/api/v1/content';
const SUBJECT_ID = '11111111-1111-1111-1111-111111111101';
const headers = { 'Content-Type': 'application/json' };

async function post(url, data) {
  try {
    const res = await fetch(BASE + url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) {
      console.error('POST ' + url + ' error:', json);
      return {};
    }
    return json.data || {};
  } catch (err) {
    console.error('Fetch POST ' + url + ' error:', err.message);
    return {};
  }
}

async function del(url) {
  try {
    const res = await fetch(BASE + url, { method: 'DELETE', headers });
    if (!res.ok && res.status !== 404) {
      console.warn('DELETE ' + url + ' status:', res.status);
    }
  } catch (err) {
    console.warn('DELETE ' + url + ' error:', err.message);
  }
}

async function get(url) {
  try {
    const res = await fetch(BASE + url, { headers });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Fetch GET ' + url + ' error:', err.message);
    return [];
  }
}

async function cleanOldData() {
  console.log('=== BUOC 1: XOA DU LIEU CU TIENG ANH 10 ===');
  const modules = await get('/subjects/' + SUBJECT_ID + '/modules');
  console.log('Tim thay ' + modules.length + ' modules cu:');
  for (const mod of modules) {
    console.log('-> Xoa module: ' + (mod.name || mod.id));
    const topics = await get('/modules/' + mod.id + '/topics');
    for (const topic of topics) {
      console.log('   -> Xoa topic: ' + topic.name);
      const lessons = await get('/topics/' + topic.id + '/lessons');
      for (const les of lessons) {
        await del('/lessons/' + les.id);
      }
      await del('/topics/' + topic.id);
    }
    await del('/modules/' + mod.id);
  }
  console.log('[OK] Da xoa sach toan bo du lieu cu cua Tieng Anh 10!');
}

cleanOldData().catch(console.error);
