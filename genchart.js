const axios = require('axios');

async function generateChart(userQuestion, GeneratedQuery, opensearchResponse) {
    const prompt = `
You are an expert data visualization assistant. Your task is to generate Echart JSON for visualizing data based on the following inputs:

1. User Question: ${userQuestion}
2. OpenSearch Request Payload: ${GeneratedQuery}
3. OpenSearch Response Data: ${opensearchResponse}

Analyze the provided information and create an appropriate Echart JSON configuration. Choose the most suitable chart type based on the data and user's intention. The output should be a complete, valid Echart JSON configuration that can be directly used for visualization.

Consider the following guidelines:
1. Select an appropriate chart type (e.g., bar, pie, line) based on the data and query.
2. Include all necessary components such as title, legend, tooltip, and axes if applicable.
3. Use appropriate color schemes and styling to enhance readability.
4. Ensure the data is correctly formatted and mapped to the chart.
5. Include any relevant labels or annotations to improve understanding.

Provide only the Echart JSON configuration as your response, without any explanations or additional text.
`;

    console.log("######3");
    console.log(prompt);

    const url = "https://ai-deepseekr1hubv2319984015583.openai.azure.com/openai/deployments/o3-mini/chat/completions?api-version=2024-12-01-preview";
    const apiKey = "74DtELNoYaDRM7Pn21CzKOXO4cW4qodZ12OU77444vTnTCvjh49XJQQJ99BBACHYHv6XJ3w3AAAAACOG5ES7";

    const headers = {
        "Content-Type": "application/json",
        "api-key": apiKey
    };

    const data = {
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    };

    try {
        const response = await axios.post(url, data, { headers: headers });
        const response_json = response.data;
        return response_json['choices'][0]['message']['content'];
    } catch (error) {
        console.error("Error calling Azure endpoint:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

module.exports = generateChart;