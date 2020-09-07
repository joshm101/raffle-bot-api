# raffle-bot-api

Node.js API/service for raffle bot web application UI

## Prerequisites

You must provide the expected environment variables to run this API.
Set the following variables to run in a development environment:

- `RAFFLE_BOT_API_DEV_DB_URL` - URL of development database to connect to.
- `RAFFLE_BOT_API_DEV_DB_USER` - Username for logging into development database.

- `RAFFLE_BOT_API_DEV_DB_PASSWORD` - Password for logging into development database.

To run in a production environment, set the following:

- `RAFFLE_BOT_API_PROD_DB_URL`: - URL of production database to connect to.
- `RAFFLE_BOT_API_PROD_DB_USER`: Username for logging into production database.
- `RAFFLE_BOT_API_PROD_DB_PASSWORD` Password for logging into production database.

## Running

Once the appropriate environment variables are set, check the `package.json` file for the list of available scripts/commands that you can run (e.g., `npm run start:dev` to start the development environment, etc.)
