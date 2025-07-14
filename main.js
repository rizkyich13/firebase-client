import fetch from 'node-fetch';

const API_URL = 'https://staging-api.muslimverse.com/user-campaigns';
const ID_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ3YWU0OWM0YzlkM2ViODVhNTI1NDA3MmMzMGQyZThlNzY2MWVmZTEiLCJ0eXAiOiJKV1QifQ.eyJwcm92aWRlcl9pZCI6ImFub255bW91cyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9yc2stc3RnLW12IiwiYXVkIjoicnNrLXN0Zy1tdiIsImF1dGhfdGltZSI6MTc1MjQ4NTYwOSwidXNlcl9pZCI6IjRzY1ptT21lb2xTQmdUcnpkdGQ2OFB1aG1XaDIiLCJzdWIiOiI0c2NabU9tZW9sU0JnVHJ6ZHRkNjhQdWhtV2gyIiwiaWF0IjoxNzUyNDg1NjA5LCJleHAiOjE3NTI0ODkyMDksImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnt9LCJzaWduX2luX3Byb3ZpZGVyIjoiYW5vbnltb3VzIn19.GXO5Ww9Cs_kv48j0R6FUr645JfV3JVsKP69R8ASmxs7A7-PM6MGPprgmtLVUEXJal0f_eO8qfkhZ6_3_xgWecSFoVsOYPymEl1hrddygXsks6FxuUlXOS-Wez0JNk9K4NDNjfDHil-HYBzIqw7QdC2nyNv2tw6yIR1pxr2Hpf8AO4NezT_fM0O4nPFfCZPFF4KFsJ_go5fUc1CG_hfuyXn4VPreMwGnZKs-q9iBI6x_uUkFNOxFzwesjPRRi4-Tir84rBrnIQttp8Ip7kOqHF_GIecNKTx_e6axwDq3cnr2ISw8MRZXAlvICXiJ1E-QNMwlLtPSx2_un5zPM1F7cyQ'; // Replace with actual Firebase ID token

async function hitUserChallenges() {
  const headers = {
    'Content-Type': 'application/json',
    'authorization': ID_TOKEN, // optional, can be dynamically set
  };

  const body = {
   campaignId: "reczrSDoqs6OQwOEA",
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Response:', response.status, data);
  } catch (error) {
    console.error('Error hitting endpoint:', error);
  }
}

hitUserChallenges();