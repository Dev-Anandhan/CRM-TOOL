// mock-crm.js
// A stress-testing script to simulate high-volume CRM events
const axios = require('axios');

// REPLACE THIS with your n8n Webhook Test URL
const WEBHOOK_URL = 'http://localhost:5678/webhook-test/shadowlens-audit-ingest'; 
const TOTAL_REQUESTS = 100;

// The 20+ user events we want to simulate
const userEvents = [
    'consent_check', 'user_signup', 'data_request', 
    'password_reset', 'profile_update', 'subscription_renewed'
];

async function fireWebhook(requestId) {
    // Generate a random mock payload
    const payload = {
        user_id: `DEV_USER_${Math.floor(Math.random() * 9000) + 1000}`,
        event_type: userEvents[Math.floor(Math.random() * userEvents.length)],
        source: 'ShadowLens_Mock_CRM'
    };

    try {
        const response = await axios.post(WEBHOOK_URL, payload);
        console.log(`✅ [Req ${requestId}] Success: ${payload.event_type} | Status: ${response.status}`);
    } catch (error) {
        console.error(`❌ [Req ${requestId}] Failed: ${error.message}`);
    }
}

async function runStressTest() {
    console.log(`🚀 Initiating ShadowLens Stress Test...`);
    console.log(`Blasting ${TOTAL_REQUESTS} concurrent payloads to the Redis Queue... \n`);
    
    const requests = [];

    // The 'for' loop creates the requests, but Promise.all fires them concurrently
    for (let i = 1; i <= TOTAL_REQUESTS; i++) {
        requests.push(fireWebhook(i));
    }

    // Await all 100 requests to finish simultaneously
    await Promise.all(requests);
    
    console.log(`\n🎉 Test Complete! Check your n8n Executions tab to see the Worker processing the queue.`);
}

runStressTest();
