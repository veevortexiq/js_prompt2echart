const express = require('express');
const generateQuery = require('./queryGen');
const generateReport = require('./genReport')
const generateChart = require('./genchart'); // Import the generateChart function
const countTokens = require('./countTokens');
const saveDataToDB = require('./saveToDB');

const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3000;
app.use(cors());// Enable CORS for all origins

// Add middleware to parse JSON bodies
app.use(express.json());



// Middleware to log request info
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


app.post('/generateQuery', async (req, res) => {
  console.log('Entering /generateQuery handler'); // Debugging log
  const prompt = req.body.prompt;
  const index_name = req.body.index_name;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  try {
    accumulated_text = ""
    console.log(`Token Count : ${countTokens(prompt)}`)
    const stream = await generateQuery(prompt,index_name);

    // Set headers *before* starting to write to the response
    console.log('Setting headers...'); // Debugging log
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    console.log('Flushing headers...'); // Debugging log
    res.flushHeaders();

    console.log('Starting to stream data...'); // Debugging log
    for await (const chunk of stream.stream) {
      const text = chunk.candidates[0].content.parts[0].text;
      console.log('Sending chunk:', text); // Debugging log
      accumulated_text+=text;
      res.write(text);
    }
    res.end();
    console.log('Finished streaming data.'); // Debugging log
    console.log(`Token Count : ${countTokens(accumulated_text)}`);
    
saveDataToDB(prompt, accumulated_text, countTokens(prompt), countTokens(accumulated_text), "Gemini 2.0", "Generating Query DSL", "Success")
.then(insertId => {
    if (insertId) {
        console.log(`Data saved to database with ID: ${insertId}`);
    } else {
        console.log('Failed to save data to database.');
    }
})
.catch(error => {
    console.error('Error calling saveDataToDB:', error);
});
    
  } catch (error) {
    console.error('Error generating query:', error);
    res.status(500).json({ error: 'Failed to generate query' });
  }
});


app.post('/generateReport', async (req, res) => {
    console.log('Entering /generateReport handler');
    const { userQuestion, GeneratedQuery, opensearchResponse } = req.body;

    if (!userQuestion || !GeneratedQuery || !opensearchResponse) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      accumulated_text = ''
        const stream = await generateReport(userQuestion, GeneratedQuery, opensearchResponse);

        // Set headers *before* starting to write to the response
        console.log('Setting headers...'); // Debugging log
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        console.log('Flushing headers...'); // Debugging log
        res.flushHeaders();

        console.log('Starting to stream data...'); // Debugging log
        for await (const chunk of stream.stream) {
            const text = chunk.candidates[0].content.parts[0].text;
            console.log('Sending chunk:', text); // Debugging log
            accumulated_text+=text;
            res.write(text);
        }
        res.end();
        console.log('Finished streaming data.'); // Debugging log
        const prompt = `User Question : ${userQuestion}, Generated Query : ${GeneratedQuery}, Opensearch Response : ${opensearchResponse}`;
        saveDataToDB(prompt, accumulated_text, countTokens(prompt), countTokens(accumulated_text), "Gemini 2.0", "Generating Report", "Success")
.then(insertId => {
    if (insertId) {
        console.log(`Data saved to database with ID: ${insertId}`);
    } else {
        console.log('Failed to save data to database.');
    }
})
.catch(error => {
    console.error('Error calling saveDataToDB:', error);
});

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});


app.post('/generateChart', async (req, res) => {
    console.log('Entering /generateChart handler');
    const { userQuestion, GeneratedQuery, opensearchResponse } = req.body;

    if (!userQuestion || !GeneratedQuery || !opensearchResponse) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const chartJson = await generateChart(userQuestion, GeneratedQuery, opensearchResponse);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(chartJson); // Send the JSON directly

        const prompt = `User Question : ${userQuestion}, Generated Query : ${GeneratedQuery}, Opensearch Response : ${opensearchResponse}`;
        saveDataToDB(prompt, chartJson, countTokens(prompt), countTokens(chartJson), "Azure o3 mini", "Generating Chart", "Success")
.then(insertId => {
    if (insertId) {
        console.log(`Data saved to database with ID: ${insertId}`);
    } else {
        console.log('Failed to save data to database.');
    }
})
.catch(error => {
    console.error('Error calling saveDataToDB:', error);
});



    } catch (error) {
        console.error('Error generating chart:', error);
        res.status(500).json({ error: 'Failed to generate chart' });
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});