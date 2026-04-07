// heavy-test.js
// Stress-testing script for CRM events (10 Perfect, 90 Imperfect Payloads)
const axios = require('axios');

// CHANGE THIS to your Production Webhook URL (no -test)
const WEBHOOK_URL = 'https://ko1.app.n8n.cloud/webhook/dlq-webhook'; 

const userEvents = ['signup', 'login', 'purchase', 'refund', 'profile_update'];

async function firePayload(id, isValid) {
    const payload = {
        user_id: isValid ? `PERFECT_USER_${id}` : null, // If valid, it gets a user_id. If not, it's null.
        event_type: userEvents[Math.floor(Math.random() * userEvents.length)],
        source: 'Heavy_Test_Simulator',
        timestamp: new Date().toISOString(),
        metadata: { batch: 'stress-test-mixed' }
    };

    try {
        const start = Date.now();
        const res = await axios.post(WEBHOOK_URL, payload);
        const duration = Date.now() - start;
        console.log(`✅ [Req ${id}] Status: ${res.status} | Time: ${duration}ms | Success: ${isValid}`);
    } catch (err) {
        console.error(`❌ [Req ${id}] Failed: ${err.message}`);
    }
}

async function runMixedTest() {
    console.log(`🚀 WARNING: Initiating Mixed Load Test...`);
    console.log(`Blasting 10 Perfect and 90 Imperfect payloads to n8n + Supabase!\n`);
    
    const startTime = Date.now();
    const requests = [];

    // 1. Queue 10 Perfect (Success) Payloads
    for (let i = 1; i <= 10; i++) {
        requests.push(firePayload(i, true));
    }

    // 2. Queue 90 Imperfect (Failed) Payloads
    for (let i = 11; i <= 100; i++) {
        requests.push(firePayload(i, false));
    }

    // Fire them all concurrently!
    await Promise.all(requests);
    
    const totalTime = (Date.now() - startTime) / 1000;
    console.log(`\n🎉 Test Complete in ${totalTime.toFixed(2)} seconds!`);
    console.log(`📊 Check Supabase: 10 new rows in 'user_events' | 90 new logs in 'quarantine_logs'.`);
}

runMixedTest();
