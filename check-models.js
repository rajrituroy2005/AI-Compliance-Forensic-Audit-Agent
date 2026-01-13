// check-models.js
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY; 

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("Querying Google for available models...");

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      console.error("❌ API Error:", data.error.message);
    } else {
      console.log("✅ AVAILABLE MODELS:");
      // Filter only for 'generateContent' models
      const models = data.models
        .filter(m => m.supportedGenerationMethods.includes("generateContent"))
        .map(m => m.name); // This gives us the exact names
      console.log(models);
    }
  })
  .catch(err => console.error("❌ Network Error:", err));