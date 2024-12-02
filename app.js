import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import readlineSync from 'readline-sync'; 
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

async function signInAndGenerateToken(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
   
    return idToken;
  } catch (error) {
    console.error("Error signing in:", error.message);
    console.error("Error code:", error.code);
    throw error;
  }
}

const email = readlineSync.question('Enter email: ');
const password = readlineSync.question('Enter password: ', { hideEchoBack: true }); // Hides password input

(async () => {
  console.log("\n\x1b[34mSigning in...\x1b[0m");

  try {
    const idToken = await signInAndGenerateToken(email, password);
    
    console.log("\n\x1b[32m✔ Successfully signed in!\x1b[0m\n");
    console.log("\x1b[1m\x1b[36mGenerated ID Token:\x1b[0m");
    console.log("\x1b[1m\x1b[37m" + idToken + "\x1b[0m\n");

  } catch (error) {
    console.error("Error during sign-in:", error);
  }
})();
