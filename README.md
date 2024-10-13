# Automatic GitHub PR Review System

This project is an automatic GitHub Pull Request (PR) review system that leverages GitHub's API, OAuth authentication, webhooks, and AI to review PRs automatically. When a new PR is created, the system reviews the changes using an AI model and posts the review as a comment on the PR.

## Features
- OAuth-based GitHub Authentication to obtain an access token.
- Automatic webhook creation for GitHub repositories.
- Automatically triggered AI review on new pull requests.
- Comments are posted directly on the PR with the AI-generated review.
  
## Tech Stack
- **Frontend:** React (or other framework) for the UI to handle GitHub OAuth.
- **Backend:** Node.js/Express (or another backend framework) to handle OAuth, webhooks, and GitHub API calls.
- **AI Model:** Any AI model or API (OpenAI GPT, custom model, etc.) for reviewing PRs.
- **GitHub API:** Used for OAuth, Webhooks, and posting comments on pull requests.

## Requirements
- Node.js
- A GitHub account with access to the repository you want to integrate.
- Ngrok (or any other tunneling service) to create a public URL for local development.
- Postman or cURL to test API endpoints (optional).
  
## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/automatic-pr-review.git
cd automatic-pr-review
```
### 2. Install Dependencies
For both the backend and frontend:
```bash
npm install
```
### 3. Start the Frontend App
```bash
npm start
```
### 4. change directory for backend code - (Configure Environment Variables)
Create a `env`file in the backend directory with the following details:
```bash
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:3000/auth/github/callback
WEBHOOK_CALLBACK_URL=https://your-ngrok-url/webhook
GITHUB_ACESS_TOKEN=your-githubacesstoken
```
### 5. Start the Backend Server
Make sure your backend server is running:
```bash
node index.js
```
### 6. Create Webhook for the Repository
Send a POST request to create a webhook for your GitHub repository.
Example Request:
```bash
POST /create-webhook
{
  "repo": "your-repo-name",
  "owner": "your-github-username",
  "callbackUrl": "https://your-ngrok-url/webhook"
}
```

### 7. Create a New Branch and Pull Request
- Create a new branch in the repository.
- Make changes and open a pull request.
- The webhook will trigger the AI-based PR review, and a comment will be automatically posted.

### 8. AI Review
When the PR is raised, the system will automatically generate a review using the AI model and post it as a comment on the pull request.

## Example Flow

1) User connects their GitHub account using OAuth.
2) A webhook is created for the repository using the backend API.
2) A pull request is opened, triggering the webhook.
4) The AI processes the PR changes and posts a review comment on GitHub.

##  Project Demo
Here is a screen recording ![Project Demo](video/assignmentgit.mp4). showing the flow from creating the PR to the AI posting a comment.
