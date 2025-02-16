const express = require('express');
const generateQuery = require('./queryGen');
const generateReport = require('./genReport')
const generateChart = require('./genchart'); // Import the generateChart function

const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3000;

// Add middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// Middleware to log request info
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.post('/generateQuery', async (req, res) => {
  console.log('Entering /generateQuery handler'); // Debugging log
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  try {
    const stream = await generateQuery(prompt);

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
      res.write(text);
    }
    res.end();
    console.log('Finished streaming data.'); // Debugging log
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
            res.write(text);
        }
        res.end();
        console.log('Finished streaming data.'); // Debugging log
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
    } catch (error) {
        console.error('Error generating chart:', error);
        res.status(500).json({ error: 'Failed to generate chart' });
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});