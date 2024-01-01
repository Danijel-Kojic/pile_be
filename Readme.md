# Pile Financial Data Backend Application

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Danijel-Kojic/pile_be.git
   ```
1. Navigate to the project directory:
   ```bash
   cd pile_be
   ```

1. Install dependencies:
   ```bash
   npm install
   ```

1. Create a copy of the .env.example file and name it .env:
   ```bash
   cp .env.example .env
   ```

1. Modify the environment variables in the .env file according to your configuration, including PostgreSQL connection details.

1. Run database migrations:
   ```bash
   npm run seed
   ```

1. Start the application:
   ```bash
   npm start
   ```

## Test Instructions

### Automatic unit tests using Jest

Run the tests using the following command:
```bash
npm test
```

### Manual test using Postman

Find the Postman collection files in the "doc" directory. Use these files to interact with the API and test different endpoints.

## Containerization Instructions (Docker)

1. Build the Docker image:
   ```bash
   docker build -t pile_be .
   ```

1. Run the Docker container:
   ```bash
   docker-compose up
   ```

This will start both the Node.js application and the PostgreSQL database in separate containers.

Note: Make sure to set up environment variables in the .env file within the Docker container or adjust the docker-compose.yml file accordingly.
