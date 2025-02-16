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
  
  async function generateQuery(user_input) {
    // Load the JSON data from the file
    async function loadJsonData(filePath) {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading or parsing JSON file:", error);
            return null;
        }
    }

    const jsonData = await loadJsonData('queryDSL_data.json');

    if (!jsonData) {
        return Promise.reject("Failed to load queryDSL_data.json");
    }
  
    const prompt =  `
 Generate Elasticsearch QueryDSL from Natural Language Requests
Analyze patterns from historical examples to create new queries

Historical Requests and Reponse : 
${JSON.stringify(jsonData)}

Core Pattern Requirements

1. Always include:
    - At least one terms aggregation for categorical analysis
    - A range filter with default dates (2023-02-01 to 2025-02-01) unless specified
    - Field validation using exists or match_phrase filters

2. Derive from user intent:
    - Primary aggregation type based on "top", "distribution", or "trend" keywords
    - Infer What user is asking exactly. 
    - Make sure the query matches with user's intent.
    - No unrelated queries allowed.W
    - Date field selection (orderDate vs paymentDate vs createdDate)
    - Price/numeric fields to include as sum/avg metrics

3. Critical Validation
   - Return "Query Can't Be Generated" only if:
   - No discernible categorical field in request
   - Missing both date range and numerical metric
   - Contradictory aggregations (e.g., terms + moving_avg)

4. Formatting rules
    - Strict JSON output (no markdown)",
    - Output should be a valid minified JSON
    - Include default date range: 2025-02-01 to 2025-02-01",
    - Size limit 5 for top results",
    - Field validation through 'exists' filter"

Output Requirement 
    - Output should be a Valid minfied JSON
    - Output starts with open Curly braces
    - Ouput Ends with close curly braces
    - No special charcters of any kind
    - no headers or footers of any kind

Task : Generate Elastisearch QuerDSL for - ${user_input}
`;
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
  
    const result = await chatSession.sendMessageStream(prompt);
    return result;
  }
  
  module.exports = generateQuery;