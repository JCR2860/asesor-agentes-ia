const { clerkClient } = require('@clerk/nextjs/server');
require('dotenv').config({ path: '.env.local' });

async function run() {
    try {
        const client = await clerkClient();
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const users = await client.users.getUserList({ emailAddress: [adminEmail] });
        if (users.data && users.data.length > 0) {
            const adminUser = users.data[0];
            console.log("Admin user found:", adminUser.id);
            console.log("Current private metadata:", adminUser.privateMetadata);
        } else {
            console.log("Admin user not found");
        }
    } catch (e) {
        console.error(e);
    }
}
run();
