# CRM Tool

A lightweight CRM event simulation and n8n integration setup for testing webhook-driven workflows and queue-based execution.

This project combines:
- a mock CRM data generator in `crm/`
- a Redis-backed queue setup
- n8n workers and web UI via Docker Compose

## Overview

The repository is designed to simulate high-volume CRM events and push them into an n8n webhook endpoint. The mock CRM script generates events such as:
- consent_check
- user_signup
- data_request
- password_reset
- profile_update
- subscription_renewed

These events are sent to the configured n8n webhook, where workflows can process them asynchronously using the queue execution mode.

## Project Structure

```text
.
├── crm/
│   ├── mock-crm.js
│   ├── heavy-test.js
│   ├── test-dlq.js
│   ├── package.json
│   └── package-lock.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Prerequisites

Before starting, make sure you have:
- Docker and Docker Compose installed
- Node.js v18+ and npm
- Access to an n8n instance or local n8n via Docker

## Environment Setup

Create a `.env` file in the project root with the following values:

```env
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_password_here
```

## Start the Services

From the repository root, run:

```bash
docker compose up -d
```

This starts:
- Redis on port `6379`
- n8n on port `5678`
- a worker service configured for queue execution

## Run the Mock CRM Generator

Open the `crm` directory and install dependencies:

```bash
cd crm
npm install
```

Then start the mock CRM stress test:

```bash
npm start
```

The script sends concurrent mock payloads to the n8n webhook URL configured in `crm/mock-crm.js`:

```js
const WEBHOOK_URL = 'http://localhost:5678/webhook-test/shadowlens-audit-ingest';
```

Update this URL if your workflow uses a different webhook path.

## What the Script Does

`mock-crm.js`:
- generates randomized CRM user events
- sends them as HTTP POST requests
- logs success/failure status for each request
- submits multiple requests in parallel to stress-test queue processing

## Useful Files

- `crm/mock-crm.js` — simple CRM event sender
- `crm/heavy-test.js` — more intensive version of event testing
- `crm/test-dlq.js` — dead-letter queue testing utility
- `docker-compose.yml` — Redis + n8n service orchestration

## Notes

- The current setup is aimed at local development and testing.
- For production usage, secure credentials, webhook URLs, and network configuration should be hardened.
- Review your n8n workflows in the UI to inspect execution logs, queue behavior, and processing results.

## License

This project currently does not define a license. Add a license file if you intend to publish or share it publicly.
