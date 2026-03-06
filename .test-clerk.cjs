const { clerkClient } = require('@clerk/nextjs/server');
require('dotenv').config({ path: '.env.local' });

async function run() {
    try {
        const client = await clerkClient();
        console.log("clerk success");
    } catch (e) {
        console.error("clerk error", e);
    }
}
run();
