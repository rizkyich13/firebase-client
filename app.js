import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const outputPath = path.resolve('firebase_2000_anon_tokens.json');

if (!fs.existsSync(outputPath)) {
  fs.writeFileSync(outputPath, '[]', 'utf8'); 
}

function appendUserToken(userData) {
  const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  existing.push(userData);
  fs.writeFileSync(outputPath, JSON.stringify(existing, null, 2), 'utf8');
}

async function signInIsolatedUser(index) {
  const app = initializeApp(firebaseConfig, `app-${index}`);
  const auth = getAuth(app);
  try {
    const userCredential = await signInAnonymously(auth);
    const idToken = await userCredential.user.getIdToken();
    const uid = userCredential.user.uid;
    await deleteApp(app);
    return { uid, idToken };
  } catch (err) {
    await deleteApp(app);
    throw err;
  }
}

async function main() {
  const numberOfUsers = 2000;
  console.log(`\x1b[34mStarting ${numberOfUsers} anonymous sign-ins...\x1b[0m`);

  for (let i = 0; i < numberOfUsers; i++) {
    try {
      const { uid, idToken } = await signInIsolatedUser(i);
      const userData = { userIndex: i + 1, uid, idToken };
      appendUserToken(userData);
      process.stdout.write(`\r\x1b[32m✔ Signed in ${i + 1}/${numberOfUsers} users\x1b[0m`);
    } catch (err) {
      console.error(`\n\x1b[31mFailed to sign in user ${i + 1}: ${err.message}\x1b[0m`);

      if (err.code === 'auth/too-many-requests') {
        console.error(`\x1b[31mStopping due to rate limit.\x1b[0m`);
        break;
      }
    }
  }

  console.log(`\n\x1b[32m✔ All completed or stopped. Check ${outputPath}\x1b[0m`);
}

main();