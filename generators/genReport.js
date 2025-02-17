const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  const fs = require('fs').promises; // Import the fs.promises module

  const apiKey = "AIzaSyCpH5tVnakBLeeuvN3TBMJOQ3Zmw0bpnG0";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
  // ... existing code ...
async function generateReport(userQuestion, GeneratedQuery, opensearchResponse) {
    const prompt = `Analyze the technical query/response pair and convert it into clear business insights using these guidelines:
User intent : ${userQuestion}
Request Payload : ${GeneratedQuery}
Response : ${opensearchResponse}

1. Request Explanation
- Describe the query's purpose in simple terms
- Highlight key parameters: 
  * Date ranges
  * Sorting criteria
  * Aggregation metrics
  * Result limits

2. Response Breakdown
- State total matching records
- List top products with both:
  * Product name
  * Order count (for first example)
  * Total sales value (for second example)
- Note any partial/complete status

3. User Intent Mapping
- Explicitly connect results to original request
- Highlight if results meet requested item count

Format requirements:
- html format only, 
- No css needed
-do not mention it's html
- no \`\`\` in the end / starting
- the response should start and end with Div Tag

Example format:
<h3> Section 1 titile </h3>
<br/>
<p> Key point 1 </p>
<br/>
<p> Key point 2 </p>
<br/>
<h3> Section 2 titile </h3>
<br/>
<p> Key point 1 </p>
<br/>
<p> Key point 2 < /p>
`;

    const chatSession = model.startChat({
        generationConfig: {
            ...generationConfig,
            responseMimeType: "text/plain"
        },
        history: [],
    });

    const result = await chatSession.sendMessageStream(prompt);
    return result;
}
  
  module.exports = generateReport;