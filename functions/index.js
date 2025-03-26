import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createRequire } from 'node:module';

// Use Node.js built-in CommonJS require in an ES module
const require = createRequire(import.meta.url);
const functions = require('firebase-functions');

initializeApp();

const adminEmails = ['nautiluce@gmail.com'];

export const addAdminClaim = functions.auth.user().onCreate(async (user) => {
  if (user.email && adminEmails.includes(user.email)) {
    try {
      await getAuth().setCustomUserClaims(user.uid, { admin: true });
      console.log(`✅ Admin claim successfully set for ${user.email}`);
    } catch (error) {
      console.error(`❌ Failed to set admin claim for ${user.email}`, error);
    }
  } else {
    console.log(`🔹 No admin claim assigned to ${user.email}`);
  }
});
