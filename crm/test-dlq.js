// test-dlq.js
// Script to test your DLQ Workflow in n8n
const axios = require('axios');

// IMPORTANT: Replace this URL with the Test URL from your n8n Webhook node
const WEBHOOK_URL = 'https://ko1.app.n8n.cloud/webhook-test/dlq-webhook';

const testPayloads = [
    {
        // ✅ SCENARIO: Single Valid Payload for Canvas Visualizing
        user_id: 'VALID_CANVAS_TESTER',
        event_type: 'purchase',
        source: 'dlq_tester'
    }
];

async function runTest() {
    console.log('🚀 Routing 3 test payloads to your n8n workflow...\n');
    
    for (const [index, payload] of testPayloads.entries()) {
        try {
            console.log(`[Req ${index + 1}] Sending...`);
            await axios.post(WEBHOOK_URL, payload);
            console.log(`✅ [Req ${index + 1}] Post Successful\n`);
        } catch (error) {
            console.error(`❌ [Req ${index + 1}] Failed HTTP Post: ${error.message}\n`);
        }
        
        // Wait 1 second between requests so you can watch n8n process them
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('🎉 Done! Check your n8n execution canvas.');
}

runTest();
