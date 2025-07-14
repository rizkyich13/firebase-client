import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import fs from 'fs'; 
import dotenv from 'dotenv'; 

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function signInAnonymouslyAndGetTokenAndUid() {
  try {
    const userCredential = await signInAnonymously(auth);
    const idToken = await userCredential.user.getIdToken();
    const uid = userCredential.user.uid;
    return { idToken, uid };
  } catch (error) {
    console.error("\x1b[31mError during anonymous sign-in:\x1b[0m", error.message);
    throw error;
  }
}


async function main() {
  const numberOfUsers = 2000;
  const userTokens = [];
  const outputPath = 'firebase_2000_anon_tokens.json';

  console.log(`\x1b[34mAttempting to sign in ${numberOfUsers} anonymous users and collect their tokens...\x1b[0m`);

  for (let i = 0; i < numberOfUsers; i++) {
    try {
      const { idToken, uid } = await signInAnonymouslyAndGetTokenAndUid();
      userTokens.push({ userIndex: i + 1, uid, idToken });
      process.stdout.write(`\r\x1b[32m✔ Signed in user ${i + 1}/${numberOfUsers}\x1b[0m`); // Progress indicator
    } catch (error) {
      console.error(`\n\x1b[31mFailed to sign in user ${i + 1}: ${error.message}\x1b[0m`);
    }
  }
  console.log(`\n\x1b[32m✔ Successfully collected tokens for ${userTokens.length} users.\x1b[0m`);

  const outputData = {
    totalUsersAttempted: numberOfUsers,
    totalUsersSignedin: userTokens.length,
    tokens: userTokens,
    timestampSaved: new Date().toISOString()
  };

  // Write the combined data to a JSON file
  console.log(`\x1b[34mSaving collected tokens to ${outputPath}...\x1b[0m`);
  try {
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`\x1b[32m✔ Tokens successfully saved to ${outputPath}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31mError saving data to ${outputPath}:\x1b[0m`, error.message);
  }

  console.log("\n\x1b[1m\x1b[36mProcess complete.\x1b[0m");
}

main();
