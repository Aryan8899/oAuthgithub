const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Load environment variables from .env file
require('dotenv').config();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// GitHub OAuth callback route
app.get('/callback', async (req, res) => {
  const code = req.query.code; // The code from GitHub
  
  if (!code) {
    return res.status(400).send('Code not provided');
  }

  try {
    // Exchange the code for an access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          accept: 'application/json',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Return the access token (In a real scenario, store this token securely)
    res.json({ accessToken });
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

// Create webhook route with improved error handling
app.post('/create-webhook', async (req, res) => {
  const { repo, owner, callbackUrl } = req.body;
  
  // Validate inputs
  if (!repo || !owner || !callbackUrl) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['repo', 'owner', 'callbackUrl']
    });
  }

  // Validate callback URL
  try {
    new URL(callbackUrl);
  } catch (e) {
    return res.status(400).json({
      error: 'Invalid callback URL',
      details: 'Please provide a valid URL that GitHub can reach'
    });
  }

  const accessToken = process.env.GITHUB_ACCESS_TOKEN; // Move token to .env file
  if (!accessToken) {
    return res.status(500).json({
      error: 'Server configuration error',
      details: 'GitHub access token not found'
    });
  }

  try {
    const response = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/hooks`,
      {
        name: 'web',
        active: true,
        events: ['pull_request'],
        config: {
          url: callbackUrl,
          content_type: 'json',
          insecure_ssl: '0'
        },
      },
      {
        headers: {
          Authorization: `token ${accessToken}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        },
      }
    );

    res.json({ 
      success: true, 
      webhook: response.data,
      message: 'Webhook created successfully'
    });
  } catch (error) {
    console.error('Webhook creation error:', error.response?.data || error.message);
    
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || 'An unknown error occurred';
    
    res.status(statusCode).json({
      error: 'Failed to create webhook',
      details: errorMessage,
      documentation_url: error.response?.data?.documentation_url
    });
  }
});

// Function to simulate AI model for PR review
const aiReviewPR = (prData) => {
  const prTitle = prData.title;
  const prBody = prData.body;
  // Here, you can integrate with an AI model like GPT-3/4 or your own logic
  return `AI Review for PR "${prTitle}": This looks great! Keep up the good work.`;
};

// Function to post PR comment using GitHub API
const postPRComment = async (owner, repo, prNumber, comment) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`;
  const accessToken = process.env.GITHUB_ACCESS_TOKEN;

  try {
    const response = await axios.post(url, {
      body: comment,
    }, {
      headers: {
        Authorization: `token ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Posted AI review comment: ${response.data.html_url}`);
  } catch (error) {
    console.error('Error posting comment:', error.response?.data || error.message);
  }
};

// Webhook endpoint to handle pull request events and AI review
app.post('/webhook', (req, res) => {
  const eventType = req.headers['x-github-event'];
  
  if (eventType === 'pull_request') {
    const prData = req.body.pull_request;
    const prNumber = prData.number;
    const repo = req.body.repository.name;
    const owner = req.body.repository.owner.login;

    // Get AI review for the PR
    const aiReview = aiReviewPR(prData);

    // Post the AI review as a comment on the PR
    postPRComment(owner, repo, prNumber, aiReview);
  }

  res.status(200).send('Webhook received');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
